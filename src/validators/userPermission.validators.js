// src/validators/userPermission.validators.js
import { body, param, query } from 'express-validator';

export const userPermissionIdParamValidator = [
    param('id')
        .isInt({ gt: 0 })
        .withMessage('UserPermission ID must be a positive integer'),
];

export const createUserPermissionValidator = [
    body('userId')
        .isInt({ gt: 0 })
        .withMessage('userId must be a positive integer')
        .toInt(),
    body('permissionId')
        .isInt({ gt: 0 })
        .withMessage('permissionId must be a positive integer')
        .toInt(),
];

export const updateUserPermissionValidator = [
    body('userId')
        .optional()
        .isInt({ gt: 0 })
        .withMessage('userId must be a positive integer')
        .toInt(),
    body('permissionId')
        .optional()
        .isInt({ gt: 0 })
        .withMessage('permissionId must be a positive integer')
        .toInt(),
];

export const userIdParamValidator = [
    param('userId')
        .isInt({ gt: 0 })
        .withMessage('User ID must be a positive integer'),
];
