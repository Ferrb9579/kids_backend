import prisma from '../prisma.js';
import { isAfter } from 'date-fns';

/**
 * GET /events
 * Optional query parameters for pagination/filtering:
 *  - page (default: 1)
 *  - limit (default: 10)
 *  - search (partial match on name/description)
 */
export const listEvents = async (req, res) => {
  const { page = 1, limit = 10, search } = req.query;
  const pageNum = Number(page) || 1;
  const limitNum = Number(limit) || 10;

  // Basic pagination calculation
  const skip = (pageNum - 1) * limitNum;
  const take = limitNum;

  // Optional text search
  let whereClause = {};
  if (search) {
    whereClause = {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ],
    };
  }

  try {
    const [events, totalCount] = await Promise.all([
      prisma.event.findMany({
        where: whereClause,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.event.count({ where: whereClause }),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        events,
        currentPage: pageNum,
        totalPages: Math.ceil(totalCount / limitNum),
        totalCount,
      },
      message: 'Events retrieved successfully.',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve events.',
    });
  }
};

export const createEvent = async (req, res) => {
  try {
    const { name, description, slots, startTime, endTime, isPublic } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Event name is required.',
      });
    }

    // Validate date fields
    if (startTime && isNaN(Date.parse(startTime))) {
      return res.status(400).json({
        success: false,
        message: 'Invalid startTime format. Please provide a valid date string.',
      });
    }
    if (endTime && isNaN(Date.parse(endTime))) {
      return res.status(400).json({
        success: false,
        message: 'Invalid endTime format. Please provide a valid date string.',
      });
    }

    if (startTime && endTime) {
      if (!isAfter(new Date(endTime), new Date(startTime))) {
        return res.status(400).json({
          success: false,
          message: 'endTime must be after startTime.',
        });
      }
    }

    const event = await prisma.event.create({
      data: {
        name,
        description,
        slots: slots ? Number(slots) : null,
        startTime: startTime ? new Date(startTime) : null,
        endTime: endTime ? new Date(endTime) : null,
        isPublic: isPublic !== undefined ? isPublic : true,
        createdById: req.user?.id || null,
      },
    });

    return res.status(201).json({
      success: true,
      data: event,
      message: 'Event created successfully.',
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: 'Failed to create event.',
    });
  }
};

export const getEvent = async (req, res) => {
  const eventId = parseInt(req.params.id, 10);
  if (isNaN(eventId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid event ID provided.',
    });
  }

  try {
    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found.',
      });
    }
    return res.status(200).json({
      success: true,
      data: event,
      message: 'Event retrieved successfully.',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve event.',
    });
  }
};

export const updateEvent = async (req, res) => {
  const eventId = parseInt(req.params.id, 10);
  if (isNaN(eventId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid event ID provided.',
    });
  }

  const { name, description, slots, startTime, endTime, isPublic } = req.body;

  // Validate date fields
  if (startTime && isNaN(Date.parse(startTime))) {
    return res.status(400).json({
      success: false,
      message: 'Invalid startTime format. Please provide a valid date string.',
    });
  }
  if (endTime && isNaN(Date.parse(endTime))) {
    return res.status(400).json({
      success: false,
      message: 'Invalid endTime format. Please provide a valid date string.',
    });
  }
  if (startTime && endTime) {
    if (!isAfter(new Date(endTime), new Date(startTime))) {
      return res.status(400).json({
        success: false,
        message: 'endTime must be after startTime.',
      });
    }
  }

  try {
    const updatedEvent = await prisma.event.update({
      where: { id: eventId },
      data: {
        name,
        description,
        slots: slots ? Number(slots) : undefined,
        startTime: startTime ? new Date(startTime) : undefined,
        endTime: endTime ? new Date(endTime) : undefined,
        isPublic,
      },
    });
    return res.status(200).json({
      success: true,
      data: updatedEvent,
      message: 'Event updated successfully.',
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: 'Event not found or update failed.',
    });
  }
};

export const deleteEvent = async (req, res) => {
  const eventId = parseInt(req.params.id, 10);
  if (isNaN(eventId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid event ID provided.',
    });
  }

  try {
    await prisma.event.delete({ where: { id: eventId } });
    return res.status(200).json({
      success: true,
      message: 'Event deleted successfully.',
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: 'Event not found or deletion failed.',
    });
  }
};

export const upcomingEvents = async (req, res) => {
  const now = new Date();
  try {
    const events = await prisma.event.findMany({
      where: {
        startTime: {
          gte: now,
        },
      },
      orderBy: { startTime: 'asc' },
    });
    return res.status(200).json({
      success: true,
      data: events,
      message: 'Upcoming events retrieved successfully.',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve upcoming events.',
    });
  }
};

export const eventRegistrations = async (req, res) => {
  const eventId = parseInt(req.params.id, 10);
  if (isNaN(eventId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid event ID provided.',
    });
  }

  try {
    const registrations = await prisma.eventRegistration.findMany({
      where: { eventId },
      include: { user: true },
    });
    return res.status(200).json({
      success: true,
      data: registrations,
      message: 'Event registrations retrieved successfully.',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve event registrations.',
    });
  }
};

export const facultyEvents = async (req, res) => {
  const facultyId = parseInt(req.params.facultyId, 10);
  if (isNaN(facultyId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid faculty ID provided.',
    });
  }

  try {
    const events = await prisma.event.findMany({
      where: {
        createdById: facultyId,
      },
    });
    return res.status(200).json({
      success: true,
      data: events,
      message: 'Events by faculty retrieved successfully.',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve faculty events.',
    });
  }
};
