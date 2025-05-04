const mongoose = require('mongoose');
const Topic = require('../models/Topic');
const Message = require('../models/Message');
const User = require('../models/User');

exports.showLogin = (req, res) => {
  res.render('login');
};

exports.showRegister = (req, res) => {
  res.render('register');
};

exports.showDashboard = async (req, res) => {
  const userId = req.query.user;

  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).send('Invalid or missing user ID');
  }

  try {
    const user = await User.findById(userId).populate('subscriptions');
    if (!user) return res.status(404).send('User not found');

    const topics = user.subscriptions;
    const recentMessages = {};

    for (let topic of topics) {
      const messages = await Message.find({ topic: topic._id })
        .sort({ createdAt: -1 })
        .limit(2);
      recentMessages[topic.name] = messages;
    }

    res.render('dashboard', { user, recentMessages });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.showTopics = async (req, res) => {
  const topics = await Topic.find({});
  res.render('topics', { topics });
};

exports.showMessages = async (req, res) => {
  const topic = await Topic.findById(req.params.id);
  const messages = await Message.find({ topic: topic._id }).sort({ createdAt: -1 });
  res.render('messages', { topic, messages });
};

exports.showStats = async (req, res) => {
  const topics = await Topic.find({});
  res.render('stats', { topics });
};
