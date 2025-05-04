const mongoose = require('mongoose');

const MessageDto = new mongoose.Schema({
    content: String,
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    topic: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic' },
    postedDate: { type: Date, default: Date.now }
});

module.exports = mongoose.Model('Message', MessageDto);