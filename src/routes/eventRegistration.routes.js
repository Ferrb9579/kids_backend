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
import { param } from 'express-validator';

const router = express.Router();

// List all event registrations
router.get('/', authenticateToken, listEventRegistrations);

// Create a new event registration
router.post('/', authenticateToken, createEventRegistrationValidator, validateFields, createEventRegistration);

// Routes with :id parameter
router.get('/:id', authenticateToken, registrationIdParamValidator, validateFields, getEventRegistration);
router.patch('/:id', authenticateToken, registrationIdParamValidator, updateEventRegistrationValidator, validateFields, updateEventRegistration);
router.delete('/:id', authenticateToken, registrationIdParamValidator, validateFields, deleteEventRegistration);

// Get event registrations by eventId
router.get('/by-event/:eventId', authenticateToken,
  eventIdParamValidator,
  validateFields,
  eventRegistrationsByEvent
);

export default router;
