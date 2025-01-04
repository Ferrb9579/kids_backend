// src/controllers/userRoleAssignment.controller.js
import prisma from '../prisma.js';

export const assignUserRole = async (req, res) => {
    const { userId, roleId } = req.body;

    if (!userId || !roleId) {
        return res.status(400).json({
            success: false,
            message: 'userId and roleId are required.',
        });
    }

    try {
        const assignment = await prisma.userRoleAssignment.create({
            data: { userId, roleId },
        });
        return res.status(201).json({
            success: true,
            data: assignment,
            message: 'User role assigned successfully.',
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: 'Failed to assign user role.',
        });
    }
};

export const removeUserRole = async (req, res) => {
    const { userId, roleId } = req.body;

    if (!userId || !roleId) {
        return res.status(400).json({
            success: false,
            message: 'userId and roleId are required.',
        });
    }

    try {
        await prisma.userRoleAssignment.delete({
            where: { userId_roleId: { userId, roleId } },
        });
        return res.status(200).json({
            success: true,
            message: 'User role removed successfully.',
        });
    } catch (error) {
        return res.status(404).json({
            success: false,
            message: 'User role assignment not found.',
        });
    }
};
