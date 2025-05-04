const mongoose = require('mongoose');

const UserDto = new mongoose.Schema({
    username: { type: String, unique: true},
    password: String,
});

module.exports = mongoose.model('User', UserDto);