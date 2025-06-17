// src/middlewares/authMiddleware.js
const { verifyToken } = require('../utils/jwt');
const prisma = require('../config/db');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = verifyToken(token); // Mendapatkan payload dari token

            // Cari user di database berdasarkan ID dari token
            req.user = await prisma.user.findUnique({
                where: { id: decoded.id },
                select: { id: true, username: true, email: true, role: true } // Pilih field yang aman
            });

            if (!req.user) {
                return res.status(401).json({ message: 'Not authorized, user not found' });
            }

            next();
        } catch (error) {
            console.error(error);
            // Handle JsonWebTokenError (misal: token expired, invalid)
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Token expired' });
            }
            if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({ message: 'Invalid token' });
            }
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

module.exports = { protect };