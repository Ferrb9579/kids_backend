// src/controllers/userRole.controller.js
import prisma from '../prisma.js';

export const listUserRoles = async (req, res) => {
  try {
    const roles = await prisma.userRole.findMany();
    return res.status(200).json({
      success: true,
      data: roles,
      message: 'User roles retrieved successfully.',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve user roles.',
    });
  }
};

export const createUserRole = async (req, res) => {
  const { name, bitmask } = req.body;
  if (!name || bitmask === undefined) {
    return res.status(400).json({
      success: false,
      message: 'name and bitmask are required.',
    });
  }

  try {
    const role = await prisma.userRole.create({
      data: { name, bitmask },
    });
    return res.status(201).json({
      success: true,
      data: role,
      message: 'User role created successfully.',
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: 'Failed to create user role.',
    });
  }
};

export const getUserRole = async (req, res) => {
  const roleId = parseInt(req.params.id, 10);
  if (isNaN(roleId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid role ID provided.',
    });
  }

  try {
    const role = await prisma.userRole.findUnique({ where: { id: roleId } });
    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'User role not found.',
      });
    }
    return res.status(200).json({
      success: true,
      data: role,
      message: 'User role retrieved successfully.',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve user role.',
    });
  }
};

export const updateUserRole = async (req, res) => {
  const roleId = parseInt(req.params.id, 10);
  if (isNaN(roleId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid role ID provided.',
    });
  }

  const { name, bitmask } = req.body;

  try {
    const updatedRole = await prisma.userRole.update({
      where: { id: roleId },
      data: { name, bitmask },
    });
    return res.status(200).json({
      success: true,
      data: updatedRole,
      message: 'User role updated successfully.',
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: 'User role not found or update failed.',
    });
  }
};

export const deleteUserRole = async (req, res) => {
  const roleId = parseInt(req.params.id, 10);
  if (isNaN(roleId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid role ID provided.',
    });
  }

  try {
    await prisma.userRole.delete({ where: { id: roleId } });
    return res.status(200).json({
      success: true,
      message: 'User role deleted successfully.',
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: 'User role not found or deletion failed.',
    });
  }
};
