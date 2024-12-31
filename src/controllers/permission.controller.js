// src/controllers/permission.controller.js
import prisma from '../prisma.js';

export const listPermissions = async (req, res) => {
  const permissions = await prisma.permission.findMany();
  return res.json(permissions);
};

export const createPermission = async (req, res) => {
  try {
    const { name, codename } = req.body;
    const newPermission = await prisma.permission.create({
      data: { name, codename },
    });
    return res.status(201).json(newPermission);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export const getPermission = async (req, res) => {
  const id = parseInt(req.params.id);
  const permission = await prisma.permission.findUnique({ where: { id } });
  if (!permission) {
    return res.status(404).json({ detail: 'Permission not found.' });
  }
  return res.json(permission);
};

export const updatePermission = async (req, res) => {
  const id = parseInt(req.params.id);
  const { name, codename } = req.body;
  try {
    const updated = await prisma.permission.update({
      where: { id },
      data: { name, codename },
    });
    return res.json(updated);
  } catch (error) {
    return res.status(404).json({ detail: 'Permission not found.' });
  }
};

export const deletePermission = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    await prisma.permission.delete({ where: { id } });
    return res.json({ detail: 'Permission deleted successfully.' });
  } catch (error) {
    return res.status(404).json({ detail: 'Permission not found.' });
  }
};
