// src/middlewares/validateFields.js
import { validationResult } from 'express-validator';

export const validateFields = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Return 400 with all validation errors
        return res.status(400).json({
            success: false,
            message: 'Validation error',
            errors: errors.array(),
        });
    }
    next();
};
