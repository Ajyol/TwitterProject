const mongoose = require('mongoose');

const MessageDto = new mongoose.Schema({
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    topic: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic', required: true },
    postedDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Message', MessageDto);