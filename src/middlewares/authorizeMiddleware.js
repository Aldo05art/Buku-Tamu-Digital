// src/middlewares/authorizeMiddleware.js
const authorize = (roles = []) => {
    if (typeof roles === 'string') {
        roles = [roles];
    }

    return (req, res, next) => {
        if (!req.user) {
            // Ini seharusnya tidak terjadi jika 'protect' middleware sudah dijalankan sebelumnya
            return res.status(401).json({ message: 'User not authenticated' });
        }

        if (roles.length && !roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Forbidden: You do not have the required role.' });
        }
        next();
    };
};

module.exports = { authorize };