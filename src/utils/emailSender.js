module.exports.sendEmail = async (notification) => {
    console.log(`Sending EMAIL to user ${notification.userId}: ${notification.message}`);
    return true;
  };
  