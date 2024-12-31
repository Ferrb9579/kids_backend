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

const router = express.Router();

router.get('/', authenticateToken, listAttendanceSessions);
router.post('/', authenticateToken, createAttendanceSession);
router.get('/:id', authenticateToken, getAttendanceSession);
router.patch('/:id', authenticateToken, updateAttendanceSession);
router.delete('/:id', authenticateToken, deleteAttendanceSession);

router.get('/by-event/:eventId', authenticateToken, attendanceSessionsByEvent);
router.post('/:id/mark-attendance', authenticateToken, markBulkAttendance);

export default router;
