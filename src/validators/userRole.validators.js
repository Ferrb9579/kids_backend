// src/validators/userRole.validators.js
import { body, param } from 'express-validator';

export const createUserRoleValidator = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Role name is required')
        .escape(),
    body('bitmask')
        .isInt({ gt: 0 })
        .withMessage('bitmask must be a positive integer')
        .toInt(),
];

export const updateUserRoleValidator = [
    body('name')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Role name cannot be empty')
        .escape(),
    body('bitmask')
        .optional()
        .isInt({ gt: 0 })
        .withMessage('bitmask must be a positive integer')
        .toInt(),
];

export const roleIdParamValidator = [
    param('id')
        .isInt({ gt: 0 })
        .withMessage('Role ID must be a positive integer')
        .toInt(),
];
