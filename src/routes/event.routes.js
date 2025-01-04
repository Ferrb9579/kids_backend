// src/routes/event.routes.js
import express from 'express';
import {
  listEvents,
  createEvent,
  getEvent,
  updateEvent,
  deleteEvent,
  upcomingEvents,
  eventRegistrations,
  facultyEvents,
  assignEventRoles
} from '../controllers/event.controller.js';
import {
  eventIdParamValidator,
  createEventValidator,
  updateEventValidator,
  pageQueryValidator,
  facultyIdParamValidator
} from '../validators/event.validators.js';
import { validateFields } from '../middlewares/validateFields.js';
import { authenticateToken } from '../middlewares/auth.js';
import { authorize } from '../middlewares/authorize.js';
import { CREATE_EVENT, MODIFY_EVENTS, DELETE_EVENTS, VIEW_EVENTS, SEND_NOTIFICATIONS } from '../permissions.js';

const router = express.Router();

// List events with optional pagination and search
router.get('/', authenticateToken, authorize(VIEW_EVENTS), pageQueryValidator, validateFields, listEvents);

// Create a new event
router.post('/', authenticateToken, authorize(CREATE_EVENT), createEventValidator, validateFields, createEvent);

// Get upcoming events
router.get('/upcoming', authenticateToken, authorize(VIEW_EVENTS), upcomingEvents);

// Routes with :id parameter
router.get('/:id', authenticateToken, authorize(VIEW_EVENTS), eventIdParamValidator, validateFields, getEvent);
router.patch('/:id', authenticateToken, authorize(MODIFY_EVENTS), eventIdParamValidator, updateEventValidator, validateFields, updateEvent);
router.delete('/:id', authenticateToken, authorize(DELETE_EVENTS), eventIdParamValidator, validateFields, deleteEvent);

// Get event registrations by eventId
router.get('/:id/registrations', authenticateToken, authorize(VIEW_EVENTS), eventIdParamValidator, validateFields, eventRegistrations);

// Get events by facultyId
router.get('/by-faculty/:facultyId', authenticateToken,
  facultyIdParamValidator,
  authorize(VIEW_EVENTS),
  validateFields,
  facultyEvents
);

// Assign event roles
// router.post('/:id/assign-roles', authenticateToken, authorize(SEND_NOTIFICATIONS), assignEventRoles);

export default router;
