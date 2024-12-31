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

const router = express.Router();

router.get('/', authenticateToken, listUserPermissions);
router.post('/', authenticateToken, createUserPermission);
router.get('/:id', authenticateToken, getUserPermission);
router.patch('/:id', authenticateToken, updateUserPermission);
router.delete('/:id', authenticateToken, deleteUserPermission);

router.get('/user/:userId', authenticateToken, listUserPermissionsByUser);

export default router;
