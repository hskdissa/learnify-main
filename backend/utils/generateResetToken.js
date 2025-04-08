const crypto = require('crypto');

const generateResetToken = () => {
  // Generate a random token for password reset
  return crypto.randomBytes(20).toString('hex');
};

module.exports = generateResetToken;
