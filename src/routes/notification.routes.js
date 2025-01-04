// src/routes/notification.routes.js
import express from 'express';
import { sendNotification } from '../controllers/notification.controller.js';
import { sendNotificationValidator } from '../validators/notification.validators.js';
import { validateFields } from '../middlewares/validateFields.js';
import { authenticateToken } from '../middlewares/auth.js';
import { authorize } from '../middlewares/authorize.js';
import { SEND_NOTIFICATIONS } from '../permissions.js';

const router = express.Router();

// POST /api/notifications/send
router.post(
  '/send',
  authenticateToken,
  authorize(SEND_NOTIFICATIONS),
  sendNotificationValidator,
  validateFields,
  sendNotification
);

export default router;
