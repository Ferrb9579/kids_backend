// src/validators/event.validators.js
import { body, param, query } from 'express-validator';
import { isAfter } from 'date-fns';

export const eventIdParamValidator = [
    param('id')
        .isInt({ gt: 0 })
        .withMessage('Event ID must be a positive integer'),
];

export const createEventValidator = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Event name is required')
        .escape(),
    body('description')
        .optional()
        .trim()
        .escape(),
    body('slots')
        .optional()
        .isInt({ gt: 0 })
        .withMessage('slots must be a positive integer'),
    body('startTime')
        .optional()
        .isISO8601()
        .withMessage('startTime must be a valid ISO8601 date')
        .toDate(),
    body('endTime')
        .optional()
        .isISO8601()
        .withMessage('endTime must be a valid ISO8601 date')
        .custom((value, { req }) => {
            if (req.body.startTime && !isAfter(new Date(value), new Date(req.body.startTime))) {
                throw new Error('endTime must be after startTime');
            }
            return true;
        })
        .toDate(),
    body('isPublic')
        .optional()
        .isBoolean()
        .withMessage('isPublic must be a boolean')
        .toBoolean(),
];

export const updateEventValidator = [
    body('name')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Event name cannot be empty')
        .escape(),
    body('description')
        .optional()
        .trim()
        .escape(),
    body('slots')
        .optional()
        .isInt({ gt: 0 })
        .withMessage('slots must be a positive integer'),
    body('startTime')
        .optional()
        .isISO8601()
        .withMessage('startTime must be a valid ISO8601 date')
        .toDate(),
    body('endTime')
        .optional()
        .isISO8601()
        .withMessage('endTime must be a valid ISO8601 date')
        .custom((value, { req }) => {
            if (req.body.startTime && !isAfter(new Date(value), new Date(req.body.startTime))) {
                throw new Error('endTime must be after startTime');
            }
            return true;
        })
        .toDate(),
    body('isPublic')
        .optional()
        .isBoolean()
        .withMessage('isPublic must be a boolean')
        .toBoolean(),
];

export const pageQueryValidator = [
    query('page')
        .optional()
        .isInt({ gt: 0 })
        .withMessage('page must be a positive integer')
        .toInt(),
    query('limit')
        .optional()
        .isInt({ gt: 0 })
        .withMessage('limit must be a positive integer')
        .toInt(),
    query('search')
        .optional()
        .trim()
        .escape(),
];

export const facultyIdParamValidator = [
    param('facultyId')
        .isInt({ gt: 0 })
        .withMessage('facultyId must be a positive integer'),
];
