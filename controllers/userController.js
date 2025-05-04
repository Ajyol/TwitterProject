const User = require('../models/User');
const Tpoic = require('../models/Topic');

exports.getCurrentUser = async (req, res) => {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
};

exports.getUserSubscriptions = async (req, res) => {
    const topics = await Topic.find({subscribers: req.user.id});
    res.json(topics);
};