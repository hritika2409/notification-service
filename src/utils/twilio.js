// src/utils/smsSender.js
const twilio = require('twilio');

const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

const sendSMS = async (to, message) => {
  try {
    const res = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE, // Twilio number
      to: to                         // Your real phone number
    });
    console.log('✅ SMS sent:', res.sid);
  } catch (err) {
    console.error('❌ SMS error:', err.message);
  }
};

module.exports = { sendSMS };
