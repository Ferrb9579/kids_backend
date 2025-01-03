// src/routes/user.routes.js
import express from 'express';
import {
  externalAuth,
  listUsers,
  getUser,
  updateUser,
  deleteUser,
  userEvents,
  userAttendance,
  facultyList
} from '../controllers/user.controller.js';
import {
  externalAuthValidator,
  userIdParamValidator,
  updateUserValidator,
  usernameQueryValidator
} from '../validators/user.validators.js';
import { validateFields } from '../middlewares/validateFields.js';
import { authenticateToken } from '../middlewares/auth.js';

const router = express.Router();

// Public route for external-auth with validations
router.post('/external-auth', externalAuthValidator, validateFields, externalAuth);

// Authenticated routes
router.get('/', authenticateToken, usernameQueryValidator, validateFields, listUsers);
router.get('/faculty', authenticateToken, facultyList);

// Routes with :id parameter
router.get('/:id', authenticateToken, userIdParamValidator, validateFields, getUser);
router.patch('/:id', authenticateToken, userIdParamValidator, updateUserValidator, validateFields, updateUser);
router.delete('/:id', authenticateToken, userIdParamValidator, validateFields, deleteUser);

// Nested routes
router.get('/:id/events', authenticateToken, userIdParamValidator, validateFields, userEvents);
router.get('/:id/attendance', authenticateToken, userIdParamValidator, validateFields, userAttendance);

export default router;
