import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import metascraper from "metascraper";
import metascraperAuthor from "metascraper-author";
import metascraperDate from "metascraper-date";
import metascraperDescription from "metascraper-description";
import metascraperImage from "metascraper-image";
import metascraperLogo from "metascraper-logo";
import metascraperPublisher from "metascraper-publisher";
import metascraperTitle from "metascraper-title";
import metascraperUrl from "metascraper-url";

const scraper = metascraper([
  metascraperAuthor(),
  metascraperDate(),
  metascraperDescription(),
  metascraperImage(),
  metascraperLogo(),
  metascraperPublisher(),
  metascraperTitle(),
  metascraperUrl(),
]);

interface OpenGraphQuerystring {
  url: string;
}

interface OpenGraphResponse {
  url?: string;
  title?: string;
  description?: string;
  siteName?: string;
  image?: string;
  favicon?: string;
  author?: string;
  date?: string;
  publisher?: string;
  logo?: string;
}

export default async function openGraphRoutes(fastify: FastifyInstance) {
  fastify.get<{ Querystring: OpenGraphQuerystring; Reply: OpenGraphResponse }>(
    "/og",
    async (
      request: FastifyRequest<{ Querystring: OpenGraphQuerystring }>,
      reply: FastifyReply,
    ): Promise<OpenGraphResponse> => {
      const { url } = request.query;

      if (!url) {
        return reply.code(400).send({ error: "URL is required" });
      }

      try {
        const response = await fetch(url);
        if (!response.ok) {
          return reply.code(400).send({ error: "Failed to fetch URL" });
        }

        const html = await response.text();
        const metadata = await scraper({ html, url });

        return metadata;
      } catch (error) {
        fastify.log.error(error);
        return reply.code(500).send({
          error: "Failed to scrape metadata",
          details: error instanceof Error ? error.message : "Unknown error",
        });
      }
    },
  );
}
