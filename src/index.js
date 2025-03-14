// Main entry point for the Teams bot application
const express = require('express');
const dotenv = require('dotenv');
const logger = require('./utils/logger');
const routes = require('./routes');
const webhookRoutes = require('./routes/webhookRoutes');

// Load environment variables
dotenv.config();

// Create server
const app = express();
const port = process.env.PORT || 3978;

// Parse JSON
app.use(express.json());

// Register routes
app.use('/', routes);
app.use('/', webhookRoutes);

// Start server
app.listen(port, () => {
  logger.info(`Server running on port ${port}`);
  logger.info(`Bot webhook endpoint available at http://localhost:${port}/api/messages`);
});
