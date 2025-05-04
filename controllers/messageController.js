const Message = require('../models/Message');
const Topic = require('../models/Topic');
const NotificationService = require('../services/NotificationService');

exports.postMessage = async (req, res) => {
    const { content, topicId } = req.body;

    try {
        const topic = await Topic.findById(topic.Id);
        if (!topic) return res.status(404).json({ msg: 'Topic not found'});

        if(!topic.subscribers.includes(req.user.id)) {
            return res.status(403).json({ msg: 'Not subscribed to this topic' });
        }

        const message = await Message.create({
            content,
            topic: topicId,
            author: req.user.id
        });

        res.status(201).json(message);
        NotificationService.notify(topic, message, topic.subscribers);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

exports.getRecentMessagesForUser = async (req, res) => {
    try {
        const topics = await Topic.find({ subscribers: req.user.id });

        const data = await Promise.all(
            topics.map(async (topic) => {
                topic.views++;
                await topic.save();

                const messages = await Message.find({ topic: topic._id })
                    .sort({ createdAt: -1 })
                    .limit(2)
                    .populate('author', 'username');

                return {
                    topicId: topic._id,
                    topicTitle: topic.title,
                    messages
                };
            })
        );

        res.json(data);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};