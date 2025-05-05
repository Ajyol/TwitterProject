const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
    const { auth_token } = req.cookies;
    if (!auth_token) return res.status(401).json({ msg: 'No token provided' });

    try {
        const decoded = jwt.verify(auth_token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);
        next();
    } catch (error) {
        res.status(401).json({ msg: error.message });
    }
};
