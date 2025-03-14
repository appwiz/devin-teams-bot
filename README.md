# Devin Teams Bot

A Microsoft Teams chat bot that integrates with the Devin API to enable users to interact with Devin through Teams messages.

## Features

- Receive messages from Microsoft Teams
- Process user requests using the Devin API
- Send responses back to Teams chat
- Maintain conversation context using Devin sessions

## Architecture

The bot follows a modular architecture:

- **Bot Registration**: Azure Bot Service registration for Teams integration
- **Webhook Endpoints**: Express.js server to receive messages from Teams
- **Devin API Client**: Service to interact with Devin API
- **Session Management**: Maintain user sessions with Devin
- **Message Handling**: Process incoming messages and format responses

## Setup

1. Register a bot in Azure Bot Service
2. Configure environment variables
3. Install dependencies
4. Start the server

## Environment Variables

```
# Bot Framework
BOT_ID=
BOT_PASSWORD=

# Devin API
DEVIN_API_KEY=

# Server
PORT=3978
```

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## Deployment

```bash
# Start production server
npm start
```

## License

MIT
