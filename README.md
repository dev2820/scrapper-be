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
- Test chat endpoint
- Test streaming chat endpoint
- Test conversation endpoint

Make sure the server is running (`pnpm dev` in another terminal) before running tests.

## API Endpoints

### Health Check
```
GET /health
```
Returns server status.

### Chat (Single Message)
```
POST /api/chat
Content-Type: application/json

{
  "message": "Your message here",
  "model": "gpt-4o-mini" // optional
}
```

### Chat (Streaming)
```
POST /api/chat/stream
Content-Type: application/json

{
  "message": "Your message here",
  "model": "gpt-4o-mini" // optional
}
```
Returns server-sent events (SSE) stream.

### Chat (Conversation)
```
POST /api/chat/conversation
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
