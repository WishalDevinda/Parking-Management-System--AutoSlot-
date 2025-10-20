// backend/utils/auth.js
const jwt = require("jsonwebtoken");
const SECRET = process.env.JWT_SECRET || "dev_secret_change_me";
const COOKIE_NAME = "auth_token";

function issueToken(payload, res) {
  const token = jwt.sign(payload, SECRET, { expiresIn: "7d" });
  // HttpOnly cookie so JS can’t read it
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: false, // set true in production (HTTPS)
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  return token;
}

function authMiddleware(req, res, next) {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) return res.status(401).json({ message: "Unauthorized", status: "error" });

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded; // { driverID, emailAddress, role? }
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token", status: "error" });
  }
}

module.exports = { issueToken, authMiddleware, COOKIE_NAME };
