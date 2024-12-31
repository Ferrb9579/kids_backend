// src/middlewares/auth.js
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || 'some-super-secret';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']; // e.g. "Bearer <token>"
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ detail: 'No token provided.' });
  }

  jwt.verify(token, JWT_SECRET, (err, userPayload) => {
    if (err) return res.status(403).json({ detail: 'Invalid token.' });
    // Attach user payload (userId, role, etc.) to request
    req.user = userPayload;
    next();
  });
};
