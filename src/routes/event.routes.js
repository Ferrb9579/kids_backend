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
  facultyEvents
} from '../controllers/event.controller.js';

import { authenticateToken } from '../middlewares/auth.js';
import { isEventCreator } from '../middlewares/isEventCreator.js';

const router = express.Router();

router.get('/', authenticateToken, listEvents);
router.post('/', authenticateToken, createEvent);
router.get('/upcoming', authenticateToken, upcomingEvents);

// For faculty-limited routes if needed, you can add the isFaculty middleware

router.get('/:id', authenticateToken, getEvent);
router.patch('/:id', authenticateToken, updateEvent);
router.delete('/:id', authenticateToken, deleteEvent);

router.get('/:id/registrations', authenticateToken, eventRegistrations);
router.get('/by-faculty/:facultyId', authenticateToken, facultyEvents);

export default router;
