// src/middlewares/errorHandler.js
// Hapus baris ini: const { env } = require('../config');

const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

    // Penanganan error spesifik dari Prisma ORM
    if (err.code && err.code.startsWith('P')) {
        switch (err.code) {
            case 'P2002':
                return res.status(409).json({
                    message: `Conflict: Duplicate entry for ${err.meta.target.join(', ')}.`
                });
            case 'P2025':
                return res.status(404).json({
                    message: 'Resource not found.'
                });
            case 'P2003':
                return res.status(400).json({
                    message: `Bad Request: Foreign key constraint failed. Related resource might not exist or be invalid.`
                });
            default:
                return res.status(500).json({
                    message: 'Database operation failed due to an unexpected issue.'
                });
        }
    }

    res.status(statusCode).json({
        message: err.message,
        // stack: process.env.NODE_ENV === 'development' ? err.stack : null, // Baris ini juga tidak menggunakan 'env' lagi, melainkan 'process.env.NODE_ENV'
    });
};

module.exports = errorHandler;