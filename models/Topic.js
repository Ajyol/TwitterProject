const mongoose = require('mongoose');

const TopicDto = new mongoose.Schema({
    title: { type: String, required: true },
    subscribers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    views: { type: Number, default: 0 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Topic', TopicDto);