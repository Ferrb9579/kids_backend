// src/controllers/eventRegistration.controller.js
import prisma from '../prisma.js';

export const listEventRegistrations = async (req, res) => {
  try {
    const registrations = await prisma.eventRegistration.findMany({
      include: { user: true, event: true },
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

export const createEventRegistration = async (req, res) => {
  try {
    const { userId, eventId, status } = req.body;
    if (!userId || !eventId) {
      return res.status(400).json({
        success: false,
        message: 'userId and eventId are required.',
      });
    }

    const newReg = await prisma.eventRegistration.create({
      data: {
        userId,
        eventId,
        status: status || 'confirmed',
      },
    });
    return res.status(201).json({
      success: true,
      data: newReg,
      message: 'Event registration created successfully.',
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: 'Failed to create event registration.',
    });
  }
};

export const getEventRegistration = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid registration ID provided.',
    });
  }

  try {
    const reg = await prisma.eventRegistration.findUnique({
      where: { id },
      include: { user: true, event: true },
    });
    if (!reg) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found.',
      });
    }
    return res.status(200).json({
      success: true,
      data: reg,
      message: 'Registration retrieved successfully.',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve event registration.',
    });
  }
};

export const updateEventRegistration = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid registration ID provided.',
    });
  }

  const { status } = req.body;

  try {
    const currentReg = await prisma.eventRegistration.findUnique({
      where: { id },
      include: { event: true },
    });
    if (!currentReg) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found.',
      });
    }

    if (
      req.user?.role !== 'faculty' &&
      req.user?.id !== currentReg.event.createdById
    ) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to update this registration.',
      });
    }

    const updatedReg = await prisma.eventRegistration.update({
      where: { id },
      data: { status },
    });
    return res.status(200).json({
      success: true,
      data: updatedReg,
      message: 'Registration updated successfully.',
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: 'Failed to update event registration.',
    });
  }
};

export const deleteEventRegistration = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid registration ID provided.',
    });
  }

  try {
    await prisma.eventRegistration.delete({ where: { id } });
    return res.status(200).json({
      success: true,
      message: 'Registration deleted successfully.',
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: 'Registration not found or deletion failed.',
    });
  }
};

export const eventRegistrationsByEvent = async (req, res) => {
  const eventId = parseInt(req.params.eventId, 10);
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
      message: 'Failed to retrieve event registrations by event.',
    });
  }
};
