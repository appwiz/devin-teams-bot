const axios = require('axios');
const config = require('../config');
const logger = require('../utils/logger');

/**
 * Service for interacting with the Devin API
 */
class DevinService {
  constructor() {
    this.apiKey = config.devin.apiKey;
    this.baseUrl = config.devin.baseUrl;
    this.client = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      }
    });
  }

  /**
   * Create a new Devin session
   * @param {string} prompt - Initial prompt for Devin
   * @returns {Promise<object>} - Session details
   */
  async createSession(prompt) {
    try {
      logger.info('Creating new Devin session');
      const response = await this.client.post('/v1/sessions', {
        prompt
      });
      logger.info(`Session created with ID: ${response.data.session_id}`);
      return response.data;
    } catch (error) {
      logger.error(`Error creating Devin session: ${error.message}`);
      throw error;
    }
  }

  /**
   * Send a message to an existing Devin session
   * @param {string} sessionId - Devin session ID
   * @param {string} message - Message to send
   * @returns {Promise<object>} - Response data
   */
  async sendMessage(sessionId, message) {
    try {
      logger.info(`Sending message to session ${sessionId}`);
      const response = await this.client.post(`/v1/sessions/${sessionId}/messages`, {
        content: message
      });
      logger.info('Message sent successfully');
      return response.data;
    } catch (error) {
      logger.error(`Error sending message to Devin: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get session details
   * @param {string} sessionId - Devin session ID
   * @returns {Promise<object>} - Session details
   */
  async getSessionDetails(sessionId) {
    try {
      logger.info(`Getting details for session ${sessionId}`);
      const response = await this.client.get(`/v1/sessions/${sessionId}`);
      return response.data;
    } catch (error) {
      logger.error(`Error getting session details: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new DevinService();
