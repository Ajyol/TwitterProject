const mongoose = require('mongoose');

const TopicDto = new mongoose.Schema({
    title: { type: String, required: true },
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],
    subscribers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    views: { type: Number, default: 0 }
});

modeule.exports = mongoose.Model('Topic', TopicDto);