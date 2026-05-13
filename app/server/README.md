# Backend (auth + Stripe checkout)

## How to run (required for Sign in / Sign up)

1. Open a terminal and go into this folder:
   ```bash
   cd app/server
   ```
2. Install dependencies (first time only):
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm start
   ```
   You should see: **Server running on http://localhost:4242**

4. Check it’s up: open **http://localhost:4242/health** in your browser. You should see `{"ok":true,"message":"Backend is running"}`.

If the website says "Cannot reach server", the backend is not running — complete steps 1–3 above and keep that terminal open.

## Stripe key

- Put your secret key in **`.env`**:  
  `STRIPE_SECRET_KEY=sk_test_...`
- If you get "Invalid API Key", create a **new** secret key in [Stripe Dashboard → API keys](https://dashboard.stripe.com/test/apikeys) (Test mode ON → "Create secret key") and update `.env`.
