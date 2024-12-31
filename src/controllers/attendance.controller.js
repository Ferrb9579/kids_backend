// src/controllers/attendance.controller.js
import prisma from '../prisma.js';

export const listAttendance = async (req, res) => {
  const records = await prisma.attendance.findMany({
    include: { user: true, attendanceSession: true },
  });
  return res.json(records);
};

export const createAttendance = async (req, res) => {
  try {
    const { userId, attendanceSessionId, location, status } = req.body;
    const newRecord = await prisma.attendance.create({
      data: {
        userId,
        attendanceSessionId,
        location: location || '',
        status: status || 'present',
      },
    });
    return res.status(201).json(newRecord);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export const getAttendance = async (req, res) => {
  const id = parseInt(req.params.id);
  const record = await prisma.attendance.findUnique({
    where: { id },
    include: { user: true, attendanceSession: true },
  });
  if (!record) {
    return res.status(404).json({ detail: 'Attendance record not found.' });
  }
  return res.json(record);
};

export const updateAttendance = async (req, res) => {
  const id = parseInt(req.params.id);
  const { location, status } = req.body;
  try {
    const updated = await prisma.attendance.update({
      where: { id },
      data: { location, status },
    });
    return res.json(updated);
  } catch (error) {
    return res.status(404).json({ detail: 'Attendance record not found.' });
  }
};

export const deleteAttendance = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    await prisma.attendance.delete({ where: { id } });
    return res.json({ detail: 'Attendance deleted successfully.' });
  } catch (error) {
    return res.status(404).json({ detail: 'Attendance record not found.' });
  }
};

/**
 * GET /attendance/by-session/:sessionId
 */
export const attendanceBySession = async (req, res) => {
  const sessionId = parseInt(req.params.sessionId);
  const records = await prisma.attendance.findMany({
    where: { attendanceSessionId: sessionId },
    include: { user: true },
  });
  return res.json(records);
};

/**
 * PATCH /attendance/mark/:id
 * For single attendance updates, requiring faculty
 */
export const markSingleAttendance = async (req, res) => {
  const id = parseInt(req.params.id);
  // The isFaculty middleware would be used here
  const { status, location } = req.body;
  try {
    const updated = await prisma.attendance.update({
      where: { id },
      data: { status, location },
    });
    return res.json(updated);
  } catch (error) {
    return res.status(404).json({ detail: 'Attendance record not found.' });
  }
};
