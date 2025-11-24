import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { openai } from "@ai-sdk/openai";
import { generateText, streamText } from "ai";

interface botRequest {
  message: string;
}

export async function aiRoutes(fastify: FastifyInstance) {
  fastify.post<{ Body: botRequest }>(
    "/bot",
    async (
      request: FastifyRequest<{ Body: botRequest }>,
      reply: FastifyReply,
    ) => {
      const { message } = request.body;
      const model = "gpt-4o-mini";

      if (!message) {
        return reply.code(400).send({ error: "Message is required" });
      }

      try {
        const { text } = await generateText({
          model: openai(model),
          messages: [
            {
              role: "user",
              content: message,
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
      const { message } = request.body;
      const model = "gpt-4o-mini";
      if (!message) {
        return reply.code(400).send({ error: "Message is required" });
      }

      try {
        const result = streamText({
          model: openai(model),
          messages: [
            {
              role: "user",
              content: message,
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
