# Fastify AI API Server

A TypeScript-based API server built with Fastify and AI SDK for OpenAI integration.

## Setup

1. Install dependencies:
```bash
pnpm install
```

2. Configure environment variables in `.env.local`:
```
PORT=3000
OPENAI_API_KEY=your_openai_api_key_here
```

## Development

Run the development server with hot reload:
```bash
pnpm dev
```

## Build

Compile TypeScript to JavaScript:
```bash
pnpm build
```

## Production

Run the production server:
```bash
pnpm start
```

## Testing

Run the test suite to verify all endpoints:
```bash
pnpm test
```

The test suite will:
- Check server health
- Test bot endpoint
- Test bot with URL summary
- Test streaming bot endpoint
- Test streaming bot with URL summary
- Test conversation endpoint

Make sure the server is running (`pnpm dev` in another terminal) before running tests.

## API Endpoints

### Health Check
```
GET /health
```
Returns server status.

### Bot (Single Message)
```
POST /api/bot
Content-Type: application/json

{
  "message": "Your message here"
}
```

### Bot with URL Summary
```
POST /api/bot
Content-Type: application/json

{
  "message": "Summarize this article: https://example.com/article",
  "bot": "summary"
}
```
Extracts the first URL from the message, fetches its content, and generates an AI summary.

### Bot (Streaming)
```
POST /api/bot/stream
Content-Type: application/json

{
  "message": "Your message here"
}
```
Returns server-sent events (SSE) stream.

### Bot Streaming with URL Summary
```
POST /api/bot/stream
Content-Type: application/json

{
  "message": "Summarize https://example.com",
  "bot": "summary"
}
```
Streams the summary of the URL content.

### Conversation (Multi-turn)
```
POST /api/bot/conversation
Content-Type: application/json

{
  "messages": [
    { "role": "user", "content": "Hello" },
    { "role": "assistant", "content": "Hi there!" },
    { "role": "user", "content": "How are you?" }
  ]
}
```

## Tech Stack

- **Fastify** - Fast and low overhead web framework
- **TypeScript** - Type-safe JavaScript
- **AI SDK** - Vercel AI SDK for OpenAI integration
- **tsx** - TypeScript execution and development
