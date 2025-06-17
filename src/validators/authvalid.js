// src/validators/authValidator.js
const { body } = require('express-validator');

// Aturan validasi untuk registrasi user
const registerValidation = [
    body('username')
        .notEmpty().withMessage('Username is required')
        .isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
    body('email')
        .isEmail().withMessage('Please enter a valid email')
        .normalizeEmail(), // Membersihkan email (misal: lowercase)
    body('password')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role')
        .optional() // Field ini opsional
        .isIn(['user', 'admin']).withMessage('Role must be either "user" or "admin"')
];

// Aturan validasi untuk login user
const loginValidation = [
    body('email')
        .isEmail().withMessage('Please enter a valid email')
        .normalizeEmail(),
    body('password')
        .notEmpty().withMessage('Password is required')
];

module.exports = { registerValidation, loginValidation };