// src/controllers/eventRoleAssignment.controller.js
import prisma from '../prisma.js';

export const assignEventRole = async (req, res) => {
    const { userId, eventId, roleId } = req.body;

    if (!userId || !eventId || !roleId) {
        return res.status(400).json({
            success: false,
            message: 'userId, eventId, and roleId are required.',
        });
    }

    try {
        const assignment = await prisma.eventRoleAssignment.create({
            data: { userId, eventId, roleId },
        });
        return res.status(201).json({
            success: true,
            data: assignment,
            message: 'Event role assigned successfully.',
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: 'Failed to assign event role.',
        });
    }
};

export const removeEventRole = async (req, res) => {
    const { userId, eventId, roleId } = req.body;

    if (!userId || !eventId || !roleId) {
        return res.status(400).json({
            success: false,
            message: 'userId, eventId, and roleId are required.',
        });
    }

    try {
        await prisma.eventRoleAssignment.delete({
            where: { userId_eventId_roleId: { userId, eventId, roleId } },
        });
        return res.status(200).json({
            success: true,
            message: 'Event role removed successfully.',
        });
    } catch (error) {
        return res.status(404).json({
            success: false,
            message: 'Event role assignment not found.',
        });
    }
};
