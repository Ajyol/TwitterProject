const express = require('express');
const router = express.Router();
const auth = require('../utils/authMiddleware');
const topicController = require('../controllers/topicController');

router.post('/', auth, topicController.createTopic);
router.get('/', auth, topicController.getAllTopics);
router.post('/:id/subscribe', auth, topicController.subscribe);
router.post('/:id/unsubscribe', auth, topicController.unsubscribe);
router.get('/stats', auth, topicController.getTopicStats);

module.exports = router;