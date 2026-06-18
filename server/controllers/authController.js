const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'dev-secret-123', {
        expiresIn: '30d',
    });
};

// @desc    Register a new user (Student/Counselor only)
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    try {
        const { name, email, password, role, speciality, credentials } = req.body;

        if (!name || !email || !password || !role) {
            return res.status(400).json({ success: false, message: 'Please add all fields' });
        }

        // Validate password length
        if (password.length < 6) {
            return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long' });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ success: false, message: 'Please enter a valid email address' });
        }

        // 1. Admin Restriction
        if (role === 'admin') {
            const allowedAdmins = ['retik', 'harmeet', 'jamshed'];
            const lowerName = name.toLowerCase();
            const isAllowed = allowedAdmins.some(admin => lowerName.includes(admin));

            if (!isAllowed) {
                return res.status(403).json({ success: false, message: 'Admin registration is restricted to specific personnel.' });
            }
        }

        // 2. Counselor Validation
        let isApproved = true;
        if (role === 'counselor') {
            if (!speciality || !credentials) {
                return res.status(400).json({ success: false, message: 'Counselors must provide speciality and credentials.' });
            }
            isApproved = false; // Pending approval
        }

        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ success: false, message: 'Email already registered' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
            speciality: role === 'counselor' ? speciality : undefined,
            credentials: role === 'counselor' ? credentials : undefined,
            isApproved
        });

        if (user) {
            res.status(201).json({
                success: true,
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user.id)
            });
        } else {
            res.status(400).json({ success: false, message: 'Failed to create user account' });
        }
    } catch (error) {
        console.error('Registration error:', error);
        
        // Handle Mongoose validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ success: false, message: messages.join(', ') });
        }
        
        // Handle duplicate key error
        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: 'Email already registered' });
        }
        
        res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
    }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Please provide email and password' });
        }

        // Check for user email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        
        if (!isPasswordMatch) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        if (user.role === 'counselor' && !user.isApproved) {
            return res.status(401).json({ success: false, message: 'Your account is pending approval by an administrator.' });
        }

        res.json({
            success: true,
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user.id)
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
    }
};

// @desc    Get all counselors
// @route   GET /api/auth/counselors
// @access  Public
const getCounselors = async (req, res) => {
    try {
        const counselors = await User.find({ role: 'counselor', isApproved: true }).select('-password');
        res.status(200).json({ success: true, count: counselors.length, data: counselors });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getCounselors,
    getMe
};
