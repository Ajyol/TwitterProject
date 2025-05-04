const express = require('express');
const router = express.Router();
const viewController = require('../controllers/viewController');

router.get('/', viewController.showLogin);
router.get('/register', viewController.showRegister);
router.get('/dashboard', viewController.showDashboard);
router.get('/topics', viewController.showTopics);
router.get('/topics/:id/messages', viewController.showMessages);
router.get('/stats', viewController.showStats);

module.exports = router;
