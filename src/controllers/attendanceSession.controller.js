import prisma from '../prisma.js';
// Replaced parseISO usage with new Date(...) plus validation.

export const listAttendanceSessions = async (req, res) => {
  try {
    const sessions = await prisma.attendanceSession.findMany({
      include: { event: true },
    });
    return res.status(200).json({
      success: true,
      data: sessions,
      message: 'Attendance sessions retrieved successfully.',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve attendance sessions.',
    });
  }
};

export const createAttendanceSession = async (req, res) => {
  try {
    const { eventId, sessionDate } = req.body;
    if (!eventId) {
      return res.status(400).json({
        success: false,
        message: 'eventId is required.',
      });
    }

    // Validate sessionDate
    if (sessionDate && isNaN(Date.parse(sessionDate))) {
      return res.status(400).json({
        success: false,
        message: 'Invalid sessionDate format. Please provide a valid date string.',
      });
    }

    const newSession = await prisma.attendanceSession.create({
      data: {
        eventId,
        sessionDate: sessionDate ? new Date(sessionDate) : new Date(),
      },
    });

    return res.status(201).json({
      success: true,
      data: newSession,
      message: 'Attendance session created successfully.',
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: 'Failed to create attendance session.',
    });
  }
};

export const getAttendanceSession = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid session ID provided.',
    });
  }

  try {
    const session = await prisma.attendanceSession.findUnique({
      where: { id },
      include: { event: true },
    });
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Attendance session not found.',
      });
    }
    return res.status(200).json({
      success: true,
      data: session,
      message: 'Attendance session retrieved successfully.',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve attendance session.',
    });
  }
};

export const updateAttendanceSession = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid session ID provided.',
    });
  }

  const { eventId, sessionDate } = req.body;
  // Validate sessionDate
  if (sessionDate && isNaN(Date.parse(sessionDate))) {
    return res.status(400).json({
      success: false,
      message: 'Invalid sessionDate format. Please provide a valid date string.',
    });
  }

  try {
    const updated = await prisma.attendanceSession.update({
      where: { id },
      data: {
        eventId,
        sessionDate: sessionDate ? new Date(sessionDate) : undefined,
      },
    });
    return res.status(200).json({
      success: true,
      data: updated,
      message: 'Attendance session updated successfully.',
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: 'Attendance session not found or update failed.',
    });
  }
};

export const deleteAttendanceSession = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid session ID provided.',
    });
  }

  try {
    await prisma.attendanceSession.delete({ where: { id } });
    return res.status(200).json({
      success: true,
      message: 'Attendance session deleted successfully.',
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: 'Attendance session not found or deletion failed.',
    });
  }
};

export const attendanceSessionsByEvent = async (req, res) => {
  const eventId = parseInt(req.params.eventId, 10);
  if (isNaN(eventId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid event ID provided.',
    });
  }

  try {
    const sessions = await prisma.attendanceSession.findMany({
      where: { eventId },
    });
    return res.status(200).json({
      success: true,
      data: sessions,
      message: 'Attendance sessions for event retrieved successfully.',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve sessions by event.',
    });
  }
};

export const markBulkAttendance = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid session ID provided.',
    });
  }

  try {
    const session = await prisma.attendanceSession.findUnique({
      where: { id },
    });
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found.',
      });
    }

    const { attendance_data } = req.body;
    if (!Array.isArray(attendance_data)) {
      return res.status(400).json({
        success: false,
        message: 'attendance_data must be an array.',
      });
    }

    const createdRecords = [];
    for (let att of attendance_data) {
      const { userId, status, location } = att;
      if (!userId) continue; // skip if userId not provided

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
        // Skip or handle duplicates, etc.
      }
    }

    return res.status(201).json({
      success: true,
      data: createdRecords,
      message: 'Bulk attendance marked successfully.',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to mark bulk attendance.',
    });
  }
};
