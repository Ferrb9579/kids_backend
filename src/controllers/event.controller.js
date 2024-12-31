// src/controllers/event.controller.js
import prisma from '../prisma.js';
import { parseISO, isAfter } from 'date-fns';

export const listEvents = async (req, res) => {
  try {
    const events = await prisma.event.findMany();
    return res.status(200).json({
      success: true,
      data: events,
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

    // Validate start/end time if needed
    if (startTime && endTime) {
      if (!isAfter(parseISO(endTime), parseISO(startTime))) {
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
        startTime: startTime ? parseISO(startTime) : null,
        endTime: endTime ? parseISO(endTime) : null,
        isPublic: isPublic !== undefined ? isPublic : true,
        // Assuming you have user info in req.user
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

  try {
    const updatedEvent = await prisma.event.update({
      where: { id: eventId },
      data: {
        name,
        description,
        slots: slots ? Number(slots) : undefined,
        startTime: startTime ? parseISO(startTime) : undefined,
        endTime: endTime ? parseISO(endTime) : undefined,
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
