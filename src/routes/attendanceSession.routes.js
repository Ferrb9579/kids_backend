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
  attendanceSessionsByEventParamValidator,
  markBulkAttendanceValidator
} from '../validators/attendanceSession.validators.js';
import { validateFields } from '../middlewares/validateFields.js';
import { authorize } from '../middlewares/authorize.js';
import { CREATE_EVENT, MODIFY_EVENTS, DELETE_EVENTS, VIEW_ATTENDANCE, MARK_ATTENDANCE } from '../permissions.js';

const router = express.Router();

// List all attendance sessions
router.get('/', authenticateToken, authorize(VIEW_ATTENDANCE), listAttendanceSessions);

// Create a new attendance session
router.post('/', authenticateToken, authorize(CREATE_EVENT), createAttendanceSessionValidator, validateFields, createAttendanceSession);

// Routes with :id parameter
router.get('/:id', authenticateToken, authorize(VIEW_ATTENDANCE), sessionIdParamValidator, validateFields, getAttendanceSession);
router.patch('/:id', authenticateToken, authorize(MODIFY_EVENTS), sessionIdParamValidator, updateAttendanceSessionValidator, validateFields, updateAttendanceSession);
router.delete('/:id', authenticateToken, authorize(DELETE_EVENTS), sessionIdParamValidator, validateFields, deleteAttendanceSession);

// Get attendance sessions by eventId
router.get('/by-event/:eventId', authenticateToken,
  attendanceSessionsByEventParamValidator,
  authorize(VIEW_ATTENDANCE),
  validateFields,
  attendanceSessionsByEvent
);

// Mark bulk attendance
router.post('/:id/mark-attendance', authenticateToken,
  authorize(MARK_ATTENDANCE),
  markBulkAttendanceValidator,
  validateFields,
  markBulkAttendance
);

export default router;
