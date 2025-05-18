require('dotenv').config();
const amqp = require('amqplib');
const twilio = require('twilio');

const RABBITMQ_URL = process.env.RABBITMQ_URL;
const TWILIO_SID = process.env.TWILIO_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_PHONE = process.env.TWILIO_PHONE;
const YOUR_PHONE = '+9162XXXXXXXX'; 

const client = twilio(TWILIO_SID, TWILIO_AUTH_TOKEN);

(async () => {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();
    const queue = 'testQueue';

    await channel.assertQueue(queue, { durable: false });

    console.log(`📥 Waiting for messages in ${queue}. To exit press CTRL+C`);

    channel.consume(queue, async (msg) => {
      if (msg !== null) {
        const text = msg.content.toString();
        console.log('📨 Received:', text);

        // Send SMS using Twilio
        try {
          console.log('Sending SMS from:', TWILIO_PHONE);
console.log('Sending SMS to:', YOUR_PHONE);

          const message = await client.messages.create({
            body: text,
            from: TWILIO_PHONE,
            to: YOUR_PHONE
          });
          console.log('✅ SMS sent:', message.sid);
        } catch (err) {
          console.error('❌ Error sending SMS:', err.message);
        }

        channel.ack(msg);
      }
    });
  } catch (err) {
    console.error('❌ Consumer error:', err.message);
  }
})();
