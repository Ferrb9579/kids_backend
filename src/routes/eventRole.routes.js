// src/routes/eventRole.routes.js
import express from 'express';
import {
    listEventRoles,
    createEventRole,
    getEventRole,
    updateEventRole,
    deleteEventRole,
} from '../controllers/eventRole.controller.js';
import { authenticateToken } from '../middlewares/auth.js';
import { authorize } from '../middlewares/authorize.js';
import { MANAGE_USER_ROLES } from '../permissions.js'; // Adjust permission if different
import {
    createEventRoleValidator,
    updateEventRoleValidator,
    roleIdParamValidator,
} from '../validators/eventRole.validators.js';
import { validateFields } from '../middlewares/validateFields.js';

const router = express.Router();

// GET /api/event-roles
router.get(
    '/',
    authenticateToken,
    authorize(MANAGE_USER_ROLES), // Adjust permission if different
    listEventRoles
);

// POST /api/event-roles
router.post(
    '/',
    authenticateToken,
    authorize(MANAGE_USER_ROLES), // Adjust permission if different
    createEventRoleValidator,
    validateFields,
    createEventRole
);

// GET /api/event-roles/:id
router.get(
    '/:id',
    authenticateToken,
    authorize(MANAGE_USER_ROLES), // Adjust permission if different
    roleIdParamValidator,
    validateFields,
    getEventRole
);

// PATCH /api/event-roles/:id
router.patch(
    '/:id',
    authenticateToken,
    authorize(MANAGE_USER_ROLES), // Adjust permission if different
    roleIdParamValidator,
    updateEventRoleValidator,
    validateFields,
    updateEventRole
);

// DELETE /api/event-roles/:id
router.delete(
    '/:id',
    authenticateToken,
    authorize(MANAGE_USER_ROLES), // Adjust permission if different
    roleIdParamValidator,
    validateFields,
    deleteEventRole
);

export default router;
