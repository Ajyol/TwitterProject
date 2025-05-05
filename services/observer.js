// services/observer.js
const User = require('../models/User');
const Topic = require('../models/Topic');

class Observer {
  constructor() {
    this.subscribers = new Map(); // topicId -> Set(userIds)
  }

  subscribe(topicId, userId) {
    if (!this.subscribers.has(topicId)) {
      this.subscribers.set(topicId, new Set());
    }
    this.subscribers.get(topicId).add(userId);
  }

  unsubscribe(topicId, userId) {
    if (this.subscribers.has(topicId)) {
      this.subscribers.get(topicId).delete(userId);
    }
  }

  notify(topicId, message) {
    if (this.subscribers.has(topicId)) {
      const userIds = this.subscribers.get(topicId);
      userIds.forEach(async userId => {
        const user = await User.findById(userId);
        if (user) {
          console.log(`📬 Notify ${user.username}: New message in topic ${topicId}`);
        }
      });
    }
  }

  initializeFromDB(topics) {
    topics.forEach(topic => {
      this.subscribers.set(topic._id.toString(), new Set(topic.subscribers.map(id => id.toString())));
    });
  }
}

module.exports = new Observer();
