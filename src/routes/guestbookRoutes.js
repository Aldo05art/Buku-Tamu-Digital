// src/routes/guestbookRoutes.js
const express = require('express');
const { createEntry, getAllEntries, getEntry, updateEntry, deleteEntry } = require('../controllers/guestbookController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/authorizeMiddleware'); // Opsional, jika ada role khusus untuk admin delete
const { body, param } = require('express-validator');

const router = express.Router();

router.route('/')
    .post(protect, [
        body('title').notEmpty().withMessage('Title is required').isLength({ max: 255 }).withMessage('Title cannot exceed 255 characters'),
        body('content').notEmpty().withMessage('Content is required')
    ], createEntry) // Hanya user terautentikasi bisa membuat entri
    .get(getAllEntries); // Semua orang bisa melihat entri

router.route('/:id')
    .get([
        param('id').isUUID().withMessage('Invalid UUID format for ID')
    ], getEntry)
    .put(protect, [
        param('id').isUUID().withMessage('Invalid UUID format for ID'),
        body('title').notEmpty().withMessage('Title is required').isLength({ max: 255 }).withMessage('Title cannot exceed 255 characters'),
        body('content').notEmpty().withMessage('Content is required')
    ], updateEntry) // Hanya user terautentikasi (dan pemilik/admin) bisa update
    .delete(protect, deleteEntry); // Hanya user terautentikasi (dan pemilik/admin) bisa delete

// Contoh rute yang hanya bisa diakses admin untuk delete (jika diperlukan kebijakan yang lebih ketat)
// router.delete('/:id', protect, authorize(['admin']), deleteEntry); // Jika hanya admin yang boleh hapus

module.exports = router;