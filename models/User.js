const mongoose = require('mongoose');

const UserDto = new mongoose.Schema({
    username: { type: String, unique: true},
    password: String,
    subscriptions: [{type: mongoose.Schema.Types.ObjectId, ref: 'Topic'}],
    notifications: [
        {
          message: String,
          date: { type: Date, default: Date.now },
          read: { type: Boolean, default: false }
        }
      ]
});

module.exports = mongoose.model('User', UserDto);