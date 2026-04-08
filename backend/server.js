const path = require("path");
const express = require("express");
const session = require("express-session");
const bcrypt = require("bcryptjs");

const { loadDb, saveDb, findUserByEmail, findUserById, createUser } = require("./storage");

const app = express();

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "dev-secret-change-me",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
    },
  })
);

function publicUser(u) {
  return { id: u.id, email: u.email, profile: u.profile || {} };
}

function currentUser(req) {
  const userId = req.session && req.session.userId;
  if (!userId) return null;
  const db = loadDb();
  return findUserById(db, userId);
}

app.get("/api/me", (req, res) => {
  const u = currentUser(req);
  if (!u) return res.json({ authenticated: false, user: null });
  return res.json({ authenticated: true, user: publicUser(u) });
});

app.post("/api/register", (req, res) => {
  const { email, password, firstName, lastName } = req.body || {};

  const em = String(email || "").trim();
  const pw = String(password || "");
  const fn = String(firstName || "").trim();
  const ln = String(lastName || "").trim();

  if (!em || !em.includes("@")) return res.status(400).json({ ok: false, error: "Please provide a valid email address." });
  if (!pw || pw.length < 8) return res.status(400).json({ ok: false, error: "Password must be at least 8 characters." });
  if (!fn || !ln) return res.status(400).json({ ok: false, error: "First name and last name are required." });

  const db = loadDb();
  if (findUserByEmail(db, em)) return res.status(409).json({ ok: false, error: "An account with this email already exists." });

  const passwordHash = bcrypt.hashSync(pw, 10);
  const user = createUser(db, { email: em, passwordHash, firstName: fn, lastName: ln });
  saveDb(db);

  req.session.userId = user.id;
  return res.json({ ok: true, user: publicUser(user) });
});

app.post("/api/login", (req, res) => {
  const { email, password } = req.body || {};
  const em = String(email || "").trim();
  const pw = String(password || "");
  if (!em || !pw) return res.status(400).json({ ok: false, error: "Email and password are required." });

  const db = loadDb();
  const user = findUserByEmail(db, em);
  if (!user || !bcrypt.compareSync(pw, String(user.passwordHash || ""))) {
    return res.status(401).json({ ok: false, error: "Invalid email or password." });
  }

  req.session.userId = user.id;
  return res.json({ ok: true, user: publicUser(user) });
});

app.post("/api/logout", (req, res) => {
  if (!req.session) return res.json({ ok: true });
  req.session.destroy(() => res.json({ ok: true }));
});

// Serve the existing static site from repo root
const repoRoot = path.join(__dirname, "..");
app.use(express.static(repoRoot));

// Ensure SPA-ish direct hits work for known pages
app.get("/", (req, res) => res.sendFile(path.join(repoRoot, "index.html")));

const port = Number(process.env.PORT || 5000);
app.listen(port, "127.0.0.1", () => {
  // eslint-disable-next-line no-console
  console.log(`Server running at http://127.0.0.1:${port}`);
});

