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
 * Example: Using an external Node server to validate credentials,
 * then upserting the user locally, and returning a JWT.
 */
export const externalAuth = async (req, res) => {
  console.log('EXTERNAL AUTH CONTROLLER');
  const { register_number, password } = req.body;
  if (!register_number || !password) {
    return res.status(400).json({
      error: 'register_number and password are required.',
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
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const { email, role = 'student' } = response.data;
    if (!email) {
      return res
        .status(500)
        .json({ error: 'No email returned from external server.' });
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
      token,
      user: {
        id: user.id,
        username: user.username,
        kmail: user.kmail,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err.message);
    return res.status(503).json({
      error: `Failed to connect to external auth server: ${err.message}`,
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

  const users = await prisma.user.findMany({ where: whereClause });
  return res.json(users);
};

/**
 * POST /users
 * Create a new user
 */
export const createUser = async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Return first error or all errors if you like
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { kid, username, kmail, role } = req.body;
    const newUser = await prisma.user.create({
      data: { kid, username, kmail, role },
    });
    return res.status(201).json(newUser);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

/**
 * GET /users/:id
 * PATCH/PUT /users/:id
 * DELETE /users/:id
 */
export const getUser = async (req, res) => {
  const userId = parseInt(req.params.id);
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    return res.status(404).json({ detail: 'User not found.' });
  }
  return res.json(user);
};

export const updateUser = async (req, res) => {
  const userId = parseInt(req.params.id);
  const { kid, username, kmail, role } = req.body;
  try {
    const updated = await prisma.user.update({
      where: { id: userId },
      data: { kid, username, kmail, role },
    });
    return res.json(updated);
  } catch (error) {
    return res.status(404).json({ detail: 'User not found.' });
  }
};

export const deleteUser = async (req, res) => {
  const userId = parseInt(req.params.id);
  try {
    await prisma.user.delete({ where: { id: userId } });
    return res.json({ detail: 'User deleted successfully.' });
  } catch (error) {
    return res.status(404).json({ detail: 'User not found.' });
  }
};

/**
 * GET /users/:id/events
 */
export const userEvents = async (req, res) => {
  const userId = parseInt(req.params.id);
  const events = await prisma.event.findMany({
    where: { createdById: userId },
  });
  return res.json(events);
};

/**
 * GET /users/:id/attendance
 */
export const userAttendance = async (req, res) => {
  const userId = parseInt(req.params.id);
  const attendanceRecords = await prisma.attendance.findMany({
    where: { userId },
    include: {
      attendanceSession: true,
    },
  });
  return res.json(attendanceRecords);
};

/**
 * GET /users/faculty
 */
export const facultyList = async (req, res) => {
  const faculties = await prisma.user.findMany({
    where: { role: 'faculty' },
  });
  return res.json(faculties);
};
