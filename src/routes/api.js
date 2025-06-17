// src/routes/api.js
const express = require('express');
// Mengimpor router-router spesifik dari folder routes
const authRouter = require('./authRoutes');
const guestbookRouter = require('./guestbookRoutes'); // Hapus baris newsRouter dan categoriesRouter

const router = express.Router();

// Menggunakan router-router spesifik di bawah path '/api'
router.use('/auth', authRouter);
router.use('/guestbook', guestbookRouter); // Hanya ini yang tersisa

module.exports = router;