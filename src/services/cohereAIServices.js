import { CohereClient } from "cohere-ai";

const cohere = new CohereClient({
  token: "uqYPkxiim255V4enDhw58Fq7emFdPXzBGrXc2BL7", // This is your trial API key
});

export default async (message) => {
        const stream = await cohere.chatStream({
          model: "command-r-08-2024",
          message,
          temperature: 0.3,
          chatHistory: [],
          promptTruncation: "AUTO",
          connectors: [{"id":"web-search"}]
        });
        
        return stream;
    }
