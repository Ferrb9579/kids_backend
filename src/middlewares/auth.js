// src/middlewares/auth.js
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import prisma from '../prisma.js';

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || 'some-super-secret';

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization']; // e.g., "Bearer <token>"
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ detail: 'No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;

    // Fetch User Roles
    const userRoles = await prisma.userRoleAssignment.findMany({
      where: { userId: decoded.id },
      include: { role: true },
    });
    req.userRoles = userRoles.map((ura) => ura.role);

    next();
  } catch (err) {
    return res.status(403).json({ detail: 'Invalid token.' });
  }
};
