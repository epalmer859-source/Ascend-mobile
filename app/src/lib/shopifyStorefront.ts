type StorefrontResponse<T> = {
  data?: T;
  errors?: { message: string }[];
};

export interface SellingPlanOption {
  sellingPlanId: string;
  name: string;
}

/** Find a selling plan that matches the given refill interval (e.g. 4 = "every 4 weeks"). */
export function getSellingPlanIdForWeeks(
  plans: SellingPlanOption[],
  weeks: number
): string | null {
  for (const plan of plans) {
    const name = (plan.name || "").toLowerCase();
    const numMatch = name.match(/\b(\d+)\s*week/i);
    if (numMatch && parseInt(numMatch[1], 10) === weeks) return plan.sellingPlanId;
    if (name.includes("week") && new RegExp(`\\b${weeks}\\b`).test(name)) return plan.sellingPlanId;
  }
  return plans[0]?.sellingPlanId ?? null;
}

export interface StorefrontCartLineInput {
  merchandiseId: string | number;
  quantity: number;
  sellingPlanId?: string | number;
}

const STOREFRONT_ENDPOINT = "https://ascend-12496.myshopify.com/api/2026-01/graphql.json";

function normalizeVariantGid(variantId: string | number): string {
  const raw = String(variantId).trim();
  if (!raw) throw new Error("Missing variant ID for checkout line.");
  return raw.startsWith("gid://shopify/ProductVariant/")
    ? raw
    : `gid://shopify/ProductVariant/${raw}`;
}

function normalizeSellingPlanGid(sellingPlanId: string | number): string {
  const raw = String(sellingPlanId).trim();
  if (!raw) throw new Error("Missing selling plan ID for subscription line.");
  return raw.startsWith("gid://shopify/SellingPlan/")
    ? raw
    : `gid://shopify/SellingPlan/${raw}`;
}

function getStorefrontToken(): string {
  const token = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN as string | undefined;
  if (!token || !String(token).trim()) {
    throw new Error("Storefront API token missing. Set VITE_SHOPIFY_STOREFRONT_TOKEN.");
  }
  return String(token).trim();
}

/** Reusable Storefront GraphQL client. */
export async function storefrontFetch<TData>(
  query: string,
  variables?: Record<string, unknown>
): Promise<StorefrontResponse<TData>> {
  const token = getStorefrontToken();
  const response = await fetch(STOREFRONT_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Storefront request failed (${response.status}): ${body || "No response body"}`);
  }

  return (await response.json()) as StorefrontResponse<TData>;
}

function normalizeCartLines(lines: StorefrontCartLineInput[]): Array<{
  merchandiseId: string;
  quantity: number;
  sellingPlanId?: string;
}> {
  return lines.map((line) => {
    const quantity = Math.max(1, Math.floor(Number(line.quantity) || 1));
    const merchandiseId = normalizeVariantGid(line.merchandiseId);

    const hasSellingPlan =
      line.sellingPlanId !== undefined &&
      line.sellingPlanId !== null &&
      String(line.sellingPlanId).trim() !== "";

    if (!hasSellingPlan) {
      return { merchandiseId, quantity };
    }

    return {
      merchandiseId,
      quantity,
      sellingPlanId: normalizeSellingPlanGid(line.sellingPlanId!),
    };
  });
}

type CartCreateMutationData = {
  cartCreate: {
    cart: { id: string; checkoutUrl: string } | null;
    userErrors: Array<{ field: string[] | null; message: string }>;
  };
};

/**
 * Create a cart via Storefront cartCreate, then redirect to checkoutUrl.
 * Lines must use full GIDs; numeric IDs are normalized automatically.
 * Subscription lines must include sellingPlanId (also normalized to GID).
 */
export async function createCartAndCheckout(lines: StorefrontCartLineInput[]): Promise<string> {
  const mutation = `
    mutation cartCreate($lines: [CartLineInput!]!) {
      cartCreate(input: { lines: $lines }) {
        cart {
          id
          checkoutUrl
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const normalizedLines = normalizeCartLines(lines);

  const payload = await storefrontFetch<CartCreateMutationData>(mutation, {
    lines: normalizedLines,
  });
  console.log("[shopify] cartCreate full response", payload);

  if (payload.errors?.length) {
    console.error("[shopify] cartCreate top-level errors", payload.errors);
    throw new Error(payload.errors.map((e) => e.message).join(" "));
  }

  const cartCreateResult = payload.data?.cartCreate;
  if (!cartCreateResult) {
    throw new Error("Storefront cartCreate response missing.");
  }

  if (cartCreateResult.userErrors.length > 0) {
    console.error("[shopify] cartCreate userErrors", cartCreateResult.userErrors);
    throw new Error(cartCreateResult.userErrors.map((e) => e.message).join(" "));
  }

  const checkoutUrl = cartCreateResult.cart?.checkoutUrl;
  if (!checkoutUrl) {
    throw new Error("Shopify did not return checkoutUrl.");
  }

  window.location.href = checkoutUrl;
  return checkoutUrl;
}

async function storefrontRequest<TData>(
  query: string,
  variables?: Record<string, unknown>
): Promise<TData> {
  const payload = await storefrontFetch<TData>(query, variables);
  if (payload.errors?.length) {
    throw new Error(payload.errors.map((e) => e.message).join(" "));
  }
  if (!payload.data) {
    throw new Error("Storefront response missing data.");
  }
  return payload.data;
}

type SellingPlansByHandleQueryData = {
  productByHandle: {
    sellingPlanGroups: {
      nodes: Array<{
        sellingPlans: {
          nodes: Array<{ id: string; name: string }>;
        };
      }>;
    };
  } | null;
};

type SellingPlansByVariantQueryData = {
  productByHandle: {
    variants: {
      nodes: Array<{
        id: string;
        sellingPlanAllocations: {
          nodes: Array<{ sellingPlan: { id: string; name: string } }>;
        };
      }>;
    };
  } | null;
};

export async function getSellingPlansForHandle(handle: string): Promise<SellingPlanOption[]> {
  const query = `
    query ProductSellingPlansByHandle($handle: String!) {
      productByHandle(handle: $handle) {
        sellingPlanGroups(first: 20) {
          nodes {
            sellingPlans(first: 50) {
              nodes { id name }
            }
          }
        }
      }
    }
  `;
  const data = await storefrontRequest<SellingPlansByHandleQueryData>(query, { handle });
  const product = data.productByHandle;
  if (!product) return [];
  const byId = new Map<string, SellingPlanOption>();
  for (const group of product.sellingPlanGroups.nodes) {
    for (const plan of group.sellingPlans.nodes) {
      byId.set(plan.id, { sellingPlanId: plan.id, name: plan.name });
    }
  }
  return Array.from(byId.values());
}

export async function getSellingPlansForVariant(
  handle: string,
  variantId: string
): Promise<SellingPlanOption[]> {
  const query = `
    query ProductSellingPlansByVariant($handle: String!) {
      productByHandle(handle: $handle) {
        variants(first: 100) {
          nodes {
            id
            sellingPlanAllocations(first: 50) {
              nodes { sellingPlan { id name } }
            }
          }
        }
      }
    }
  `;
  const data = await storefrontRequest<SellingPlansByVariantQueryData>(query, { handle });
  const product = data.productByHandle;
  if (!product) return [];
  const target = product.variants.nodes.find((v) => v.id.endsWith(`/${variantId}`));
  if (!target) return [];
  const byId = new Map<string, SellingPlanOption>();
  for (const a of target.sellingPlanAllocations.nodes) {
    byId.set(a.sellingPlan.id, { sellingPlanId: a.sellingPlan.id, name: a.sellingPlan.name });
  }
  return Array.from(byId.values());
}

/** Backward-compatible: returns checkout URL without redirecting (caller can redirect). */
export async function createStorefrontCartAndGetCheckoutUrl(
  lines: StorefrontCartLineInput[]
): Promise<string> {
  const normalizedLines = normalizeCartLines(lines);
  const mutation = `
    mutation cartCreate($lines: [CartLineInput!]!) {
      cartCreate(input: { lines: $lines }) {
        cart { id checkoutUrl }
        userErrors { field message }
      }
    }
  `;
  const payload = await storefrontFetch<CartCreateMutationData>(mutation, {
    lines: normalizedLines,
  });
  if (payload.errors?.length) {
    console.error("[shopify] cartCreate top-level errors", payload.errors);
    throw new Error(payload.errors.map((e) => e.message).join(" "));
  }
  const result = payload.data?.cartCreate;
  if (!result) throw new Error("Storefront cartCreate response missing.");
  if (result.userErrors.length > 0) {
    console.error("[shopify] cartCreate userErrors", result.userErrors);
    throw new Error(result.userErrors.map((e) => e.message).join(" "));
  }
  const url = result.cart?.checkoutUrl;
  if (!url) throw new Error("Shopify did not return checkoutUrl.");
  return url;
}
