/**
 * Test script for the Devin API integration
 * This script tests the Devin API service directly
 */
const dotenv = require('dotenv');
const devinService = require('../services/devinService');
const logger = require('../utils/logger');

// Load environment variables
dotenv.config();

/**
 * Test creating a new Devin session
 * @param {string} prompt - Initial prompt for Devin
 */
const testCreateSession = async (prompt) => {
  try {
    logger.info(`Testing create session with prompt: ${prompt}`);
    const response = await devinService.createSession(prompt);
    logger.info('Session created successfully:');
    console.log(JSON.stringify(response, null, 2));
    return response;
  } catch (error) {
    logger.error(`Error creating session: ${error.message}`);
    if (error.response) {
      logger.error(`Response status: ${error.response.status}`);
      logger.error(`Response data: ${JSON.stringify(error.response.data)}`);
    }
  }
};

/**
 * Test sending a message to an existing Devin session
 * @param {string} sessionId - Devin session ID
 * @param {string} message - Message to send
 */
const testSendMessage = async (sessionId, message) => {
  try {
    logger.info(`Testing send message to session ${sessionId}: ${message}`);
    const response = await devinService.sendMessage(sessionId, message);
    logger.info('Message sent successfully:');
    console.log(JSON.stringify(response, null, 2));
    return response;
  } catch (error) {
    logger.error(`Error sending message: ${error.message}`);
    if (error.response) {
      logger.error(`Response status: ${error.response.status}`);
      logger.error(`Response data: ${JSON.stringify(error.response.data)}`);
    }
  }
};

/**
 * Test getting session details
 * @param {string} sessionId - Devin session ID
 */
const testGetSessionDetails = async (sessionId) => {
  try {
    logger.info(`Testing get session details for session ${sessionId}`);
    const response = await devinService.getSessionDetails(sessionId);
    logger.info('Session details retrieved successfully:');
    console.log(JSON.stringify(response, null, 2));
    return response;
  } catch (error) {
    logger.error(`Error getting session details: ${error.message}`);
    if (error.response) {
      logger.error(`Response status: ${error.response.status}`);
      logger.error(`Response data: ${JSON.stringify(error.response.data)}`);
    }
  }
};

/**
 * Run a complete test flow
 */
const runCompleteTest = async () => {
  try {
    // Create a session
    const sessionResponse = await testCreateSession('Write a simple "Hello World" function in JavaScript');
    
    if (!sessionResponse || !sessionResponse.session_id) {
      logger.error('Failed to create session, cannot continue test');
      return;
    }
    
    const sessionId = sessionResponse.session_id;
    
    // Wait a moment for the session to initialize
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Get session details
    await testGetSessionDetails(sessionId);
    
    // Send a follow-up message
    await testSendMessage(sessionId, 'Can you add error handling to that function?');
    
    // Wait a moment for the message to be processed
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Get updated session details
    await testGetSessionDetails(sessionId);
    
    logger.info('Complete test flow finished successfully');
  } catch (error) {
    logger.error(`Error in test flow: ${error.message}`);
  }
};

// If script is run directly, run the complete test
if (require.main === module) {
  if (!process.env.DEVIN_API_KEY) {
    logger.error('DEVIN_API_KEY environment variable is not set. Please set it in your .env file.');
    process.exit(1);
  }
  
  runCompleteTest().catch(error => {
    logger.error(`Test failed: ${error.message}`);
    process.exit(1);
  });
}

module.exports = {
  testCreateSession,
  testSendMessage,
  testGetSessionDetails,
  runCompleteTest
};
