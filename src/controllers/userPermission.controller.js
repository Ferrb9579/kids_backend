// src/controllers/userPermission.controller.js
import prisma from '../prisma.js';

export const listUserPermissions = async (req, res) => {
  try {
    const userPermissions = await prisma.userPermission.findMany({
      include: { user: true, permission: true },
    });
    return res.status(200).json({
      success: true,
      data: userPermissions,
      message: 'User permissions retrieved successfully.',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve user permissions.',
    });
  }
};

export const createUserPermission = async (req, res) => {
  try {
    const { userId, permissionId } = req.body;
    if (!userId || !permissionId) {
      return res.status(400).json({
        success: false,
        message: 'userId and permissionId are required.',
      });
    }

    const newRecord = await prisma.userPermission.create({
      data: { userId, permissionId },
    });
    return res.status(201).json({
      success: true,
      data: newRecord,
      message: 'User permission created successfully.',
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: 'Failed to create user permission.',
    });
  }
};

export const getUserPermission = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid user permission ID provided.',
    });
  }

  try {
    const record = await prisma.userPermission.findUnique({
      where: { id },
      include: { user: true, permission: true },
    });
    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'User permission record not found.',
      });
    }
    return res.status(200).json({
      success: true,
      data: record,
      message: 'User permission record retrieved successfully.',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve user permission record.',
    });
  }
};

export const updateUserPermission = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid user permission ID provided.',
    });
  }

  const { userId, permissionId } = req.body;
  try {
    const updated = await prisma.userPermission.update({
      where: { id },
      data: { userId, permissionId },
    });
    return res.status(200).json({
      success: true,
      data: updated,
      message: 'User permission updated successfully.',
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: 'User permission record not found or update failed.',
    });
  }
};

export const deleteUserPermission = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid user permission ID provided.',
    });
  }

  try {
    await prisma.userPermission.delete({ where: { id } });
    return res.status(200).json({
      success: true,
      message: 'User permission record deleted successfully.',
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: 'User permission record not found or deletion failed.',
    });
  }
};

export const listUserPermissionsByUser = async (req, res) => {
  const userId = parseInt(req.params.userId, 10);
  if (isNaN(userId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid user ID provided.',
    });
  }

  try {
    const records = await prisma.userPermission.findMany({
      where: { userId },
      include: { permission: true },
    });
    return res.status(200).json({
      success: true,
      data: records,
      message: 'User permissions by user retrieved successfully.',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve user permissions by user.',
    });
  }
};
