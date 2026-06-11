const jwt = require('jsonwebtoken');
const db = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || "schemesathi_secret_key_12345";

/**
 * Protect routes - require JWT Authentication
 */
async function protect(req, res, next) {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, JWT_SECRET);

      // Get user from database
      const user = await db.users.findById(decoded.id);
      if (!user) {
        return res.status(401).json({ success: false, message: "User not found associated with this token" });
      }

      // Append user to request
      req.user = user;
      next();
    } catch (err) {
      console.error("Auth Middleware Error:", err.message);
      return res.status(401).json({ success: false, message: "Not authorized, token validation failed" });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: "Not authorized, token missing in headers" });
  }
}

/**
 * Limit route to admin role only
 */
function adminOnly(req, res, next) {
  if (req.user && req.user.role === 'Admin') {
    next();
  } else {
    return res.status(403).json({ success: false, message: "Access denied, administrative privileges required" });
  }
}

module.exports = {
  protect,
  adminOnly,
  JWT_SECRET
};
