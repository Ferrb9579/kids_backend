// src/routes/eventRegistration.routes.js
import express from 'express';
import {
  listEventRegistrations,
  createEventRegistration,
  getEventRegistration,
  updateEventRegistration,
  deleteEventRegistration,
  eventRegistrationsByEvent
} from '../controllers/eventRegistration.controller.js';
import { authenticateToken } from '../middlewares/auth.js';
import {
  registrationIdParamValidator,
  createEventRegistrationValidator,
  updateEventRegistrationValidator,
  eventIdParamValidator
} from '../validators/eventRegistration.validators.js';
import { validateFields } from '../middlewares/validateFields.js';
import { authorize } from '../middlewares/authorize.js';
import { CREATE_EVENT, MANAGE_USERS, VIEW_EVENTS, SEND_NOTIFICATIONS } from '../permissions.js';

const router = express.Router();

// List all event registrations
router.get('/', authenticateToken, authorize(VIEW_EVENTS), listEventRegistrations);

// Create a new event registration
router.post('/', authenticateToken, authorize(CREATE_EVENT), createEventRegistrationValidator, validateFields, createEventRegistration);

// Routes with :id parameter
router.get('/:id', authenticateToken, authorize(VIEW_EVENTS), registrationIdParamValidator, validateFields, getEventRegistration);
router.patch('/:id', authenticateToken, authorize(MANAGE_USERS), updateEventRegistrationValidator, validateFields, updateEventRegistration);
router.delete('/:id', authenticateToken, authorize(MANAGE_USERS), registrationIdParamValidator, validateFields, deleteEventRegistration);

// Get event registrations by eventId
router.get('/by-event/:eventId', authenticateToken,
  eventIdParamValidator,
  authorize(VIEW_EVENTS),
  validateFields,
  eventRegistrationsByEvent
);

export default router;
