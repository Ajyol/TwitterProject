const mongoose = require('mongoose');

const TopicDto = new mongoose.Schema({
    title: { type: String, required: true },
    createdBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    subscribers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    views: { type: Number, default: 0 }
});

module.exports = mongoose.model('Topic', TopicDto);