import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { openai } from "@ai-sdk/openai";
import { generateText, streamText } from "ai";

interface botRequest {
  message: string;
  bot?: "summary";
}

function extractFirstUrl(text: string): string | null {
  const urlRegex = /(https?:\/\/[^\s]+)/gi;
  const match = text.match(urlRegex);
  return match ? match[0] : null;
}

async function fetchUrlContent(url: string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch URL: ${response.statusText}`);
  }
  const html = await response.text();

  // Simple HTML tag removal for better text extraction
  const text = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  // Limit content length to avoid token limits
  return text.substring(0, 10000);
}

export async function aiRoutes(fastify: FastifyInstance) {
  fastify.post<{ Body: botRequest }>(
    "/bot",
    async (
      request: FastifyRequest<{ Body: botRequest }>,
      reply: FastifyReply,
    ) => {
      const { message, bot } = request.body;
      const model = "gpt-4o-mini";

      if (!message) {
        return reply.code(400).send({ error: "Message is required" });
      }

      try {
        let contentToProcess = message;

        // Handle summary bot
        if (bot === "summary") {
          const url = extractFirstUrl(message);

          if (!url) {
            return reply.code(400).send({
              error: "No URL found in message for summary"
            });
          }

          try {
            const urlContent = await fetchUrlContent(url);
            contentToProcess = `Please summarize the following content from ${url}:\n\n${urlContent}`;
          } catch (error) {
            return reply.code(500).send({
              error: "Failed to fetch URL content",
              details: error instanceof Error ? error.message : "Unknown error",
            });
          }
        }

        const { text } = await generateText({
          model: openai(model),
          messages: [
            {
              role: "user",
              content: contentToProcess,
            },
          ],
        });

        return { response: text };
      } catch (error) {
        fastify.log.error(error);
        return reply.code(500).send({
          error: "Failed to generate response",
          details: error instanceof Error ? error.message : "Unknown error",
        });
      }
    },
  );

  fastify.post<{ Body: botRequest }>(
    "/bot/stream",
    async (
      request: FastifyRequest<{ Body: botRequest }>,
      reply: FastifyReply,
    ) => {
      const { message, bot } = request.body;
      const model = "gpt-4o-mini";

      if (!message) {
        return reply.code(400).send({ error: "Message is required" });
      }

      try {
        let contentToProcess = message;

        // Handle summary bot
        if (bot === "summary") {
          const url = extractFirstUrl(message);

          if (!url) {
            return reply.code(400).send({
              error: "No URL found in message for summary"
            });
          }

          try {
            const urlContent = await fetchUrlContent(url);
            contentToProcess = `Please summarize the following content from ${url}:\n\n${urlContent}`;
          } catch (error) {
            return reply.code(500).send({
              error: "Failed to fetch URL content",
              details: error instanceof Error ? error.message : "Unknown error",
            });
          }
        }

        const result = streamText({
          model: openai(model),
          messages: [
            {
              role: "user",
              content: contentToProcess,
            },
          ],
        });

        reply.header("Content-Type", "text/event-stream");
        reply.header("Cache-Control", "no-cache");
        reply.header("Connection", "keep-alive");

        for await (const chunk of result.textStream) {
          reply.raw.write(`data: ${JSON.stringify({ text: chunk })}\n\n`);
        }

        reply.raw.end();
      } catch (error) {
        fastify.log.error(error);
        return reply.code(500).send({
          error: "Failed to stream response",
          details: error instanceof Error ? error.message : "Unknown error",
        });
      }
    },
  );

  fastify.post<{
    Body: { messages: Array<{ role: string; content: string }> };
  }>("/bot/conversation", async (request, reply) => {
    const { messages } = request.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return reply.code(400).send({ error: "Messages array is required" });
    }

    try {
      const { text } = await generateText({
        model: openai("gpt-4o-mini"),
        messages: messages.map((msg) => ({
          role: msg.role as "user" | "assistant" | "system",
          content: msg.content,
        })),
      });

      return { response: text };
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({
        error: "Failed to generate response",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });
}
