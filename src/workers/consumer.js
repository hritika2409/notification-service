const amqp = require('amqplib');
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

    channel.consume(queue, async (msg) => {
      if (msg !== null) {
        try {
          const data = JSON.parse(msg.content.toString());

          console.log('📨 Received notification:');
          console.log('   🧑 User ID:', data.userId);
          console.log('   📩 Type:', data.type);
          console.log('   🔼 Priority:', data.priority || 'normal');
          console.log('   ✉️ Message:', data.message);

       

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

  } catch (err) {
    console.error('❌ Connection failed:', err.message);
  }
}

consume();
