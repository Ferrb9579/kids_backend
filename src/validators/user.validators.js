// src/validators/user.validators.js
import { body, param, query } from 'express-validator';

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

export const externalAuthValidator = [
  body('register_number')
    .trim()
    .notEmpty()
    .withMessage('register_number is required')
    .isAlphanumeric()
    .withMessage('register_number must be alphanumeric')
    .escape(),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('password is required')
    .isLength({ min: 6 })
    .withMessage('password must be at least 6 characters long')
    .escape(),
];

export const userIdParamValidator = [
  param('id')
    .isInt({ gt: 0 })
    .withMessage('User ID must be a positive integer'),
];

export const updateUserValidator = [
  body('kid')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('kid cannot be empty')
    .escape(),
  body('username')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('username cannot be empty')
    .escape(),
  body('kmail')
    .optional()
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail(),
  body('role')
    .optional()
    .isIn(['student', 'faculty', 'admin'])
    .withMessage('role must be one of student, faculty, admin')
    .escape(),
];

export const usernameQueryValidator = [
  query('username')
    .optional()
    .trim()
    .escape(),
];
