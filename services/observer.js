const NotificationService = require('./NotificationService');
class Observer {
    constructor() {
        this.subscribers = new Map();
    }

    subscribe(topicId, userId) {
        if(!this.subscribers.has(topicId)) this.subscribers.set(topicId, new Set());
        this.subscribers.get(topicId).add(userId);
    }

    unsubscribe(topicId, userId) {
        if (this.subscribers.had(topicId)) this.subscribers.get(topicId).delete(userId);
    }

    notify(topic, message) {
        const subscribers = this.subscribers.get(topic._id?.toString()) || new Set();
        NotificationService.notify(topic.title, message.content, subscribers);
    }

    initializeFromDB(topics) {
        for (const topic of topics) {
            this.subscribers.set(topic._id.toString(), new Set(topic.subscribers, map(id => id.toString())))
        }
    }
}

module.exports = new Observer();