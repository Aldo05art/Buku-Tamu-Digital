// src/services/authService.js
const prisma = require('../config/db');
const { hashPassword, comparePassword } = require('../utils/bcrypt');
const { generateToken } = require('../utils/jwt');

const registerUser = async (username, email, password, role = 'user') => {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        const error = new Error('User with this email already exists');
        error.statusCode = 400; // Custom status code
        throw error;
    }
    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
        data: {
            username,
            email,
            password: hashedPassword,
            role,
        },
        select: { id: true, username: true, email: true, role: true } // Jangan kembalikan password
    });

    const token = generateToken({ id: user.id, role: user.role });
    return { user, token };
};

const loginUser = async (email, password) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        const error = new Error('Invalid credentials');
        error.statusCode = 401;
        throw error;
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
        const error = new Error('Invalid credentials');
        error.statusCode = 401;
        throw error;
    }

    const token = generateToken({ id: user.id, role: user.role });
    return { user: { id: user.id, username: user.username, email: user.email, role: user.role }, token };
};

module.exports = { registerUser, loginUser };