// src/validators/userRoleAssignment.validators.js
import { body } from 'express-validator';

export const assignUserRoleValidator = [
    body('userId')
        .isInt({ gt: 0 })
        .withMessage('userId must be a positive integer')
        .toInt(),
    body('roleId')
        .isInt({ gt: 0 })
        .withMessage('roleId must be a positive integer')
        .toInt(),
];

export const removeUserRoleValidator = [
    body('userId')
        .isInt({ gt: 0 })
        .withMessage('userId must be a positive integer')
        .toInt(),
    body('roleId')
        .isInt({ gt: 0 })
        .withMessage('roleId must be a positive integer')
        .toInt(),
];
