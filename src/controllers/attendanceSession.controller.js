// src/controllers/attendanceSession.controller.js
import prisma from '../prisma.js';
import { parseISO } from 'date-fns';

export const listAttendanceSessions = async (req, res) => {
  const sessions = await prisma.attendanceSession.findMany({
    include: { event: true },
  });
  return res.json(sessions);
};

export const createAttendanceSession = async (req, res) => {
  try {
    const { eventId, sessionDate } = req.body;
    const newSession = await prisma.attendanceSession.create({
      data: {
        eventId,
        sessionDate: sessionDate ? parseISO(sessionDate) : new Date(),
      },
    });
    return res.status(201).json(newSession);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export const getAttendanceSession = async (req, res) => {
  const id = parseInt(req.params.id);
  const session = await prisma.attendanceSession.findUnique({
    where: { id },
    include: { event: true },
  });
  if (!session) {
    return res.status(404).json({ detail: 'Attendance session not found.' });
  }
  return res.json(session);
};

export const updateAttendanceSession = async (req, res) => {
  const id = parseInt(req.params.id);
  const { eventId, sessionDate } = req.body;
  try {
    const updated = await prisma.attendanceSession.update({
      where: { id },
      data: {
        eventId,
        sessionDate: sessionDate ? parseISO(sessionDate) : undefined,
      },
    });
    return res.json(updated);
  } catch (error) {
    return res.status(404).json({ detail: 'Attendance session not found.' });
  }
};

export const deleteAttendanceSession = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    await prisma.attendanceSession.delete({ where: { id } });
    return res.json({ detail: 'Session deleted successfully.' });
  } catch (error) {
    return res.status(404).json({ detail: 'Attendance session not found.' });
  }
};

/**
 * GET /attendance-sessions/by-event/:eventId
 */
export const attendanceSessionsByEvent = async (req, res) => {
  const eventId = parseInt(req.params.eventId);
  const sessions = await prisma.attendanceSession.findMany({
    where: { eventId },
  });
  return res.json(sessions);
};

/**
 * POST /attendance-sessions/:id/mark-attendance
 * Mark bulk attendance for a session
 */
export const markBulkAttendance = async (req, res) => {
  const id = parseInt(req.params.id);
  const session = await prisma.attendanceSession.findUnique({
    where: { id },
  });
  if (!session) {
    return res.status(404).json({ detail: 'Session not found.' });
  }

  const { attendance_data } = req.body;
  if (!Array.isArray(attendance_data)) {
    return res
      .status(400)
      .json({ detail: 'attendance_data must be an array.' });
  }

  const createdRecords = [];
  for (let att of attendance_data) {
    const { userId, status, location } = att;
    // Try creating. If it fails because of unique constraint, just skip or update.
    try {
      const newAtt = await prisma.attendance.create({
        data: {
          attendanceSessionId: id,
          userId,
          status: status || 'present',
          location: location || '',
        },
      });
      createdRecords.push(newAtt);
    } catch (e) {
      // For simplicity, skip duplicates. 
      // Or you can do an upsert if you want to update existing attendance.
    }
  }

  return res.status(201).json(createdRecords);
};
