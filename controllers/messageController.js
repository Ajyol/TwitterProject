const Message = require('../models/Message');
const Topic = require('../models/Topic');
const observer = require('../services/observer');

exports.postMessage = async (req, res) => {
    const { content } = req.body;
    const topicId = req.params.topicId;
    const authorId = req.user.id;
    try {
        const topic = await Topic.findById(topicId);
        const message = await Message.create({
            content,
            author: authorId,
            topic: topicId,
            postedDate: new Date()
        });

        topic.views += 1;
        await topic.save();
        
        observer.notifySubscribers(topicId.toString(), `New message in ${topic.title}: ${content}`);
        res.status(201).json(message);
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