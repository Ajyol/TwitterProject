const mongoose = require('mongoose');
const Topic = require('../models/Topic');
const Message = require('../models/Message');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.showLogin = (req, res) => {
  res.render('login');
};

exports.showRegister = (req, res) => {
  res.render('register');
};

exports.showDashboard = async (req, res) => {
    const { auth_token } = req.cookies || {};
  
    if (!auth_token) {
      return res.status(401).redirect('/login');
    }
  
    try {
      const decoded = jwt.verify(auth_token, process.env.JWT_SECRET);
      const userId = decoded.id;
  
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).send('Invalid or missing user ID');
      }
  
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
  try {
    const topics = await Topic.find();
    res.render('topics', { topics });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.showMessages = async (req, res) => {
  try {
    const topic = await Topic.findById(req.params.id);
    if (!topic) return res.status(404).send('Topic not found');
    
    const messages = await Message
      .find({ topic: topic._id })
      .populate('author', 'username')
      .sort({ postedDate: -1 });

    res.render('messages', { topic, messages });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.showStats = async (req, res) => {
  try {
    const topics = await Topic.find({});
    res.render('stats', { topics });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};
