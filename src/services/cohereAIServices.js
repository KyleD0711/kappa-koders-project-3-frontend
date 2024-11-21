import { CohereClient } from "cohere-ai";

const cohere = new CohereClient({
  token: "uqYPkxiim255V4enDhw58Fq7emFdPXzBGrXc2BL7", // This is your trial API key
});

const chatConstraint = {
  role: "User",
  message: 
  `This conversation pertains to a resume. 
  If off-topic questions are asked, politely decline to answer, 
  and redirect the conversation back to the resume.`
}

export default async (message, history) => {


  const stream = await cohere.chatStream({
    model: "command-r-08-2024",
    preamble: "You are Ike, an AI Chat model trained exclusively to provide concise and constructive feedback on resumes.",
    message,
    temperature: 0.3,
    chatHistory: [
      chatConstraint,
      ...history
    ],
    promptTruncation: "AUTO",
    connectors: [{"id":"web-search"}]
  });

  return stream;
}
