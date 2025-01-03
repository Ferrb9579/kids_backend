// src/validators/eventRegistration.validators.js
import { body, param, query } from 'express-validator';

export const registrationIdParamValidator = [
    param('id')
        .isInt({ gt: 0 })
        .withMessage('Registration ID must be a positive integer'),
];

export const createEventRegistrationValidator = [
    body('userId')
        .isInt({ gt: 0 })
        .withMessage('userId must be a positive integer')
        .toInt(),
    body('eventId')
        .isInt({ gt: 0 })
        .withMessage('eventId must be a positive integer')
        .toInt(),
    body('status')
        .optional()
        .isIn(['confirmed', 'pending', 'cancelled'])
        .withMessage('Invalid status')
        .escape(),
];

export const updateEventRegistrationValidator = [
    body('status')
        .optional()
        .isIn(['confirmed', 'pending', 'cancelled'])
        .withMessage('Invalid status')
        .escape(),
];

export const eventIdParamValidator = [
    param('eventId')
        .isInt({ gt: 0 })
        .withMessage('eventId must be a positive integer'),
];
