const { ActivityTypes } = require('botbuilder');
const devinService = require('../services/devinService');
const teamsService = require('../services/teamsService');
const sessionStore = require('../models/session');
const logger = require('../utils/logger');

/**
 * Controller for handling bot interactions
 */
const botController = {
  /**
   * Process incoming messages from Teams
   * @param {TurnContext} context - Bot turn context
   */
  processMessage: async (context) => {
    try {
      // Ignore non-message activities
      if (context.activity.type !== ActivityTypes.Message) {
        return;
      }

      const userId = context.activity.from.id;
      const message = context.activity.text.trim();
      
      logger.info(`Received message from user ${userId}: ${message}`);

      // Send typing indicator
      await context.sendActivity({ type: 'typing' });

      // Check if user has an active session
      if (!sessionStore.hasSession(userId)) {
        try {
          // Create a new session
          const sessionResponse = await devinService.createSession(message);
          sessionStore.saveSession(userId, sessionResponse.session_id);
          
          logger.info(`Created new session ${sessionResponse.session_id} for user ${userId}`);
          
          // Send initial response
          await context.sendActivity('I\'ve connected you to Devin. Your request is being processed...');
          
          // Get session details to check for response
          const sessionDetails = await devinService.getSessionDetails(sessionResponse.session_id);
          
          if (sessionDetails.messages && sessionDetails.messages.length > 0) {
            const latestMessage = sessionDetails.messages[sessionDetails.messages.length - 1];
            const formattedResponse = teamsService.formatDevinResponse(latestMessage);
            await context.sendActivity(formattedResponse);
          }
        } catch (error) {
          logger.error(`Error creating Devin session: ${error.message}`);
          await context.sendActivity('Sorry, I encountered an error while connecting to Devin. Please try again later.');
        }
      } else {
        try {
          // Use existing session
          const sessionId = sessionStore.getSession(userId);
          logger.info(`Using existing session ${sessionId} for user ${userId}`);
          
          // Send message to Devin
          const messageResponse = await devinService.sendMessage(sessionId, message);
          
          // Get session details to retrieve response
          const sessionDetails = await devinService.getSessionDetails(sessionId);
          
          if (sessionDetails.messages && sessionDetails.messages.length > 0) {
            // Find the latest message from Devin (not from the user)
            let latestDevinMessage = null;
            for (let i = sessionDetails.messages.length - 1; i >= 0; i--) {
              const msg = sessionDetails.messages[i];
              if (msg.role === 'assistant') {
                latestDevinMessage = msg;
                break;
              }
            }
            
            if (latestDevinMessage) {
              const formattedResponse = teamsService.formatDevinResponse(latestDevinMessage);
              await context.sendActivity(formattedResponse);
            } else {
              await context.sendActivity('Devin is processing your request...');
            }
          } else {
            await context.sendActivity('Devin is processing your request...');
          }
        } catch (error) {
          logger.error(`Error communicating with Devin: ${error.message}`);
          await context.sendActivity('Sorry, I encountered an error while communicating with Devin. Please try again later.');
          
          // If the session is invalid, remove it so a new one will be created
          if (error.response && error.response.status === 404) {
            sessionStore.removeSession(userId);
            await context.sendActivity('Your previous session has expired. Please send your message again to start a new session.');
          }
        }
      }
    } catch (error) {
      logger.error(`Error processing message: ${error.message}`);
      await context.sendActivity('Sorry, I encountered an error while processing your request. Please try again later.');
    }
  },
  
  /**
   * Handle bot commands
   * @param {TurnContext} context - Bot turn context
   * @param {string} command - Command to handle
   */
  handleCommand: async (context, command) => {
    try {
      const userId = context.activity.from.id;
      
      switch (command.toLowerCase()) {
        case 'help':
          await context.sendActivity(`
            **Devin Bot Help**
            
            This bot allows you to interact with Devin, an AI software engineer, directly from Microsoft Teams.
            
            **Available commands:**
            - **help**: Show this help message
            - **new**: Start a new conversation with Devin
            
            **How to use:**
            Simply type your software engineering questions or tasks, and Devin will respond with assistance.
          `);
          break;
          
        case 'new':
          // Reset the user's session
          sessionStore.removeSession(userId);
          await context.sendActivity('Starting a new conversation with Devin. What would you like help with?');
          break;
          
        default:
          // Process as regular message
          await botController.processMessage(context);
      }
    } catch (error) {
      logger.error(`Error handling command: ${error.message}`);
      await context.sendActivity('Sorry, I encountered an error while processing your command. Please try again later.');
    }
  }
};

module.exports = botController;
