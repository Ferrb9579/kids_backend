// src/middlewares/isFaculty.js
export const isFaculty = (req, res, next) => {
    if (req.user.role !== 'faculty') {
      return res.status(403).json({ detail: 'Only faculty can access this.' });
    }
    next();
  };
  