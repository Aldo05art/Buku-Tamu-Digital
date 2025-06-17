// src/validators/guestbookValidator.js
const { body, param } = require('express-validator');

// Aturan validasi untuk membuat entri buku tamu baru
const createEntryValidation = [
    body('title')
        .notEmpty().withMessage('Title is required')
        .isLength({ max: 255 }).withMessage('Title cannot exceed 255 characters'),
    body('content')
        .notEmpty().withMessage('Content is required')
];

// Aturan validasi untuk mengupdate entri buku tamu
const updateEntryValidation = [
    param('id')
        .isUUID().withMessage('Invalid UUID format for entry ID'), // Memastikan ID di URL adalah UUID
    body('title')
        .optional() // Field ini opsional untuk update
        .notEmpty().withMessage('Title cannot be empty (if provided)')
        .isLength({ max: 255 }).withMessage('Title cannot exceed 255 characters'),
    body('content')
        .optional()
        .notEmpty().withMessage('Content cannot be empty (if provided)')
];

// Aturan validasi untuk ID entri buku tamu di parameter URL (digunakan untuk GET/DELETE)
const entryIdValidation = [
    param('id')
        .isUUID().withMessage('Invalid UUID format for entry ID')
];

module.exports = { createEntryValidation, updateEntryValidation, entryIdValidation };