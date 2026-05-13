export const SHOPIFY_DOMAIN = "https://ascend-12496.myshopify.com";

export const SYSTEM_SINGLE_VARIANT_ID = "52974558019797";
export const PHASE_I_VARIANT_ID = "53325545832661";
export const PHASE_II_VARIANT_ID = "53325578535125";
export const PHASE_III_VARIANT_ID = "53325601505493";

export interface ShopifyCheckoutItem {
  variantId: string | number | null | undefined;
  quantity: number;
}

function normalizeVariantId(variantId: ShopifyCheckoutItem["variantId"]): string | null {
  const normalized = String(variantId ?? "").trim();
  if (!normalized || !/^\d+$/.test(normalized)) {
    return null;
  }
  return normalized;
}

function normalizeQuantity(quantity: number): number | null {
  if (!Number.isFinite(quantity) || quantity <= 0) {
    return null;
  }
  return Math.max(1, Math.floor(quantity));
}

export function buildCartPermalink(items: ShopifyCheckoutItem[]): string {
  const normalizedLineItems = items
    .map((item) => {
      const variantId = normalizeVariantId(item.variantId);
      const quantity = normalizeQuantity(item.quantity);

      if (!variantId || quantity === null) {
        return null;
      }

      return `${variantId}:${quantity}`;
    })
    .filter((lineItem): lineItem is string => Boolean(lineItem));

  if (normalizedLineItems.length === 0) {
    return "";
  }

  return `${SHOPIFY_DOMAIN}/cart/${normalizedLineItems.join(",")}`;
}

export function redirectToShopifyCheckout(items: ShopifyCheckoutItem[]): void {
  const checkoutUrl = buildCartPermalink(items);
  if (!checkoutUrl) {
    return;
  }

  window.location.href = checkoutUrl;
}

export function redirectToSystemSingle(): void {
  redirectToShopifyCheckout([{ variantId: SYSTEM_SINGLE_VARIANT_ID, quantity: 1 }]);
}

export function redirectToSystemThreeItem(): void {
  redirectToShopifyCheckout([
    { variantId: PHASE_I_VARIANT_ID, quantity: 1 },
    { variantId: PHASE_II_VARIANT_ID, quantity: 1 },
    { variantId: PHASE_III_VARIANT_ID, quantity: 1 },
  ]);
}

export function getProductUrlByHandle(handle: string): string {
  return `${SHOPIFY_DOMAIN}/products/${handle}`;
}

export function redirectToShopifySubscriptionProduct(handle: string): void {
  window.location.href = getProductUrlByHandle(handle);
}
