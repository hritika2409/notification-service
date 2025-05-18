const twilio = require('twilio');

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

module.exports.sendSMS = async (notification) => {
  const toPhone = notification.to || '+91xxxxxxxxxx'; // Replace with actual logic

  const message = await client.messages.create({
    body: notification.message,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: toPhone,
  });

  console.log(`✅ SMS sent to ${toPhone}: ${message.sid}`);
};
