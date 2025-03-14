/**
 * Authentication middleware for validating requests from Microsoft Teams
 */
const config = require('../config');
const logger = require('../utils/logger');

/**
 * Validates that the request is coming from Microsoft Teams
 * In a production environment, this would include more robust validation
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const validateTeamsRequest = (req, res, next) => {
  try {
    // Check for authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      logger.warn('Missing authorization header');
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    // In a production environment, you would validate the JWT token
    // from Microsoft Teams here. For simplicity, we're just checking
    // that the header exists.
    
    // For production, use the botframework-connector library to validate
    // the JWT token against the Bot Framework Auth service
    
    logger.info('Request authenticated successfully');
    next();
  } catch (error) {
    logger.error(`Authentication error: ${error.message}`);
    res.status(401).json({ error: 'Unauthorized' });
  }
};

module.exports = {
  validateTeamsRequest
};
