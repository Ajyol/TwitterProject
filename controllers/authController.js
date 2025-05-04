const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
    const { username, password } = req.body;
    try {
        // Check if the username is already taken
        const existingUser = await User.findOne({ username });
        if (existingUser) return res.status(400).json({ msg: 'Username taken' });

        // Hash the password before saving the user
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create the new user with the hashed password
        const user = await User.create({ username, password: hashedPassword });
        
        // Redirect to login page after successful registration
        res.redirect('/login');
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
        // Find the user by username
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ msg: 'User not found' });

        // Compare the provided password with the stored hashed password
        const validate = await bcrypt.compare(password, user.password);
        if (!validate) return res.status(401).json({ msg: 'Invalid password' });

        // Use toString() to ensure the ID is passed as a string in the token
        const token = jwt.sign({ id: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: '2d' });

        console.log("Token: ", token);  // Log the token to make sure it's being generated.

        // Set the cookie with the token
        res.cookie('auth_token', token, { 
            httpOnly: true, 
            maxAge: 2 * 24 * 60 * 60 * 1000, // Cookie expiration in 2 days
            secure: process.env.NODE_ENV === 'production', // Only secure in production (use HTTPS)
        });

        // Redirect to dashboard after successful login
        res.redirect('/dashboard');
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};
