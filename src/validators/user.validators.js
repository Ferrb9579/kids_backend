// src/validators/user.validators.js
import { body } from 'express-validator';

// Example user creation validations
export const createUserValidator = [
    body('kid')
        .trim()
        .escape()
        .isLength({ min: 1 })
        .withMessage('kid is required'),
    body('username')
        .trim()
        .escape()
        .isLength({ min: 1 })
        .withMessage('username is required'),
    body('kmail')
        .trim()
        .isEmail()
        .withMessage('Invalid email format'),
    body('role')
        .optional()
        .isIn(['student', 'faculty', 'admin'])
        .withMessage('role must be one of student, faculty, admin'),
];
