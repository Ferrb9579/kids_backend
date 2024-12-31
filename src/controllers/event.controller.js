// src/controllers/event.controller.js
import prisma from '../prisma.js';
import { parseISO, isAfter } from 'date-fns';
import { addDays } from 'date-fns';

export const listEvents = async (req, res) => {
  const events = await prisma.event.findMany();
  return res.json(events);
};

export const createEvent = async (req, res) => {
  try {
    const { name, description, slots, startTime, endTime, isPublic } = req.body;

    // Validate start/end time if needed
    if (startTime && endTime) {
      if (!isAfter(parseISO(endTime), parseISO(startTime))) {
        return res
          .status(400)
          .json({ error: 'endTime must be after startTime' });
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
        createdById: req.user.id,
      },
    });
    return res.status(201).json(event);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export const getEvent = async (req, res) => {
  const eventId = parseInt(req.params.id);
  const event = await prisma.event.findUnique({ where: { id: eventId } });
  if (!event) {
    return res.status(404).json({ detail: 'Event not found.' });
  }
  return res.json(event);
};

export const updateEvent = async (req, res) => {
  const eventId = parseInt(req.params.id);
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
    return res.json(updatedEvent);
  } catch (error) {
    return res.status(404).json({ detail: 'Event not found.' });
  }
};

export const deleteEvent = async (req, res) => {
  const eventId = parseInt(req.params.id);
  try {
    await prisma.event.delete({ where: { id: eventId } });
    return res.json({ detail: 'Event deleted successfully.' });
  } catch (error) {
    return res.status(404).json({ detail: 'Event not found.' });
  }
};

/**
 * GET /events/upcoming
 */
export const upcomingEvents = async (req, res) => {
  const now = new Date();
  const events = await prisma.event.findMany({
    where: {
      startTime: {
        gte: now,
      },
    },
    orderBy: { startTime: 'asc' },
  });
  return res.json(events);
};

/**
 * GET /events/:id/registrations
 */
export const eventRegistrations = async (req, res) => {
  const eventId = parseInt(req.params.id);
  const registrations = await prisma.eventRegistration.findMany({
    where: { eventId },
    include: { user: true },
  });
  return res.json(registrations);
};

/**
 * GET /events/by-faculty/:facultyId
 */
export const facultyEvents = async (req, res) => {
  const facultyId = parseInt(req.params.facultyId);
  const events = await prisma.event.findMany({
    where: {
      createdById: facultyId,
    },
  });
  return res.json(events);
};
