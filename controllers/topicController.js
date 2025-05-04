const Topic = require('../models/Topic');

exports.createTopic = async (req, res) => {
    const { title } = req.body;
    try {
        const topic = await Topic.create({
            title,
            createdBy: req.user.id,
            subscribers: [req.user.id]
        });
        res.status(201).json(topic);

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
        await Topic.findByIdAndUpdate(req.params.id, {
            $addToSet: { subscribers: req.user.id }
        });
        res.json({ msg: 'Subscribed' });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

exports.unsubscribe = async (req, res) => {
    try {
        await Topic/findByIdAndUpdate(req.params.id, {
            $pull: { subscribers: req.user.id }
        });
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