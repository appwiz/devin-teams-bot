const express = require('express');
const router = express.Router();
const { BotFrameworkAdapter, ActivityTypes } = require('botbuilder');
const botController = require('../controllers/botController');
const { validateTeamsRequest } = require('../middleware/authMiddleware');
const { parseMessage, sanitizeMessage } = require('../utils/messageParser');
const config = require('../config');
const logger = require('../utils/logger');

// Create adapter
const adapter = new BotFrameworkAdapter({
  appId: config.bot.id,
  appPassword: config.bot.password
});

// Error handler
adapter.onTurnError = async (context, error) => {
  logger.error(`Bot error: ${error}`);
  await context.sendActivity('Sorry, something went wrong!');
};

// Teams message webhook endpoint
router.post('/api/messages', validateTeamsRequest, (req, res) => {
  logger.info('Received message from Teams');
  
  adapter.processActivity(req, res, async (context) => {
    // Ignore non-message activities
    if (context.activity.type !== ActivityTypes.Message) {
      logger.info(`Ignoring non-message activity type: ${context.activity.type}`);
      return;
    }
    
    const message = context.activity.text || '';
    const sanitizedMessage = sanitizeMessage(message);
    const parsedMessage = parseMessage(sanitizedMessage);
    
    logger.info(`Parsed message: ${JSON.stringify(parsedMessage)}`);
    
    if (parsedMessage.isCommand) {
      // Handle as command
      await botController.handleCommand(context, parsedMessage.command);
    } else {
      // Process as regular message
      await botController.processMessage(context);
    }
  });
});

// Health check endpoint for the bot
router.get('/api/health', (req, res) => {
  logger.info('Bot health check requested');
  
  // Check if bot adapter is initialized
  if (adapter) {
    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString()
    });
  } else {
    res.status(500).json({
      status: 'unhealthy',
      error: 'Bot adapter not initialized',
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router;
