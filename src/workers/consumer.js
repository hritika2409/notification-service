const amqp = require('amqplib');
const { MongoClient } = require('mongodb');
require('dotenv').config();

async function consume() {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL, {
      servername: 'puffin.rmq2.cloudamqp.com',
    });

    const channel = await connection.createChannel();
    const queue = 'notifications';

    await channel.assertQueue(queue, {
      durable: true,
      maxPriority: 10,
    });

    console.log('[*] Waiting for messages in %s...', queue);

    // ✅ Correct database and collection name from your screenshot
    const mongoClient = new MongoClient(process.env.MONGODB_URI);
    await mongoClient.connect();
    const db = mongoClient.db('Notification'); // ✔ Corrected from "PepSale" to "Notification"
    const notificationsCollection = db.collection('Notification-services'); // ✔ Corrected collection name

    channel.consume(queue, async (msg) => {
      if (msg !== null) {
        try {
          const data = JSON.parse(msg.content.toString());

          console.log('📨 Received notification:');
          console.log('   🧑 User ID:', data.userId);
          console.log('   📩 Type:', data.type);
          console.log('   🔼 Priority:', data.priority || 'normal');
          console.log('   ✉️ Message:', data.message);

          await notificationsCollection.insertOne({
            userId: data.userId,
            type: data.type,
            message: data.message,
            priority: data.priority || 'normal',
            receivedAt: new Date(),
          });

          channel.ack(msg);
        } catch (err) {
          console.error('❌ Failed to process message:', err.message);
          channel.nack(msg, false, false);
        }
      }
    });

    connection.on('error', (err) => {
      console.error('🚨 RabbitMQ connection error:', err.message);
    });

    process.on('SIGINT', async () => {
      console.log('\n🔌 Closing connections...');
      await mongoClient.close();
      await connection.close();
      process.exit(0);
    });

  } catch (err) {
    console.error('❌ Connection failed:', err.message);
  }
}

consume();
