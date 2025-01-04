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
  facultyList,
  assignUserRoles
} from '../controllers/user.controller.js';
import {
  externalAuthValidator,
  userIdParamValidator,
  updateUserValidator,
  usernameQueryValidator
} from '../validators/user.validators.js';
import { validateFields } from '../middlewares/validateFields.js';
import { authenticateToken } from '../middlewares/auth.js';
import { authorize } from '../middlewares/authorize.js';
import { MANAGE_USERS, MANAGE_USER_ROLES, VIEW_EVENTS } from '../permissions.js';

const router = express.Router();

// Public route for external-auth with validations
router.post('/external-auth', externalAuthValidator, validateFields, externalAuth);

// Authenticated routes
router.get('/', authenticateToken, authorize(VIEW_EVENTS), usernameQueryValidator, validateFields, listUsers);
router.get('/faculty', authenticateToken, authorize(VIEW_EVENTS), facultyList);

// Routes with :id parameter
router.get('/:id', authenticateToken, authorize(VIEW_EVENTS), userIdParamValidator, validateFields, getUser);
router.patch('/:id', authenticateToken, authorize(MANAGE_USERS), userIdParamValidator, updateUserValidator, validateFields, updateUser);
router.delete('/:id', authenticateToken, authorize(MANAGE_USERS), userIdParamValidator, validateFields, deleteUser);

// Nested routes
router.get('/:id/events', authenticateToken, authorize(VIEW_EVENTS), userIdParamValidator, validateFields, userEvents);
router.get('/:id/attendance', authenticateToken, authorize(VIEW_EVENTS), userIdParamValidator, validateFields, userAttendance);

// Assign user roles
// router.post('/:id/assign-roles', authenticateToken, authorize(MANAGE_USER_ROLES), assignUserRoles);

export default router;
