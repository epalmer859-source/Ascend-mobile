const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const authStore = require('./auth-store');

// Key from .env, or fallback (Stripe optional so auth works without it)
require("dotenv").config();
const stripeKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeKey ? require("stripe")(stripeKey) : null;

const app = express();
const PORT = process.env.PORT || 4242;

app.use(cors({ origin: true }));
app.use(express.json());

// Health check: open http://localhost:4242/health in a browser to confirm the server is running
app.get('/health', (req, res) => {
  res.json({ ok: true, message: 'Backend is running' });
});

// ----- Auth: email and password stored in server/data/users.json (password hashed with bcrypt) -----
const SALT_ROUNDS = 10;

app.post('/auth/signup', (req, res) => {
  try {
    const { email, password, confirmPassword, name } = req.body || {};
    const trimmedEmail = String(email || '').trim().toLowerCase();
    const pw = String(password || '');
    const confirm = String(confirmPassword || '');

    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      return res.status(400).json({ error: 'Valid email is required.' });
    }
    if (pw.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    }
    if (pw !== confirm) {
      return res.status(400).json({ error: 'Password and confirm password do not match.' });
    }

    const existing = authStore.findByEmail(trimmedEmail);
    if (existing) {
      return res.status(409).json({
        error: 'You already have an account with this email. Please sign in instead.',
      });
    }

    const passwordHash = bcrypt.hashSync(pw, SALT_ROUNDS);
    const displayName = String(name || '').trim() || trimmedEmail.split('@')[0] || 'Customer';
    const user = authStore.createUser({
      email: trimmedEmail,
      passwordHash,
      name: displayName,
    });

    if (!user) {
      return res.status(500).json({ error: 'Could not create account. Try again.' });
    }
    return res.json({ user: { id: user.id, email: user.email, name: user.name } });
  } catch (err) {
    console.error('auth/signup error:', err);
    return res.status(500).json({ error: 'Something went wrong. Try again.' });
  }
});

app.post('/auth/login', (req, res) => {
  try {
    const { email, password } = req.body || {};
    const trimmedEmail = String(email || '').trim().toLowerCase();
    const pw = String(password || '');

    if (!trimmedEmail || !pw) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const existing = authStore.findByEmail(trimmedEmail);
    if (!existing) {
      return res.status(401).json({
        error: "You don't have an account with this email yet. Please sign up first.",
      });
    }

    const match = bcrypt.compareSync(pw, existing.passwordHash);
    if (!match) {
      return res.status(401).json({ error: 'Incorrect password.' });
    }

    return res.json({
      user: { id: existing.id, email: existing.email, name: existing.name },
    });
  } catch (err) {
    console.error('auth/login error:', err);
    return res.status(500).json({ error: 'Something went wrong. Try again.' });
  }
});

// Validate key on startup and log exact Stripe error if invalid
async function validateStripeKey() {
  if (!stripe) return false;
  try {
    await stripe.balance.retrieve();
    console.log('Stripe API key OK');
    return true;
  } catch (err) {
    console.error('Stripe key validation failed:');
    console.error('  code:', err.code);
    console.error('  message:', err.message);
    if (err.raw) console.error('  raw:', JSON.stringify(err.raw, null, 2));
    return false;
  }
}

// Create Stripe Checkout Session (requires STRIPE_SECRET_KEY in .env)
app.post('/create-checkout-session', async (req, res) => {
  if (!stripe) {
    return res.status(503).json({ error: 'Checkout is not configured. Add STRIPE_SECRET_KEY to server .env' });
  }
  try {
    const { items, shippingAmount = 0, successUrl, cancelUrl } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Items are required' });
    }
    if (!successUrl || !cancelUrl) {
      return res.status(400).json({ error: 'successUrl and cancelUrl are required' });
    }

    const lineItems = items.map((item) => ({
      price_data: {
        currency: 'usd',
        unit_amount: Math.round(Number(item.price) * 100), // dollars -> cents
        product_data: {
          name: item.name,
          ...(item.image && { images: [item.image] }),
        },
      },
      quantity: Number(item.quantity) || 1,
    }));

    if (shippingAmount > 0) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          unit_amount: Math.round(Number(shippingAmount) * 100),
          product_data: {
            name: 'Shipping',
          },
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error('Stripe error:', err.message);
    res.status(500).json({ error: err.message || 'Failed to create checkout session' });
  }
});

// Start server so auth and other routes work even if Stripe is not configured
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  validateStripeKey().then((ok) => {
    if (!ok) {
      console.warn('Stripe: key missing or invalid. Checkout will fail until you set STRIPE_SECRET_KEY in .env');
    }
  });
});
