const mongoose = require('mongoose');

const UserDto = new mongoose.Schema({
    username: { type: String, unique: true},
    password: String,
    subscriptions: [{type: mongoose.Schema.Types.ObjectId, ref: 'Topic'}]
});

module.exports = mongoose.model('User', UserDto);