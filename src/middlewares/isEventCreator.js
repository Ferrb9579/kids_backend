// src/middlewares/isEventCreator.js
import prisma from '../prisma.js';

export const isEventCreator = async (req, res, next) => {
  const { eventId } = req.params;
  const event = await prisma.event.findUnique({
    where: { id: parseInt(eventId) },
  });

  if (!event) {
    return res.status(404).json({ detail: 'Event not found.' });
  }
  if (event.createdById !== req.user.id) {
    return res.status(403).json({ detail: 'Not the event creator.' });
  }
  next();
};
