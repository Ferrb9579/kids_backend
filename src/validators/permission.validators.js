// src/validators/permission.validators.js
import { body, param, query } from 'express-validator';

export const permissionIdParamValidator = [
    param('id')
        .isInt({ gt: 0 })
        .withMessage('Permission ID must be a positive integer'),
];

export const createPermissionValidator = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Permission name is required')
        .escape(),
    body('codename')
        .trim()
        .notEmpty()
        .withMessage('Permission codename is required')
        .escape(),
];

export const updatePermissionValidator = [
    body('name')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Permission name cannot be empty')
        .escape(),
    body('codename')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Permission codename cannot be empty')
        .escape(),
];
