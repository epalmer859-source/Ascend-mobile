/**
 * Run: node test-stripe-key.js
 * Uses STRIPE_SECRET_KEY from .env and prints Stripe's exact response.
 */
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '.env') });

let raw = process.env.STRIPE_SECRET_KEY || '';
if (!raw || raw.length < 50) {
  const content = fs.readFileSync(path.join(__dirname, '.env'), 'utf8');
  const m = content.match(/STRIPE_SECRET_KEY\s*=\s*(.+)/);
  if (m) raw = m[1].trim();
}
const keyMatch = raw.replace(/[\s\r\n'"`]/g, '').match(/^(sk_[a-zA-Z0-9_]+)/);
const key = keyMatch ? keyMatch[1] : null;

if (!key) {
  console.error('No key found in .env');
  process.exit(1);
}

console.log('Key length:', key.length);
console.log('Key prefix:', key.slice(0, 12) + '...');
console.log('Calling Stripe...\n');

const stripe = require('stripe')(key);
stripe.balance.retrieve()
  .then(() => console.log('SUCCESS: Key is valid.'))
  .catch((err) => {
    console.error('Stripe error:');
    console.error('  code:', err.code);
    console.error('  message:', err.message);
    if (err.raw) console.error('  raw:', err.raw);
    process.exit(1);
  });
