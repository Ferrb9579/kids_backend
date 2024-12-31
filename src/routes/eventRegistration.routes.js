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

const router = express.Router();

router.get('/', authenticateToken, listEventRegistrations);
router.post('/', authenticateToken, createEventRegistration);
router.get('/:id', authenticateToken, getEventRegistration);
router.patch('/:id', authenticateToken, updateEventRegistration);
router.delete('/:id', authenticateToken, deleteEventRegistration);

router.get('/by-event/:eventId', authenticateToken, eventRegistrationsByEvent);

export default router;
