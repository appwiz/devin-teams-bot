// Configuration settings for the application
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

module.exports = {
  // Bot Framework configuration
  bot: {
    id: process.env.BOT_ID,
    password: process.env.BOT_PASSWORD
  },
  
  // Devin API configuration
  devin: {
    apiKey: process.env.DEVIN_API_KEY,
    baseUrl: 'https://api.devin.ai'
  },
  
  // Server configuration
  server: {
    port: process.env.PORT || 3978
  }
};
