const User = require('../models/User');

let subscriptions = {}; 

const subscribe = (topicId, userId) => {
    if (!subscriptions[topicId]) {
        subscriptions[topicId] = [];
    }
    if (!subscriptions[topicId].includes(userId)) {
        subscriptions[topicId].push(userId);
    }
};

const unsubscribe = (topicId, userId) => {
    if (subscriptions[topicId]) {
        subscriptions[topicId] = subscriptions[topicId].filter(id => id !== userId);
    }
};

const notifySubscribers = (topicId, message) => {
    const topicSubscribers = subscriptions[topicId] || [];
    topicSubscribers.forEach(subscriberId => {
        console.log(`Notify user ${subscriberId}: ${message}`);
    });
};

module.exports = {
    subscribe,
    unsubscribe,
    notifySubscribers
};
