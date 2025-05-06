const Topic = require('../models/Topic');
const User = require('../models/User');
const Message = require('../models/Message');
const observer = require('../services/observer');

exports.createTopic = async (req, res) => {
    const { title, messageContent } = req.body;
    const userId = req.user.id;

    try {
        const topic = await Topic.create({
            title,
            createdBy: userId,
            subscribers: [userId]
        });

        const message = new Message({
            content: messageContent,
            author: userId,
            topic: topic._id,
            postedDate: new Date()
        });
        await message.save();
        await topic.save();

        const user = await User.findById(userId);
        if (!user.subscriptions.includes(topic._id)) {
            user.subscriptions.push(topic._id);
            await user.save();
        }

        await observer.subscribe(topic._id.toString(), userId);
        
        res.redirect('/dashboard');
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

exports.subscribe = async (req, res) => {
    try {
        const topic = await Topic.findById(req.params.id);
        const userId = req.user.id;

        await observer.subscribe(topic._id.toString(), userId);

        res.redirect('/dashboard');
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

exports.unsubscribe = async (req, res) => {
    try {
        const topic = await Topic.findById(req.params.id);
        const userId = req.user.id;

        await observer.unsubscribe(topic._id.toString(), userId);

        res.redirect('/dashboard');
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
