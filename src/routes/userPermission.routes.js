// src/routes/userPermission.routes.js
import express from 'express';
import {
  listUserPermissions,
  createUserPermission,
  getUserPermission,
  updateUserPermission,
  deleteUserPermission,
  listUserPermissionsByUser
} from '../controllers/userPermission.controller.js';
import { authenticateToken } from '../middlewares/auth.js';
import {
  userPermissionIdParamValidator,
  createUserPermissionValidator,
  updateUserPermissionValidator,
  userIdParamValidator
} from '../validators/userPermission.validators.js';
import { validateFields } from '../middlewares/validateFields.js';

const router = express.Router();

// List all user permissions
router.get('/', authenticateToken, listUserPermissions);

// Create a new user permission
router.post('/', authenticateToken, createUserPermissionValidator, validateFields, createUserPermission);

// Routes with :id parameter
router.get('/:id', authenticateToken, userPermissionIdParamValidator, validateFields, getUserPermission);
router.patch('/:id', authenticateToken, userPermissionIdParamValidator, updateUserPermissionValidator, validateFields, updateUserPermission);
router.delete('/:id', authenticateToken, userPermissionIdParamValidator, validateFields, deleteUserPermission);

// Get user permissions by userId
router.get('/user/:userId', authenticateToken, 
  userIdParamValidator, 
  validateFields, 
  listUserPermissionsByUser
);

export default router;
