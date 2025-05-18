const amqp = require('amqplib');

const RABBITMQ_URL = 'amqps://izoabvou:jClP9z69xCw7HuU8uH1klAz_hA9DIlsj@puffin.rmq2.cloudamqp.com/izoabvou';

(async () => {
  try {
   
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();

  
    const queue = 'testQueue';
    await channel.assertQueue(queue, {
      durable: false
    });

    const message = 'Hey Its important!';
    channel.sendToQueue(queue, Buffer.from(message));
    console.log('✅ Message sent:', message);

    setTimeout(() => {
      connection.close();
      process.exit(0);
    }, 500);
  } catch (error) {
    console.error('❌ Error sending message:', error);
  }
})();
