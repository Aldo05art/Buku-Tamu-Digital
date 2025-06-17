// src/controllers/guestbookController.js
const guestbookService = require('../services/guestbookService');
const { validationResult } = require('express-validator');

const createEntry = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { title, content } = req.body;
        const userId = req.user.id; // ID user dari token JWT
        const newEntry = await guestbookService.createEntry(title, content, userId);
        res.status(201).json(newEntry);
    } catch (error) {
        next(error);
    }
};

const getAllEntries = async (req, res, next) => {
    try {
        const entries = await guestbookService.getAllEntries();
        res.status(200).json(entries);
    } catch (error) {
        next(error);
    }
};

const getEntry = async (req, res, next) => {
    try {
        const { id } = req.params;
        const entry = await guestbookService.getEntryById(id);
        if (!entry) {
            return res.status(404).json({ message: 'Guestbook entry not found' });
        }
        res.status(200).json(entry);
    } catch (error) {
        next(error);
    }
};

const updateEntry = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { id } = req.params;
        const { title, content } = req.body;
        const entry = await guestbookService.getEntryById(id);

        if (!entry) {
            return res.status(404).json({ message: 'Guestbook entry not found' });
        }

        // Otorisasi: Hanya user pemilik entri atau admin yang bisa update
        if (entry.userId !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden: You are not authorized to update this entry.' });
        }

        const updatedEntry = await guestbookService.updateEntry(id, title, content);
        res.status(200).json(updatedEntry);
    } catch (error) {
        next(error);
    }
};

const deleteEntry = async (req, res, next) => {
    try {
        const { id } = req.params;
        const entry = await guestbookService.getEntryById(id);

        if (!entry) {
            return res.status(404).json({ message: 'Guestbook entry not found' });
        }

        // Otorisasi: Hanya user pemilik entri atau admin yang bisa delete
        if (entry.userId !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden: You are not authorized to delete this entry.' });
        }

        const result = await guestbookService.deleteEntry(id);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createEntry,
    getAllEntries,
    getEntry,
    updateEntry,
    deleteEntry,
};