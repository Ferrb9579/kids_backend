// src/routes/userRole.routes.js
import express from 'express';
import {
    listUserRoles,
    createUserRole,
    getUserRole,
    updateUserRole,
    deleteUserRole,
} from '../controllers/userRole.controller.js';
import { authenticateToken } from '../middlewares/auth.js';
import { authorize } from '../middlewares/authorize.js';
import { MANAGE_USER_ROLES } from '../permissions.js';
import {
    createUserRoleValidator,
    updateUserRoleValidator,
    roleIdParamValidator,
} from '../validators/userRole.validators.js';
import { validateFields } from '../middlewares/validateFields.js';

const router = express.Router();

// GET /api/user-roles
router.get(
    '/',
    authenticateToken,
    authorize(MANAGE_USER_ROLES),
    listUserRoles
);

// POST /api/user-roles
router.post(
    '/',
    authenticateToken,
    authorize(MANAGE_USER_ROLES),
    createUserRoleValidator,
    validateFields,
    createUserRole
);

// GET /api/user-roles/:id
router.get(
    '/:id',
    authenticateToken,
    authorize(MANAGE_USER_ROLES),
    roleIdParamValidator,
    validateFields,
    getUserRole
);

// PATCH /api/user-roles/:id
router.patch(
    '/:id',
    authenticateToken,
    authorize(MANAGE_USER_ROLES),
    roleIdParamValidator,
    updateUserRoleValidator,
    validateFields,
    updateUserRole
);

// DELETE /api/user-roles/:id
router.delete(
    '/:id',
    authenticateToken,
    authorize(MANAGE_USER_ROLES),
    roleIdParamValidator,
    validateFields,
    deleteUserRole
);

export default router;
