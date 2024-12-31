// src/controllers/permission.controller.js
import prisma from '../prisma.js';

export const listPermissions = async (req, res) => {
  try {
    const permissions = await prisma.permission.findMany();
    return res.status(200).json({
      success: true,
      data: permissions,
      message: 'Permissions retrieved successfully.',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve permissions.',
    });
  }
};

export const createPermission = async (req, res) => {
  try {
    const { name, codename } = req.body;
    if (!name || !codename) {
      return res.status(400).json({
        success: false,
        message: 'name and codename are required.',
      });
    }

    const newPermission = await prisma.permission.create({
      data: { name, codename },
    });
    return res.status(201).json({
      success: true,
      data: newPermission,
      message: 'Permission created successfully.',
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: 'Failed to create permission.',
    });
  }
};

export const getPermission = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid permission ID provided.',
    });
  }

  try {
    const permission = await prisma.permission.findUnique({ where: { id } });
    if (!permission) {
      return res.status(404).json({
        success: false,
        message: 'Permission not found.',
      });
    }
    return res.status(200).json({
      success: true,
      data: permission,
      message: 'Permission retrieved successfully.',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve permission.',
    });
  }
};

export const updatePermission = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid permission ID provided.',
    });
  }

  const { name, codename } = req.body;
  try {
    const updated = await prisma.permission.update({
      where: { id },
      data: { name, codename },
    });
    return res.status(200).json({
      success: true,
      data: updated,
      message: 'Permission updated successfully.',
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: 'Permission not found or update failed.',
    });
  }
};

export const deletePermission = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid permission ID provided.',
    });
  }

  try {
    await prisma.permission.delete({ where: { id } });
    return res.status(200).json({
      success: true,
      message: 'Permission deleted successfully.',
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: 'Permission not found or deletion failed.',
    });
  }
};
