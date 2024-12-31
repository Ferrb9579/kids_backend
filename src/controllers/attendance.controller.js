// src/controllers/attendance.controller.js
import prisma from '../prisma.js';

export const listAttendance = async (req, res) => {
  try {
    const records = await prisma.attendance.findMany({
      include: { user: true, attendanceSession: true },
    });
    return res.status(200).json({
      success: true,
      data: records,
      message: 'Attendance records retrieved successfully.',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve attendance records.',
    });
  }
};

export const createAttendance = async (req, res) => {
  try {
    const { userId, attendanceSessionId, location, status } = req.body;
    if (!userId || !attendanceSessionId) {
      return res.status(400).json({
        success: false,
        message: 'userId and attendanceSessionId are required.',
      });
    }

    const newRecord = await prisma.attendance.create({
      data: {
        userId,
        attendanceSessionId,
        location: location || '',
        status: status || 'present',
      },
    });

    return res.status(201).json({
      success: true,
      data: newRecord,
      message: 'Attendance record created successfully.',
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: 'Failed to create attendance record.',
    });
  }
};

export const getAttendance = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid attendance ID provided.',
    });
  }

  try {
    const record = await prisma.attendance.findUnique({
      where: { id },
      include: { user: true, attendanceSession: true },
    });
    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Attendance record not found.',
      });
    }
    return res.status(200).json({
      success: true,
      data: record,
      message: 'Attendance record retrieved successfully.',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to get attendance record.',
    });
  }
};

export const updateAttendance = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid attendance ID provided.',
    });
  }

  const { location, status } = req.body;

  try {
    const updated = await prisma.attendance.update({
      where: { id },
      data: { location, status },
    });
    return res.status(200).json({
      success: true,
      data: updated,
      message: 'Attendance record updated successfully.',
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: 'Attendance record not found or update failed.',
    });
  }
};

export const deleteAttendance = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid attendance ID provided.',
    });
  }

  try {
    await prisma.attendance.delete({ where: { id } });
    return res.status(200).json({
      success: true,
      message: 'Attendance record deleted successfully.',
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: 'Attendance record not found or deletion failed.',
    });
  }
};

export const attendanceBySession = async (req, res) => {
  const sessionId = parseInt(req.params.sessionId, 10);
  if (isNaN(sessionId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid session ID provided.',
    });
  }

  try {
    const records = await prisma.attendance.findMany({
      where: { attendanceSessionId: sessionId },
      include: { user: true },
    });
    return res.status(200).json({
      success: true,
      data: records,
      message: 'Attendance records by session retrieved successfully.',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve attendance by session.',
    });
  }
};

export const markSingleAttendance = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid attendance ID provided.',
    });
  }

  const { status, location } = req.body;
  try {
    const updated = await prisma.attendance.update({
      where: { id },
      data: { status, location },
    });
    return res.status(200).json({
      success: true,
      data: updated,
      message: 'Attendance record marked successfully.',
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: 'Attendance record not found or update failed.',
    });
  }
};
