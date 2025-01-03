// src/routes/event.routes.js
import express from 'express';
import { param } from 'express-validator'; // Optional if not using directly
import {
  listEvents,
  createEvent,
  getEvent,
  updateEvent,
  deleteEvent,
  upcomingEvents,
  eventRegistrations,
  facultyEvents
} from '../controllers/event.controller.js';
import {
  eventIdParamValidator,
  createEventValidator,
  updateEventValidator,
  pageQueryValidator,
  facultyIdParamValidator // Import the new validator
} from '../validators/event.validators.js';
import { validateFields } from '../middlewares/validateFields.js';
import { authenticateToken } from '../middlewares/auth.js';

const router = express.Router();

// List events with optional pagination and search
router.get('/', authenticateToken, pageQueryValidator, validateFields, listEvents);

// Create a new event
router.post('/', authenticateToken, createEventValidator, validateFields, createEvent);

// Get upcoming events
router.get('/upcoming', authenticateToken, upcomingEvents);

// Routes with :id parameter
router.get('/:id', authenticateToken, eventIdParamValidator, validateFields, getEvent);
router.patch('/:id', authenticateToken, eventIdParamValidator, updateEventValidator, validateFields, updateEvent);
router.delete('/:id', authenticateToken, eventIdParamValidator, validateFields, deleteEvent);

// Get event registrations by eventId
router.get('/:id/registrations', authenticateToken, eventIdParamValidator, validateFields, eventRegistrations);

// Get events by facultyId using the new validator
router.get('/by-faculty/:facultyId', authenticateToken,
  facultyIdParamValidator, // Use the pre-defined validator
  validateFields,
  facultyEvents
);

export default router;
