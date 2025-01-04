// src/controllers/eventRole.controller.js
import prisma from '../prisma.js';

export const listEventRoles = async (req, res) => {
    try {
        const roles = await prisma.eventRole.findMany();
        return res.status(200).json({
            success: true,
            data: roles,
            message: 'Event roles retrieved successfully.',
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to retrieve event roles.',
        });
    }
};

export const createEventRole = async (req, res) => {
    const { name, bitmask } = req.body;
    if (!name || bitmask === undefined) {
        return res.status(400).json({
            success: false,
            message: 'name and bitmask are required.',
        });
    }

    try {
        const role = await prisma.eventRole.create({
            data: { name, bitmask },
        });
        return res.status(201).json({
            success: true,
            data: role,
            message: 'Event role created successfully.',
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: 'Failed to create event role.',
        });
    }
};

export const getEventRole = async (req, res) => {
    const roleId = parseInt(req.params.id, 10);
    if (isNaN(roleId)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid role ID provided.',
        });
    }

    try {
        const role = await prisma.eventRole.findUnique({ where: { id: roleId } });
        if (!role) {
            return res.status(404).json({
                success: false,
                message: 'Event role not found.',
            });
        }
        return res.status(200).json({
            success: true,
            data: role,
            message: 'Event role retrieved successfully.',
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to retrieve event role.',
        });
    }
};

export const updateEventRole = async (req, res) => {
    const roleId = parseInt(req.params.id, 10);
    if (isNaN(roleId)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid role ID provided.',
        });
    }

    const { name, bitmask } = req.body;

    try {
        const updatedRole = await prisma.eventRole.update({
            where: { id: roleId },
            data: { name, bitmask },
        });
        return res.status(200).json({
            success: true,
            data: updatedRole,
            message: 'Event role updated successfully.',
        });
    } catch (error) {
        return res.status(404).json({
            success: false,
            message: 'Event role not found or update failed.',
        });
    }
};

export const deleteEventRole = async (req, res) => {
    const roleId = parseInt(req.params.id, 10);
    if (isNaN(roleId)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid role ID provided.',
        });
    }

    try {
        await prisma.eventRole.delete({ where: { id: roleId } });
        return res.status(200).json({
            success: true,
            message: 'Event role deleted successfully.',
        });
    } catch (error) {
        return res.status(404).json({
            success: false,
            message: 'Event role not found or deletion failed.',
        });
    }
};
