// src/services/guestbookService.js
const prisma = require('../config/db');

const createEntry = async (title, content, userId) => {
    return prisma.guestbookEntry.create({
        data: {
            title,
            content,
            userId,
        },
        include: { user: { select: { username: true, email: true } } } // Sertakan info user pembuat
    });
};

const getAllEntries = async () => {
    return prisma.guestbookEntry.findMany({
        orderBy: { createdAt: 'desc' }, // Urutkan dari yang terbaru
        include: { user: { select: { username: true, email: true } } }
    });
};

const getEntryById = async (id) => {
    return prisma.guestbookEntry.findUnique({
        where: { id },
        include: { user: { select: { username: true, email: true } } }
    });
};

const updateEntry = async (id, title, content) => {
    return prisma.guestbookEntry.update({
        where: { id },
        data: { title, content },
        include: { user: { select: { username: true, email: true } } }
    });
};

const deleteEntry = async (id) => {
    await prisma.guestbookEntry.delete({ where: { id } });
    return { message: 'Guestbook entry deleted successfully' };
};

module.exports = {
    createEntry,
    getAllEntries,
    getEntryById,
    updateEntry,
    deleteEntry,
};