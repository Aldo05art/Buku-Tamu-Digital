// src/controllers/authController.js
const authService = require('../services/authService');
const { validationResult } = require('express-validator');

const register = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { username, email, password, role } = req.body;
        const { user, token } = await authService.registerUser(username, email, password, role);
        res.status(201).json({ message: 'Registration successful', user, token });
    } catch (error) {
        next(error);
    }
};

const login = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { email, password } = req.body;
        const { user, token } = await authService.loginUser(email, password);
        res.status(200).json({ message: 'Login successful', user, token });
    } catch (error) {
        next(error);
    }
};

const getProfile = async (req, res) => {
    res.status(200).json(req.user);
};

module.exports = { register, login, getProfile };