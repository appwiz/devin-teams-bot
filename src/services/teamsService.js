const logger = require('../utils/logger');

/**
 * Service for formatting messages for Microsoft Teams
 */
class TeamsService {
  /**
   * Format a message for Teams
   * @param {string} message - Raw message content
   * @returns {string} - Formatted message for Teams
   */
  formatMessage(message) {
    try {
      // Teams supports a subset of Markdown
      // This is a simple implementation - could be expanded for more complex formatting
      return message;
    } catch (error) {
      logger.error(`Error formatting message: ${error.message}`);
      return message; // Return original message if formatting fails
    }
  }

  /**
   * Format code blocks for Teams
   * @param {string} code - Code content
   * @param {string} language - Programming language
   * @returns {string} - Formatted code block
   */
  formatCodeBlock(code, language = '') {
    return `\`\`\`${language}\n${code}\n\`\`\``;
  }

  /**
   * Format a Devin API response for Teams
   * @param {object} response - Devin API response
   * @returns {string} - Formatted response for Teams
   */
  formatDevinResponse(response) {
    try {
      if (!response || !response.content) {
        return 'No response from Devin.';
      }
      
      return this.formatMessage(response.content);
    } catch (error) {
      logger.error(`Error formatting Devin response: ${error.message}`);
      return 'Error formatting response from Devin.';
    }
  }
}

module.exports = new TeamsService();
