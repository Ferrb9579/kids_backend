// src/validators/eventRoleAssignment.validators.js
import { body } from 'express-validator';

export const assignEventRoleValidator = [
    body('userId')
        .isInt({ gt: 0 })
        .withMessage('userId must be a positive integer')
        .toInt(),
    body('eventId')
        .isInt({ gt: 0 })
        .withMessage('eventId must be a positive integer')
        .toInt(),
    body('roleId')
        .isInt({ gt: 0 })
        .withMessage('roleId must be a positive integer')
        .toInt(),
];

export const removeEventRoleValidator = [
    body('userId')
        .isInt({ gt: 0 })
        .withMessage('userId must be a positive integer')
        .toInt(),
    body('eventId')
        .isInt({ gt: 0 })
        .withMessage('eventId must be a positive integer')
        .toInt(),
    body('roleId')
        .isInt({ gt: 0 })
        .withMessage('roleId must be a positive integer')
        .toInt(),
];
