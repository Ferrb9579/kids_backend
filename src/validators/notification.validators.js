// src/validators/notification.validators.js
import { body } from 'express-validator';

export const sendNotificationValidator = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('title is required')
    .escape(),
  body('message')
    .trim()
    .notEmpty()
    .withMessage('message is required')
    .escape(),
];
