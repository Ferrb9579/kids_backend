// src/routes/permission.routes.js
import express from 'express';
import {
  listPermissions,
  createPermission,
  getPermission,
  updatePermission,
  deletePermission
} from '../controllers/permission.controller.js';
import { authenticateToken } from '../middlewares/auth.js';
import {
  permissionIdParamValidator,
  createPermissionValidator,
  updatePermissionValidator
} from '../validators/permission.validators.js';
import { validateFields } from '../middlewares/validateFields.js';

const router = express.Router();

// List all permissions
router.get('/', authenticateToken, listPermissions);

// Create a new permission
router.post('/', authenticateToken, createPermissionValidator, validateFields, createPermission);

// Routes with :id parameter
router.get('/:id', authenticateToken, permissionIdParamValidator, validateFields, getPermission);
router.patch('/:id', authenticateToken, permissionIdParamValidator, updatePermissionValidator, validateFields, updatePermission);
router.delete('/:id', authenticateToken, permissionIdParamValidator, validateFields, deletePermission);

export default router;
