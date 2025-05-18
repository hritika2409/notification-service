const nodemailer = require("nodemailer");

module.exports.sendEmail = async (notification) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Notification Service" <${process.env.EMAIL_USER}>`,
    to: notification.to || "recipient@example.com", // Add actual recipient logic
    subject: "New Notification",
    text: notification.message,
  });

  console.log(`✅ Email sent to ${notification.to}`);
};
