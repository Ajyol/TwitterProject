const Message = require('../models/Message');
const Topic = require('../models/Topic');
const NotificationService = require('../services/NotificationService');

exports.postMessage = async (req, res) => {
    const { content } = req.body;
    const topicId = req.params.topicId;
    const authorId = req.user.id;
    try {
        const message = await Message.create({
            content,
            author: authorId,
            topic: topicId,
            postedDate: new Date()
        });

        observer.notify(topicId, message);
        res.redirect(`/topics/${topicId}/messages`);
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