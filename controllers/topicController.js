const Topic = require('../models/Topic');
const User = require('../models/User'); 
const observer = require('../services/observer');

exports.createTopic = async (req, res) => {
    const { title } = req.body;
    const userId = req.user.id;

    try {
        // Create topic and auto-subscribe creator
        const topic = await Topic.create({
            title,
            createdBy: userId,
            subscribers: [userId]
        });

        // Add to user's subscriptions
        const user = await User.findById(userId);
        if (!user.subscriptions.includes(topic._id)) {
            user.subscriptions.push(topic._id);
            await user.save();
        }

        // Register subscription in observer
        observer.subscribe(topic._id.toString(), userId);

        res.redirect('/dashboard');
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

exports.getAllTopics = async (req, res) => {
    try {
        const topics = await Topic.find();
        res.json(topics);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

exports.subscribe = async (req, res) => {
    try {
        const topic = await Topic.findById(req.params.id);
        const userId = req.user.id;

        if (!topic.subscribers.includes(userId)) {
            topic.subscribers.push(userId);
            await topic.save();
        }

        const user = await User.findById(userId);
        if (!user.subscriptions.includes(topic._id)) {
            user.subscriptions.push(topic._id);
            await user.save();
        }

        observer.subscribe(topic._id.toString(), userId);

        res.redirect('/dashboard');
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

exports.unsubscribe = async (req, res) => {
    try {
        const topic = await Topic.findById(req.params.id);
        const userId = req.user.id;

        if (!topic) {
            return res.status(404).json({ msg: 'Topic not found' });
        }

        // Remove user from topic subscribers
        topic.subscribers = topic.subscribers.filter(
            id => id.toString() !== userId.toString()
        );
        await topic.save();

        // Remove topic from user's subscriptions
        const user = await User.findById(userId);
        user.subscriptions = user.subscriptions.filter(
            sub => sub.toString() !== topic._id.toString()
        );
        await user.save();

        // Unregister from observer
        observer.unsubscribe(topic._id.toString(), userId);

        res.redirect('/dashboard');
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};


exports.getTopicStats = async (req, res) => {
    try {
        const stats = await Topic.find({}, 'title views').sort({ views: -1 });
        res.json(stats);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
