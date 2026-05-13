const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
// Users are stored in users.json: email, name, passwordHash (bcrypt). One account per email.

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readUsers() {
  ensureDataDir();
  if (!fs.existsSync(USERS_FILE)) {
    return [];
  }
  try {
    const raw = fs.readFileSync(USERS_FILE, 'utf8');
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch (e) {
    console.error('auth-store: read error', e.message);
    return [];
  }
}

function writeUsers(users) {
  ensureDataDir();
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
}

function findByEmail(email) {
  const normalized = String(email).trim().toLowerCase();
  return readUsers().find((u) => u.email === normalized);
}

function findById(id) {
  return readUsers().find((u) => u.id === id);
}

function createUser({ id, email, passwordHash, name }) {
  const users = readUsers();
  const normalizedEmail = String(email).trim().toLowerCase();
  if (users.some((u) => u.email === normalizedEmail)) {
    return null;
  }
  const user = {
    id: id || `user-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
    email: normalizedEmail,
    passwordHash,
    name: String(name || normalizedEmail.split('@')[0] || 'Customer').trim() || 'Customer',
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  writeUsers(users);
  return { id: user.id, email: user.email, name: user.name };
}

module.exports = {
  readUsers,
  writeUsers,
  findByEmail,
  findById,
  createUser,
};
