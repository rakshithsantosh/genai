import { ChatGroq } from "@langchain/groq";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { TavilySearch } from "@langchain/tavily";
import { z } from "zod";
import { tool } from "@langchain/core/tools";

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

  const calendarEvents = tool(
    async ({ query }) => {
      return JSON.stringify([
        {
          title: "Meeting with Bob",
          date: "2023-06-01",
          app: "gmeet",
        },
      ]);
    },
    {
      name: "get-calendar-events",
      description: "call to get information about your calendar events.",
      schema: z.object({
        query: z
          .string()
          .describe("The query to use in your calender event search."),
      }),
    }
  );

  const agent = createReactAgent({
    llm: model,
    tools: [search, calendarEvents],
  });

  const result = await agent.invoke({
    messages: [
      {
        role: "user",
        content: "do i have any meeting?",
      },
    ],
  });

  console.log(result.messages[result.messages.length - 1].content);
}

main();
