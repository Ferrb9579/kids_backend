// src/controllers/user.controller.js

import { validationResult } from 'express-validator';
import prisma from '../prisma.js';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || 'some-super-secret';

/**
 * EXTERNAL AUTH CONTROLLER
 */
export const externalAuth = async (req, res) => {
  console.log('EXTERNAL AUTH CONTROLLER');
  const { register_number, password } = req.body;
  if (!register_number || !password) {
    return res.status(400).json({
      success: false,
      message: 'register_number and password are required.',
    });
  }

  try {
    // Example external Node.js server
    const nodeServerUrl = 'http://localhost:4000/auth';
    const response = await axios.post(nodeServerUrl, {
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

    // Upsert user in local DB
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

    // Create JWT
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
    console.error(err.message);
    return res.status(503).json({
      success: false,
      message: 'Failed to connect to external auth server.',
    });
  }
};

/**
 * GET /users
 * GET /users?username=foo
 */
export const listUsers = async (req, res) => {
  const { username } = req.query;
  let whereClause = {};
  if (username) {
    whereClause = {
      username: {
        contains: username,
        mode: 'insensitive',
      },
    };
  }

  try {
    const users = await prisma.user.findMany({ where: whereClause });
    return res.status(200).json({
      success: true,
      data: users,
      message: 'Users retrieved successfully.',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve users.',
    });
  }
};

/**
 * POST /users
 */
export const createUser = async (req, res) => {
  // Check for validation errors if using express-validator
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed.',
      errors: errors.array(),
    });
  }

  try {
    const { kid, username, kmail, role } = req.body;
    if (!kid || !username || !kmail) {
      return res.status(400).json({
        success: false,
        message: 'kid, username, and kmail are required.',
      });
    }

    const newUser = await prisma.user.create({
      data: { kid, username, kmail, role },
    });
    return res.status(201).json({
      success: true,
      data: newUser,
      message: 'User created successfully.',
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: 'Failed to create user.',
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
