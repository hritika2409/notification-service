const amqp = require('amqplib');
require('dotenv').config();

function getPriorityValue(priority) {
  switch (priority) {
    case 'critical': return 10;
    case 'normal': return 5;
    case 'low': return 1;
    default: return 5;
  }
}

async function sendTestMessage() {
  const connection = await amqp.connect(process.env.RABBITMQ_URL);
  const channel = await connection.createChannel();
  const queue = 'notifications';

  await channel.assertQueue(queue, {
    durable: true,
    maxPriority: 10,
  });

  const msg = {
    userId: '123',
    type: 'email',
    priority: 'low',
    message: 'Hey',
  };

  channel.sendToQueue(queue, Buffer.from(JSON.stringify(msg)), {
    persistent: true,
    priority: getPriorityValue(msg.priority),
  });

  console.log('✅ Sent message with priority:', msg.priority);
  setTimeout(() => {
    connection.close();
    process.exit(0);
  }, 500);
}

sendTestMessage();
