const User = require('../models/User');
const Topic = require('../models/Topic');

class Observer {
  constructor() {
    this.subscribers = {};
  }

  async subscribe(topicId, userId) {
    if (!this.subscribers[topicId]) {
      this.subscribers[topicId] = new Set();
    }
    this.subscribers[topicId].add(userId);

    const topic = await Topic.findById(topicId);
    if (topic && !topic.subscribers.includes(userId)) {
      topic.subscribers.push(userId);
      await topic.save();
    }

    const user = await User.findById(userId);
    if (user && !user.subscriptions.includes(topicId)) {
      user.subscriptions.push(topicId);
      await user.save();
    }
  }

  async unsubscribe(topicId, userId) {
    if (this.subscribers[topicId]) {
      this.subscribers[topicId].delete(userId);
      if (this.subscribers[topicId].size === 0) {
        delete this.subscribers[topicId];
      }
    }

    await Topic.findByIdAndUpdate(topicId, {
      $pull: { subscribers: userId }
    });

    await User.findByIdAndUpdate(userId, {
      $pull: { subscriptions: topicId }
    });
  }

}

module.exports = new Observer();
