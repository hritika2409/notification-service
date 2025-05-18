const Notification = require('../models/Notification');
const amqp = require('amqplib');

exports.sendNotification = async (req, res) => {
  const { userId, type, message } = req.body;
  const notification = new Notification({ userId, type, message });
  await notification.save();

  const connection = await amqp.connect(process.env.RABBITMQ_URL);
  const channel = await connection.createChannel();
  await channel.assertQueue('notifications');
  channel.sendToQueue('notifications', Buffer.from(JSON.stringify(notification)));

  res.status(200).json({ message: 'Notification queued' });
};

exports.getUserNotifications = async (req, res) => {
  const notifications = await Notification.find({ userId: req.params.id });
  res.json(notifications);
};
