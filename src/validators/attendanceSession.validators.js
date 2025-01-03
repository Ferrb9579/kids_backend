// src/validators/attendanceSession.validators.js
import { body, param, query } from 'express-validator';

export const sessionIdParamValidator = [
  param('id')
    .isInt({ gt: 0 })
    .withMessage('Session ID must be a positive integer'),
];

export const eventIdParamValidator = [
  param('eventId')
    .isInt({ gt: 0 })
    .withMessage('Event ID must be a positive integer'),
];

export const createAttendanceSessionValidator = [
  body('eventId')
    .isInt({ gt: 0 })
    .withMessage('eventId must be a positive integer')
    .toInt(),
  body('sessionDate')
    .optional()
    .isISO8601()
    .withMessage('sessionDate must be a valid ISO8601 date')
    .toDate(),
];

export const updateAttendanceSessionValidator = [
  body('eventId')
    .optional()
    .isInt({ gt: 0 })
    .withMessage('eventId must be a positive integer')
    .toInt(),
  body('sessionDate')
    .optional()
    .isISO8601()
    .withMessage('sessionDate must be a valid ISO8601 date')
    .toDate(),
];

export const markBulkAttendanceValidator = [
  body('attendance_data')
    .isArray({ min: 1 })
    .withMessage('attendance_data must be a non-empty array'),
  body('attendance_data.*.userId')
    .isInt({ gt: 0 })
    .withMessage('userId must be a positive integer')
    .toInt(),
  body('attendance_data.*.status')
    .optional()
    .isIn(['present', 'absent', 'late', 'excused'])
    .withMessage('Invalid status in attendance_data')
    .escape(),
  body('attendance_data.*.location')
    .optional()
    .trim()
    .escape(),
];

export const attendanceSessionsByEventParamValidator = [
  param('eventId')
    .isInt({ gt: 0 })
    .withMessage('eventId must be a positive integer'),
];
