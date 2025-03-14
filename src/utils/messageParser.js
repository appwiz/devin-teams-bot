/**
 * Utility for parsing and processing messages from Teams
 */
const logger = require('./logger');

/**
 * Parse a message from Teams to extract commands and content
 * @param {string} message - Raw message from Teams
 * @returns {object} - Parsed message with command and content
 */
const parseMessage = (message) => {
  try {
    if (!message) {
      return { isCommand: false, command: null, content: '' };
    }

    const trimmedMessage = message.trim();
    
    // Check if message is a command (starts with /)
    if (trimmedMessage.startsWith('/')) {
      const parts = trimmedMessage.substring(1).split(' ');
      const command = parts[0].toLowerCase();
      const content = parts.slice(1).join(' ').trim();
      
      return {
        isCommand: true,
        command,
        content
      };
    }
    
    // Check if message starts with a known command without slash
    const knownCommands = ['help', 'new'];
    const firstWord = trimmedMessage.split(' ')[0].toLowerCase();
    
    if (knownCommands.includes(firstWord)) {
      const content = trimmedMessage.substring(firstWord.length).trim();
      
      return {
        isCommand: true,
        command: firstWord,
        content
      };
    }
    
    // Regular message
    return {
      isCommand: false,
      command: null,
      content: trimmedMessage
    };
  } catch (error) {
    logger.error(`Error parsing message: ${error.message}`);
    return {
      isCommand: false,
      command: null,
      content: message || ''
    };
  }
};

/**
 * Sanitize a message to remove potentially harmful content
 * @param {string} message - Message to sanitize
 * @returns {string} - Sanitized message
 */
const sanitizeMessage = (message) => {
  try {
    if (!message) {
      return '';
    }
    
    // Basic sanitization - remove HTML tags
    return message.replace(/<[^>]*>?/gm, '');
  } catch (error) {
    logger.error(`Error sanitizing message: ${error.message}`);
    return message || '';
  }
};

module.exports = {
  parseMessage,
  sanitizeMessage
};
