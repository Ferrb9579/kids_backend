// src/routes/user.routes.js
import express from 'express';
import {
  externalAuth,
  listUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  userEvents,
  userAttendance,
  facultyList
} from '../controllers/user.controller.js';
import { createUserValidator } from '../validators/user.validators.js';
import { authenticateToken } from '../middlewares/auth.js';

const router = express.Router();

// Public route for external-auth
router.post('/external-auth', externalAuth);

// Authenticated routes
router.get('/', authenticateToken, listUsers);

// Create user (with validation + auth)
router.post('/', authenticateToken, createUserValidator, createUser);

router.get('/faculty', authenticateToken, facultyList);

router.get('/:id', authenticateToken, getUser);
router.patch('/:id', authenticateToken, updateUser);
router.delete('/:id', authenticateToken, deleteUser);

router.get('/:id/events', authenticateToken, userEvents);
router.get('/:id/attendance', authenticateToken, userAttendance);

export default router;
