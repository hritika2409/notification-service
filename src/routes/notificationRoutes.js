const express = require('express');
const router = express.Router();
const controller = require('../controllers/notificationController');

router.post('/', controller.sendNotification);
router.get('/user/:id', controller.getUserNotifications);

module.exports = router;
