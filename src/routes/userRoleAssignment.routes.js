// src/routes/userRoleAssignment.routes.js
import express from 'express';
import {
    assignUserRole,
    removeUserRole,
} from '../controllers/userRoleAssignment.controller.js';
import { authenticateToken } from '../middlewares/auth.js';
import { authorize } from '../middlewares/authorize.js';
import { MANAGE_USER_ROLES } from '../permissions.js';
import {
    assignUserRoleValidator,
    removeUserRoleValidator,
} from '../validators/userRoleAssignment.validators.js';
import { validateFields } from '../middlewares/validateFields.js';

const router = express.Router();

// POST /api/user-role-assignments/assign
router.post(
    '/assign',
    authenticateToken,
    authorize(MANAGE_USER_ROLES),
    assignUserRoleValidator,
    validateFields,
    assignUserRole
);

// POST /api/user-role-assignments/remove
router.post(
    '/remove',
    authenticateToken,
    authorize(MANAGE_USER_ROLES),
    removeUserRoleValidator,
    validateFields,
    removeUserRole
);

export default router;
