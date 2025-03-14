const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');

// Health check endpoint
router.get('/health', (req, res) => {
  logger.info('Health check requested');
  res.status(200).json({ status: 'ok' });
});

// Root endpoint
router.get('/', (req, res) => {
  res.status(200).send('Devin Teams Bot is running!');
});

module.exports = router;
