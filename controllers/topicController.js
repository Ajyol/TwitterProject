const Topic = require('../models/Topic');
const User = require('../models/User'); 
const observer = require('../services/observer')

exports.createTopic = async (req, res) => {
    const { title } = req.body;
    const userId = req.user.id;
    try {
        const topic = await Topic.create({
            title,
            createdBy: userId,
            subscribers: [userId]
        });
        observer.subscribe(topic._id.toString(), userId);

        const user = await User.findById(userId);
        user.subscriptions.push(topic._id);
        await user.save();

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
        const topic = await Topic.findByIdAndUpdate(req.params.id);
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
        const topic = await Topic.findByIdAndUpdate(req.params.id, {
            $pull: { subscribers: req.user.id }
        });

        const user = await User.findById(req.user.id);
        user.subscriptions = user.subscriptions.filter(sub => sub.toString() !== topic._id.toString());
        await user.save();

        observer.unsubscribe(topic._id.toString(), req.user.id);

        res.json({ msg: 'Unsubscribed' });
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