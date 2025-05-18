const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const amqp = require('amqplib');
require('dotenv').config();


const notificationLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: {
    status: 429,
    error: 'Too many notifications sent. Please try again later.',
  },
});


const notificationHandler = async (req, res) => {
  try {
    const { userId, type, priority = 'normal', message } = req.body;

    if (!userId || !type || !message) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }

    const conn = await amqp.connect(process.env.RABBITMQ_URL, {
      servername: 'puffin.rmq2.cloudamqp.com',
    });
    const channel = await conn.createChannel();
    const queue = 'notifications';

    await channel.assertQueue(queue, {
      durable: true,
      maxPriority: 10,
    });

    const priorityMap = {
      critical: 10,
      normal: 5,
      low: 1,
    };

    const priorityValue = priorityMap[priority] || 5;

    const payload = {
      userId,
      type,
      message,
      priority,
    };

    channel.sendToQueue(queue, Buffer.from(JSON.stringify(payload)), {
      persistent: true,
      priority: priorityValue,
    });

    await channel.close();
    await conn.close();

    res.status(200).json({ success: true, message: 'Notification queued successfully.' });
  } catch (err) {
    console.error('Error in /notifications:', err.message);
    res.status(500).json({ error: 'Internal server error.' });
  }
};


router.post('/notifications', notificationLimiter, notificationHandler);

module.exports = router;
