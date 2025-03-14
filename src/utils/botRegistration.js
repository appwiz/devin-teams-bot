/**
 * Bot Registration Utility
 * 
 * This file provides instructions and utilities for registering the bot with Microsoft Teams.
 * In a production environment, this would be automated through CI/CD pipelines.
 */

const logger = require('./logger');
const fs = require('fs');
const path = require('path');

/**
 * Generate a Teams app package for deployment
 * @param {string} botId - Bot Framework ID
 * @param {string} outputDir - Directory to save the package
 */
const generateAppPackage = (botId, outputDir = './dist') => {
  try {
    // Create output directory if it doesn't exist
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Read manifest template
    const manifestPath = path.join(__dirname, '../manifest/manifest.json');
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

    // Replace placeholders with actual values
    manifest.id = botId;
    manifest.bots[0].botId = botId;

    // Write updated manifest
    fs.writeFileSync(
      path.join(outputDir, 'manifest.json'),
      JSON.stringify(manifest, null, 2)
    );

    logger.info(`Generated Teams app manifest in ${outputDir}`);
    logger.info('To complete the bot registration:');
    logger.info('1. Register a new bot in the Azure portal (https://portal.azure.com)');
    logger.info('2. Create a new Bot Channels Registration');
    logger.info('3. Configure the messaging endpoint to your deployed bot URL + /api/messages');
    logger.info('4. Save the Microsoft App ID and password in your .env file');
    logger.info('5. Create a Teams app package with the generated manifest and appropriate icons');
    logger.info('6. Upload the app package to Teams');
  } catch (error) {
    logger.error(`Error generating app package: ${error.message}`);
    throw error;
  }
};

/**
 * Registration instructions
 */
const printRegistrationInstructions = () => {
  logger.info('=== Bot Registration Instructions ===');
  logger.info('1. Go to the Azure portal (https://portal.azure.com)');
  logger.info('2. Create a new "Bot Channels Registration" resource');
  logger.info('3. Fill in the required information:');
  logger.info('   - Bot handle: A unique name for your bot');
  logger.info('   - Subscription: Your Azure subscription');
  logger.info('   - Resource group: Create new or use existing');
  logger.info('   - Location: Choose a region close to your users');
  logger.info('   - Pricing tier: Choose appropriate tier (F0 is free)');
  logger.info('   - Messaging endpoint: Your bot\'s URL + /api/messages');
  logger.info('     (e.g., https://your-bot-domain.com/api/messages)');
  logger.info('4. Click "Auto create App ID and password"');
  logger.info('5. Complete the registration and note the App ID and password');
  logger.info('6. Add these credentials to your .env file as BOT_ID and BOT_PASSWORD');
  logger.info('7. In the Azure portal, go to your bot resource');
  logger.info('8. Under "Channels", add the Microsoft Teams channel');
  logger.info('9. Generate the Teams app package using the generateAppPackage function');
  logger.info('10. Upload the app package to Teams');
  logger.info('=== End of Instructions ===');
};

module.exports = {
  generateAppPackage,
  printRegistrationInstructions
};
