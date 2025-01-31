// src/controllers/user.controller.js
import prisma from '../prisma.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || 'some-super-secret';

export const externalAuth = async (req, res) => {
  console.log('EXTERNAL AUTH CONTROLLER');
  const { register_number, password } = req.body;
  if (!register_number || !password) {
    return res.status(400).json({
      success: false,
      message: 'register_number and password are required.',
    });
  }
  let response;
  try {
    const nodeServerUrl = 'http://localhost:4000/auth';
    response = await axios.post(nodeServerUrl, {
      register_number,
      password,
    });

    if (response.status !== 200) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials.',
      });
    }

    const { email, role = 'student' } = response.data;
    if (!email) {
      return res.status(500).json({
        success: false,
        message: 'No email returned from external server.',
      });
    }

    const user = await prisma.user.upsert({
      where: { kmail: email },
      update: { role },
      create: {
        kid: register_number,
        username: register_number,
        kmail: email,
        role,
      },
    });

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
        kmail: user.kmail,
      },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    return res.status(200).json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          kmail: user.kmail,
          role: user.role,
        },
      },
      message: 'User authenticated successfully.',
    });
  } catch (err) {
    console.log(err);
    if (err.response && err.response.status === 401) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials.',
      });
    }
    console.error(err.message);
    return res.status(503).json({
      success: false,
      message: 'Failed to connect to external auth server.',
    });
  }
};

export const listUsers = async (req, res) => {
  const { username, page = 1, limit = 10 } = req.query;
  const pageNum = Number(page) || 1;
  const limitNum = Number(limit) || 10;

  const skip = (pageNum - 1) * limitNum;
  const take = limitNum;

  let whereClause = {};
  if (username) {
    whereClause.username = {
      contains: username,
      mode: 'insensitive',
    };
  }

  try {
    const [users, totalCount] = await Promise.all([
      prisma.user.findMany({
        where: whereClause,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({ where: whereClause }),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        users,
        currentPage: pageNum,
        totalPages: Math.ceil(totalCount / limitNum),
        totalCount,
      },
      message: 'Users retrieved successfully.',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve users.',
    });
  }
};

export const getUser = async (req, res) => {
  const userId = parseInt(req.params.id, 10);
  if (isNaN(userId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid user ID provided.',
    });
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }
    return res.status(200).json({
      success: true,
      data: user,
      message: 'User retrieved successfully.',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve user.',
    });
  }
};

export const updateUser = async (req, res) => {
  const userId = parseInt(req.params.id, 10);
  if (isNaN(userId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid user ID provided.',
    });
  }

  const { kid, username, kmail, role } = req.body;
  try {
    const updated = await prisma.user.update({
      where: { id: userId },
      data: { kid, username, kmail, role },
    });
    return res.status(200).json({
      success: true,
      data: updated,
      message: 'User updated successfully.',
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: 'User not found or update failed.',
    });
  }
};

export const deleteUser = async (req, res) => {
  const userId = parseInt(req.params.id, 10);
  if (isNaN(userId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid user ID provided.',
    });
  }

  try {
    await prisma.user.delete({ where: { id: userId } });
    return res.status(200).json({
      success: true,
      message: 'User deleted successfully.',
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: 'User not found or deletion failed.',
    });
  }
};

export const userEvents = async (req, res) => {
  const userId = parseInt(req.params.id, 10);
  if (isNaN(userId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid user ID provided.',
    });
  }

  try {
    const events = await prisma.event.findMany({
      where: { createdById: userId },
    });
    return res.status(200).json({
      success: true,
      data: events,
      message: 'Events for user retrieved successfully.',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve user events.',
    });
  }
};

export const userAttendance = async (req, res) => {
  const userId = parseInt(req.params.id, 10);
  if (isNaN(userId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid user ID provided.',
    });
  }

  try {
    const attendanceRecords = await prisma.attendance.findMany({
      where: { userId },
      include: {
        attendanceSession: true,
      },
    });
    return res.status(200).json({
      success: true,
      data: attendanceRecords,
      message: 'Attendance records for user retrieved successfully.',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve user attendance.',
    });
  }
};

export const facultyList = async (req, res) => {
  try {
    const faculties = await prisma.user.findMany({
      where: { role: 'faculty' },
    });
    return res.status(200).json({
      success: true,
      data: faculties,
      message: 'Faculty list retrieved successfully.',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve faculty list.',
    });
  }
};

export const assignUserRoles = async (req, res) => {
  const { roleIds } = req.body; // roleIds: array of UserRole IDs
  const userId = parseInt(req.params.id, 10);

  if (isNaN(userId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid user ID provided.',
    });
  }

  if (!Array.isArray(roleIds)) {
    return res.status(400).json({
      success: false,
      message: 'roleIds must be an array of UserRole IDs.',
    });
  }

  try {
    // Delete existing roles
    await prisma.userRoleAssignment.deleteMany({
      where: { userId },
    });

    // Assign new roles
    const assignments = roleIds.map((roleId) => ({
      userId,
      roleId,
    }));

    await prisma.userRoleAssignment.createMany({
      data: assignments,
    });

    return res.status(200).json({
      success: true,
      message: 'User roles updated successfully.',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to assign user roles.',
    });
  }
};
