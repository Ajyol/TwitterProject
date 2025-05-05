const express = require('express');
const router = express.Router();
const auth = require('../utils/authMiddleware');
const messageController = require('../controllers/messageController');

router.post('/:topicId', auth, messageController.postMessage);
router.get('/recent', auth, messageController.getRecentMessagesForUser);

module.exports = router;