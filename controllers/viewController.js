const mongoose = require('mongoose');
const Topic = require('../models/Topic');
const Message = require('../models/Message');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const observer = require('../services/observer');
const notificationService = require('../services/NotificationService');

exports.showLogin = (req, res) => {
  res.render('login');
};

exports.showRegister = (req, res) => {
  res.render('register');
};

exports.showDashboard = async (req, res) => {
  const { auth_token } = req.cookies || {};
  if (!auth_token) return res.status(401).redirect('/login');

  try {
    const decoded = jwt.verify(auth_token, process.env.JWT_SECRET);
    const userId = decoded.id;
    if (!mongoose.Types.ObjectId.isValid(userId)) return res.status(400).send('Invalid or missing user ID');

    const user = await User.findById(userId).populate('subscriptions').lean();
    if (!user) return res.status(404).send('User not found');

    const page = parseInt(req.query.page) || 1;
    const limit = 8;
    const skip = (page - 1) * limit;

    const allTopics = await Topic.find()
      .populate('createdBy', 'username')
      .sort({ createdAt: -1 })
      .lean();

    const topicIds = allTopics.map(t => t._id);
    const firstMessages = await Message.aggregate([
      { $match: { topic: { $in: topicIds } } },
      { $sort: { postedDate: 1 } },
      {
        $group: {
          _id: '$topic',
          firstMessage: { $first: '$$ROOT' }
        }
      }
    ]);

    const messageMap = new Map();
    firstMessages.forEach(({ _id, firstMessage }) => {
      messageMap.set(_id.toString(), firstMessage);
    });

    const subscribedIds = new Set(user.subscriptions.map(sub => sub._id.toString()));
    const recentMessages = await Message.aggregate([
      {
        $group: {
          _id: '$topic',
          latestDate: { $max: '$postedDate' }
        }
      }
    ]);

    const recentMap = new Map();
    recentMessages.forEach(({ _id, latestDate }) => {
      recentMap.set(_id.toString(), latestDate);
    });

    const topicsWithInfo = allTopics.map(topic => {
      const topicId = topic._id.toString();
      return {
        ...topic,
        isSubscribed: subscribedIds.has(topicId),
        latestMessageDate: recentMap.get(topicId) || new Date(0),
        firstMessage: messageMap.get(topicId)
      };
    });

    const sortedTopics = topicsWithInfo.sort((a, b) => {
      if (a.isSubscribed && !b.isSubscribed) return -1;
      if (!a.isSubscribed && b.isSubscribed) return 1;
      return new Date(b.latestMessageDate) - new Date(a.latestMessageDate);
    });

    const paginatedTopics = sortedTopics.slice(skip, skip + limit);

    res.render('dashboard', {
      user,
      topics: paginatedTopics,
      currentPage: page,
      totalPages: Math.ceil(sortedTopics.length / limit),
      notifications: user.notifications || []
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};


exports.showMessagesForTopic = async (req, res) => {
  const topicId = req.params.topicId;
  const { auth_token } = req.cookies;

  try {
    const topic = await Topic.findByIdAndUpdate(
      topicId,
      { $inc: { views: 1 } },
      { new: true }
    ).lean();

    const messages = await Message.find({ topic: topicId }).populate('author').lean();

    res.render('messages', { topic, messages, token: auth_token });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error loading topic messages');
  }
};

exports.postMessageForTopic = async (req, res) => {
  const { content } = req.body;
  const topicId = req.params.id;
  const { auth_token } = req.cookies;

  if (!auth_token) return res.status(401).redirect('/login');

  try {
    const decoded = jwt.verify(auth_token, process.env.JWT_SECRET);
    const userId = decoded.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).send('Invalid or missing user ID');
    }

    const user = await User.findById(userId);
    const topic = await Topic.findById(topicId);

    const newMessage = new Message({
      content,
      topic: topicId,
      author: user._id,
      postedDate: new Date()
    });

    await newMessage.save();

    await observer.subscribe(topicId.toString(), userId);
    await notificationService.notify(topic, newMessage, topic.subscribers);

    res.redirect(`/topics/${topicId}/messages`);
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
