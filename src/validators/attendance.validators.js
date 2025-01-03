// src/validators/attendance.validators.js
import { body, param, query } from 'express-validator';

export const attendanceIdParamValidator = [
    param('id')
        .isInt({ gt: 0 })
        .withMessage('Attendance ID must be a positive integer'),
];

export const createAttendanceValidator = [
    body('userId')
        .isInt({ gt: 0 })
        .withMessage('userId must be a positive integer')
        .toInt(),
    body('attendanceSessionId')
        .isInt({ gt: 0 })
        .withMessage('attendanceSessionId must be a positive integer')
        .toInt(),
    body('location')
        .optional()
        .trim()
        .escape(),
    body('status')
        .optional()
        .isIn(['present', 'absent', 'late', 'excused'])
        .withMessage('Invalid status')
        .escape(),
];

export const updateAttendanceValidator = [
    body('location')
        .optional()
        .trim()
        .escape(),
    body('status')
        .optional()
        .isIn(['present', 'absent', 'late', 'excused'])
        .withMessage('Invalid status')
        .escape(),
];
