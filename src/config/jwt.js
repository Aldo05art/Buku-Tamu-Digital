module.exports = {
    jwtSecret: process.env.JWT_SECRET || 'default_jwt_secret_guestbook',
    jwtExpiresIn: '3h', // Token berlaku 3 jam
};