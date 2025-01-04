// src/routes/eventRoleAssignment.routes.js
import express from 'express';
import {
    assignEventRole,
    removeEventRole,
} from '../controllers/eventRoleAssignment.controller.js';
import { authenticateToken } from '../middlewares/auth.js';
import { authorize } from '../middlewares/authorize.js';
import { MANAGE_USER_ROLES } from '../permissions.js'; // Adjust permission if different
import {
    assignEventRoleValidator,
    removeEventRoleValidator,
} from '../validators/eventRoleAssignment.validators.js';
import { validateFields } from '../middlewares/validateFields.js';

const router = express.Router();

// POST /api/event-role-assignments/assign
router.post(
    '/assign',
    authenticateToken,
    authorize(MANAGE_USER_ROLES), // Adjust permission if different
    assignEventRoleValidator,
    validateFields,
    assignEventRole
);

// POST /api/event-role-assignments/remove
router.post(
    '/remove',
    authenticateToken,
    authorize(MANAGE_USER_ROLES), // Adjust permission if different
    removeEventRoleValidator,
    validateFields,
    removeEventRole
);

export default router;
