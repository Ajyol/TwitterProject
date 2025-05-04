const express = require('express');
const router = express.Router();
const auth = require('../utils/authMiddleware');
const { getCurrentUser, getUserSubscriptions } = require('../controllers/userController');

router.get('/me', auth, getCurrentUser);
router.get('/subscriptions', auth, getUserSubscriptions);

module.exports = router;