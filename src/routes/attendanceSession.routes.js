// src/routes/attendanceSession.routes.js
import express from 'express';
import {
  listAttendanceSessions,
  createAttendanceSession,
  getAttendanceSession,
  updateAttendanceSession,
  deleteAttendanceSession,
  attendanceSessionsByEvent,
  markBulkAttendance
} from '../controllers/attendanceSession.controller.js';
import { authenticateToken } from '../middlewares/auth.js';
import {
  sessionIdParamValidator,
  createAttendanceSessionValidator,
  updateAttendanceSessionValidator,
  attendanceSessionsByEventParamValidator, // Ensure this is exported
  markBulkAttendanceValidator
} from '../validators/attendanceSession.validators.js';
import { validateFields } from '../middlewares/validateFields.js';

const router = express.Router();

// List all attendance sessions
router.get('/', authenticateToken, listAttendanceSessions);

// Create a new attendance session
router.post('/', authenticateToken, createAttendanceSessionValidator, validateFields, createAttendanceSession);

// Routes with :id parameter
router.get('/:id', authenticateToken, sessionIdParamValidator, validateFields, getAttendanceSession);
router.patch('/:id', authenticateToken, sessionIdParamValidator, updateAttendanceSessionValidator, validateFields, updateAttendanceSession);
router.delete('/:id', authenticateToken, sessionIdParamValidator, validateFields, deleteAttendanceSession);

// Get attendance sessions by eventId
router.get('/by-event/:eventId', authenticateToken,
  attendanceSessionsByEventParamValidator,
  validateFields,
  attendanceSessionsByEvent
);

// Mark bulk attendance
router.post('/:id/mark-attendance', authenticateToken,
  markBulkAttendanceValidator,
  validateFields,
  markBulkAttendance
);

export default router;
