const express = require('express');
const router = express.Router();
const viewController = require('../controllers/viewController');

router.get('/login', viewController.showLogin);
router.get('/register', viewController.showRegister);
router.get('/dashboard', viewController.showDashboard);
router.get('/topics/:topicId/messages', viewController.showMessagesForTopic);
router.post('/topics/:id/messages', viewController.postMessageForTopic);
router.get('/stats', viewController.showStats);

module.exports = router;
