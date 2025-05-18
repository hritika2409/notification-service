module.exports.sendSMS = async (notification) => {
    console.log(`Sending SMS to user ${notification.userId}: ${notification.message}`);
    return true;
  };
  