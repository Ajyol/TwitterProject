const User = require('../models/User');

class NotificationService {
    async notify(topic, message, subscribers) {
        const userPromises = subscribers.map((userId) =>
            User.findById(userId).select('username')
        );

        const users = await Promise.all(userPromises);

        users.forEach((user) => {
            if (user) {
                console.log(`Notify user ${user.username}: New message in topic "${topic.title}": ${message.content}`);
            }
        });
    }
}

module.exports = new NotificationService();
