# Setting Up the Devin Teams Bot

This guide walks you through the process of setting up and registering the Devin Teams Bot with Microsoft Teams.

## Prerequisites

- An Azure account with an active subscription
- Microsoft Teams admin access (for organization-wide deployment) or Teams user account (for personal use)
- Node.js 14.x or later
- npm 6.x or later

## Bot Registration Steps

### 1. Register a Bot in Azure

1. Go to the [Azure portal](https://portal.azure.com)
2. Search for "Bot Services" and select "Bot Channels Registration"
3. Click "Create"
4. Fill in the required information:
   - Bot handle: `DevinTeamsBot` (or your preferred name)
   - Subscription: Select your Azure subscription
   - Resource group: Create new or use existing
   - Location: Choose a region close to your users
   - Pricing tier: F0 (Free) for testing, or choose an appropriate tier
   - Messaging endpoint: Your bot's URL + `/api/messages` (e.g., `https://your-domain.com/api/messages`)
     - For local development, you can use ngrok to create a tunnel (see below)
   - Microsoft App ID: Click "Auto create App ID and password"
5. Click "Create"
6. Once created, go to the resource and note the Microsoft App ID and password
   - These will be used as `BOT_ID` and `BOT_PASSWORD` in your `.env` file

### 2. Configure Microsoft Teams Channel

1. In your bot resource in Azure, go to "Channels"
2. Click on the Microsoft Teams icon
3. Accept the terms and click "Save"

### 3. Create Teams App Package

1. Clone this repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env` and fill in the values:
   ```
   BOT_ID=your-bot-app-id
   BOT_PASSWORD=your-bot-password
   DEVIN_API_KEY=your-devin-api-key
   PORT=3978
   ```
4. Generate the Teams app package:
   ```
   node -e "require('./src/utils/botRegistration').generateAppPackage(process.env.BOT_ID, './dist')"
   ```
5. This will create a `manifest.json` file in the `dist` directory
6. Create a zip file containing:
   - `manifest.json`
   - `color.png` (192x192 pixel icon)
   - `outline.png` (32x32 pixel icon)

### 4. Deploy the Bot

#### Option 1: Local Development with ngrok

1. Install ngrok: `npm install -g ngrok`
2. Start your bot: `npm run dev`
3. In a new terminal, create a tunnel: `ngrok http 3978`
4. Note the HTTPS URL provided by ngrok (e.g., `https://a1b2c3d4.ngrok.io`)
5. Update your bot's messaging endpoint in Azure to this URL + `/api/messages`

#### Option 2: Cloud Deployment

1. Deploy the bot to your preferred cloud provider (Azure App Service, Heroku, etc.)
2. Update your bot's messaging endpoint in Azure to your deployed URL + `/api/messages`

### 5. Install the Teams App

#### For Personal Use

1. In Microsoft Teams, click on the "Apps" icon in the left sidebar
2. Click "Upload a custom app" (you might need to click "..." to see this option)
3. Select your app package zip file
4. Start chatting with your bot

#### For Organization-wide Deployment

1. In Microsoft Teams admin center, go to "Teams apps" > "Manage apps"
2. Click "Upload" and select your app package zip file
3. Configure app permissions and policies as needed
4. Users can now find and install the app from the Teams app store

## Troubleshooting

- **Bot not responding**: Check that your messaging endpoint is correctly configured and accessible
- **Authentication errors**: Verify your BOT_ID and BOT_PASSWORD in the .env file
- **Teams app upload fails**: Ensure your manifest.json follows the correct schema and your icons are the right size

## Additional Resources

- [Microsoft Bot Framework Documentation](https://docs.microsoft.com/en-us/azure/bot-service/)
- [Microsoft Teams App Development](https://docs.microsoft.com/en-us/microsoftteams/platform/overview)
- [Devin API Documentation](https://docs.devin.ai/api-reference/overview)
