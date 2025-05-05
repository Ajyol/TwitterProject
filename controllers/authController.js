const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
    const { username, password } = req.body;
    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) return res.status(400).json({ msg: 'Username taken' });

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const user = await User.create({ username, password: hashedPassword });
        
        res.redirect('/login');
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ msg: 'User not found' });

        const validate = await bcrypt.compare(password, user.password);
        if (!validate) return res.status(401).json({ msg: 'Invalid password' });

        const token = jwt.sign({ id: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: '2d' });

        res.cookie('auth_token', token, { 
            httpOnly: true, 
            maxAge: 2 * 24 * 60 * 60 * 1000, // Cookie expiration
            secure: process.env.NODE_ENV === 'production', 
        });

        res.redirect('/dashboard');
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};
