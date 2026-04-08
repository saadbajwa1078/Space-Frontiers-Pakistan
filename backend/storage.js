const fs = require("fs");
const path = require("path");

const dataDir = path.join(__dirname, "data");
const dbFile = path.join(dataDir, "db.json");

function ensureDbExists() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  if (fs.existsSync(dbFile)) return;
  const initial = { nextUserId: 1, users: [] };
  fs.writeFileSync(dbFile, JSON.stringify(initial, null, 2), "utf8");
}

function loadDb() {
  ensureDbExists();
  const raw = fs.readFileSync(dbFile, "utf8");
  if (!raw.trim()) return { nextUserId: 1, users: [] };
  return JSON.parse(raw);
}

function saveDb(db) {
  ensureDbExists();
  const tmp = dbFile + ".tmp";
  fs.writeFileSync(tmp, JSON.stringify(db, null, 2), "utf8");
  fs.renameSync(tmp, dbFile);
}

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function findUserByEmail(db, email) {
  const e = normalizeEmail(email);
  return (db.users || []).find((u) => String(u.email || "").toLowerCase() === e) || null;
}

function findUserById(db, id) {
  const n = Number(id);
  return (db.users || []).find((u) => Number(u.id) === n) || null;
}

function createUser(db, { email, passwordHash, firstName, lastName }) {
  const user = {
    id: Number(db.nextUserId || 1),
    email: normalizeEmail(email),
    passwordHash,
    createdAt: new Date().toISOString(),
    profile: { firstName: String(firstName || "").trim(), lastName: String(lastName || "").trim() },
  };
  db.users = db.users || [];
  db.users.push(user);
  db.nextUserId = Number(user.id) + 1;
  return user;
}

module.exports = {
  dbFile,
  loadDb,
  saveDb,
  findUserByEmail,
  findUserById,
  createUser,
};

