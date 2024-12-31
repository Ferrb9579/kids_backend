// src/controllers/userPermission.controller.js
import prisma from '../prisma.js';

export const listUserPermissions = async (req, res) => {
  const userPermissions = await prisma.userPermission.findMany({
    include: { user: true, permission: true },
  });
  return res.json(userPermissions);
};

export const createUserPermission = async (req, res) => {
  try {
    const { userId, permissionId } = req.body;
    const newRecord = await prisma.userPermission.create({
      data: { userId, permissionId },
    });
    return res.status(201).json(newRecord);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export const getUserPermission = async (req, res) => {
  const id = parseInt(req.params.id);
  const record = await prisma.userPermission.findUnique({
    where: { id },
    include: { user: true, permission: true },
  });
  if (!record) {
    return res.status(404).json({ detail: 'Record not found.' });
  }
  return res.json(record);
};

export const updateUserPermission = async (req, res) => {
  const id = parseInt(req.params.id);
  const { userId, permissionId } = req.body;
  try {
    const updated = await prisma.userPermission.update({
      where: { id },
      data: { userId, permissionId },
    });
    return res.json(updated);
  } catch (error) {
    return res.status(404).json({ detail: 'Record not found.' });
  }
};

export const deleteUserPermission = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    await prisma.userPermission.delete({ where: { id } });
    return res.json({ detail: 'Record deleted successfully.' });
  } catch (error) {
    return res.status(404).json({ detail: 'Record not found.' });
  }
};

/**
 * GET /user-permissions/user/:userId
 */
export const listUserPermissionsByUser = async (req, res) => {
  const userId = parseInt(req.params.userId);
  const records = await prisma.userPermission.findMany({
    where: { userId },
    include: { permission: true },
  });
  return res.json(records);
};
