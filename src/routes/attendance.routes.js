// src/routes/attendance.routes.js
import express from 'express';
import {
  listAttendance,
  createAttendance,
  getAttendance,
  updateAttendance,
  deleteAttendance,
  attendanceBySession,
  markSingleAttendance
} from '../controllers/attendance.controller.js';
import { authenticateToken } from '../middlewares/auth.js';
import { isFaculty } from '../middlewares/isFaculty.js';
import {
  attendanceIdParamValidator,
  createAttendanceValidator,
  updateAttendanceValidator
} from '../validators/attendance.validators.js';
import { validateFields } from '../middlewares/validateFields.js';
import { param } from 'express-validator';

const router = express.Router();

// List all attendance records
router.get('/', authenticateToken, listAttendance);

// Create a new attendance record
router.post('/', authenticateToken, createAttendanceValidator, validateFields, createAttendance);

// Routes with :id parameter
router.get('/:id', authenticateToken, attendanceIdParamValidator, validateFields, getAttendance);
router.patch('/:id', authenticateToken, attendanceIdParamValidator, updateAttendanceValidator, validateFields, updateAttendance);
router.delete('/:id', authenticateToken, attendanceIdParamValidator, validateFields, deleteAttendance);

// Get attendance by sessionId
router.get('/by-session/:sessionId', authenticateToken,
  [
    param('sessionId')
      .isInt({ gt: 0 })
      .withMessage('sessionId must be a positive integer')
  ],
  validateFields,
  attendanceBySession
);

// Mark single attendance (faculty only)
router.patch('/mark/:id', authenticateToken, isFaculty,
  attendanceIdParamValidator,
  updateAttendanceValidator,
  validateFields,
  markSingleAttendance
);

export default router;
