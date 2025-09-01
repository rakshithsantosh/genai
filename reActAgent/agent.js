import { ChatGroq } from "@langchain/groq";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { TavilySearch } from "@langchain/tavily";

import dotenv from "dotenv";
dotenv.config();

async function main() {
  const model = new ChatGroq({
    model: "openai/gpt-oss-120b",
    temperature: 0, //as its for tool calling use 0 temperature
  });

  const search = new TavilySearch({
    maxResults: 3,
    topic: "general",
  });

  const agent = createReactAgent({
    llm: model,
    tools: [search],
  });

  const result = await agent.invoke({
    messages: [
      {
        role: "user",
        content: "What is today's news on AI?",
      },
    ],
  });

  console.log(result.messages[result.messages.length - 1].content);
}

main();
