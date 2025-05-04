const mongoose = require('mongoose');

const UserDto = new mongoose.Schema({
    username: String,
    password: String,
    subscribedTopics: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Topic'}]
});

module.exports = mongoose.model('User', UserDto);