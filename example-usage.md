# Example Usage

## Testing the Summary Bot

### 1. Regular Chat
```bash
curl -X POST http://localhost:3000/api/bot \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What is TypeScript?"
  }'
```

### 2. URL Summary
```bash
curl -X POST http://localhost:3000/api/bot \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Please summarize this: https://www.typescriptlang.org/",
    "bot": "summary"
  }'
```

### 3. Streaming Summary
```bash
curl -X POST http://localhost:3000/api/bot/stream \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Summarize https://github.com/microsoft/TypeScript",
    "bot": "summary"
  }'
```

### 4. Conversation
```bash
curl -X POST http://localhost:3000/api/bot/conversation \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "My favorite color is blue"},
      {"role": "assistant", "content": "That'\''s nice! Blue is a great color."},
      {"role": "user", "content": "What'\''s my favorite color?"}
    ]
  }'
```

## How URL Summary Works

1. **Extract URL**: The bot finds the first URL in your message using regex pattern
2. **Fetch Content**: Makes an HTTP request to fetch the page content
3. **Clean HTML**: Removes script tags, style tags, and HTML markup
4. **Summarize**: Sends cleaned content to AI model with summary prompt
5. **Return**: Sends back the AI-generated summary

## Notes

- Content is limited to 10,000 characters to avoid token limits
- Only the first URL in the message is processed
- Both regular and streaming endpoints support summary mode
- If no URL is found when bot="summary", an error is returned
