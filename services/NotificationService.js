class NotificationService {
    notify(topic, message, subscribers) {
        subscribers.forEach((userId) => {
            console.log(`Notify user ${userId}: New message in topic "${topic.title}": ${message.content}`);
        });
    }
}

module.exports = new NotificationService();