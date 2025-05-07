const User = require('../models/User');

class NotificationService {
  async notify(topic, message, subscribers) {
    const userPromises = subscribers.map((userId) =>
      User.findById(userId)
    );

    const users = await Promise.all(userPromises);

    const notificationText = `${topic.title}: ${message.content}`;

    for (const user of users) {
      if (user) {
        user.notifications.push({
          message: notificationText,
          date: new Date(),
          read: false
        });
        await user.save();
      }
    }
  }
}

module.exports = new NotificationService();
