/**
 * Test script for the Devin Teams Bot
 * This script simulates Teams messages to test the bot locally
 */
const axios = require('axios');
const readline = require('readline');
const logger = require('../utils/logger');

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Bot endpoint
const BOT_ENDPOINT = 'http://localhost:3978/api/messages';

/**
 * Simulate a Teams message to the bot
 * @param {string} message - Message to send
 * @param {string} userId - Simulated user ID
 */
const simulateTeamsMessage = async (message, userId = 'test-user-123') => {
  try {
    // Create a Teams-like activity
    const activity = {
      type: 'message',
      text: message,
      from: {
        id: userId,
        name: 'Test User'
      },
      channelId: 'msteams',
      conversation: {
        id: 'conversation-123'
      },
      recipient: {
        id: 'bot-123',
        name: 'Devin Bot'
      },
      serviceUrl: 'https://smba.trafficmanager.net/amer/'
    };

    logger.info(`Sending test message: ${message}`);
    
    // Send to bot endpoint
    const response = await axios.post(BOT_ENDPOINT, activity, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    logger.info(`Response status: ${response.status}`);
    
    if (response.data) {
      logger.info('Bot response:');
      console.log(JSON.stringify(response.data, null, 2));
    }
  } catch (error) {
    logger.error(`Error testing bot: ${error.message}`);
    if (error.response) {
      logger.error(`Response status: ${error.response.status}`);
      logger.error(`Response data: ${JSON.stringify(error.response.data)}`);
    }
  }
};

/**
 * Start interactive test session
 */
const startInteractiveTest = () => {
  console.log('=== Devin Teams Bot Test ===');
  console.log('Type messages to test the bot. Type "exit" to quit.');
  console.log('');

  const promptUser = () => {
    rl.question('> ', async (message) => {
      if (message.toLowerCase() === 'exit') {
        rl.close();
        return;
      }

      await simulateTeamsMessage(message);
      promptUser();
    });
  };

  promptUser();
};

// If script is run directly, start interactive test
if (require.main === module) {
  startInteractiveTest();
}

module.exports = {
  simulateTeamsMessage
};
