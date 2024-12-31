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

const router = express.Router();

router.get('/', authenticateToken, listAttendance);
router.post('/', authenticateToken, createAttendance);
router.get('/:id', authenticateToken, getAttendance);
router.patch('/:id', authenticateToken, updateAttendance);
router.delete('/:id', authenticateToken, deleteAttendance);

router.get('/by-session/:sessionId', authenticateToken, attendanceBySession);

// Mark single attendance, faculty only
router.patch('/mark/:id', authenticateToken, isFaculty, markSingleAttendance);

export default router;
