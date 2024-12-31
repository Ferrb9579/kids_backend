// src/controllers/eventRegistration.controller.js
import prisma from '../prisma.js';

export const listEventRegistrations = async (req, res) => {
  const registrations = await prisma.eventRegistration.findMany({
    include: { user: true, event: true },
  });
  return res.json(registrations);
};

export const createEventRegistration = async (req, res) => {
  try {
    const { userId, eventId, status } = req.body;
    const newReg = await prisma.eventRegistration.create({
      data: {
        userId,
        eventId,
        status: status || 'confirmed',
      },
    });
    return res.status(201).json(newReg);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export const getEventRegistration = async (req, res) => {
  const id = parseInt(req.params.id);
  const reg = await prisma.eventRegistration.findUnique({
    where: { id },
    include: { user: true, event: true },
  });
  if (!reg) {
    return res.status(404).json({ detail: 'Registration not found.' });
  }
  return res.json(reg);
};

export const updateEventRegistration = async (req, res) => {
  const id = parseInt(req.params.id);
  const { status } = req.body;

  try {
    // Check if current user is faculty or the event creator
    const currentReg = await prisma.eventRegistration.findUnique({
      where: { id },
      include: { event: true },
    });
    if (!currentReg) {
      return res.status(404).json({ detail: 'Registration not found.' });
    }

    // If user is not faculty or not the event creator, forbid
    if (
      req.user.role !== 'faculty' &&
      req.user.id !== currentReg.event.createdById
    ) {
      return res.status(403).json({ detail: 'Not allowed.' });
    }

    const updatedReg = await prisma.eventRegistration.update({
      where: { id },
      data: { status },
    });
    return res.json(updatedReg);
  } catch (error) {
    return res.status(404).json({ detail: error.message });
  }
};

export const deleteEventRegistration = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    await prisma.eventRegistration.delete({ where: { id } });
    return res.json({ detail: 'Registration deleted successfully.' });
  } catch (error) {
    return res.status(404).json({ detail: 'Registration not found.' });
  }
};

/**
 * GET /event-registrations/by-event/:eventId
 */
export const eventRegistrationsByEvent = async (req, res) => {
  const eventId = parseInt(req.params.eventId);
  const registrations = await prisma.eventRegistration.findMany({
    where: { eventId },
    include: { user: true },
  });
  return res.json(registrations);
};
