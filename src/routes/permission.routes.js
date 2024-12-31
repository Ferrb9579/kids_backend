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

const router = express.Router();

router.get('/', authenticateToken, listPermissions);
router.post('/', authenticateToken, createPermission);
router.get('/:id', authenticateToken, getPermission);
router.patch('/:id', authenticateToken, updatePermission);
router.delete('/:id', authenticateToken, deletePermission);

export default router;
