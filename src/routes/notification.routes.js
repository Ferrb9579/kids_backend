// src/routes/notification.routes.js
import express from 'express';
import { sendNotification } from '../controllers/notification.controller.js';
import { sendNotificationValidator } from '../validators/notification.validators.js';
import { validateFields } from '../middlewares/validateFields.js';
import { authenticateToken } from '../middlewares/auth.js';
import { isFaculty } from '../middlewares/isFaculty.js'; // if restricted

const router = express.Router();

// POST /api/notifications/send
router.post(
  '/send',
  authenticateToken,
  isFaculty, // If only faculty can send notifications
  sendNotificationValidator,
  validateFields,
  sendNotification
);

export default router;
