import Groq from "groq-sdk";
import { tavily } from "@tavily/core";
import dotenv from "dotenv";
dotenv.config();

const tvly = tavily({
  apiKey: process.env.TAVILY_API_KEY,
});

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

async function main() {
  const messages = [
    {
      role: "system",
      content: `you are a smart assistant that can answer questions.
        you have access to following tools:
        1. webSearch({query}):{query:string} //the search query to perform search on`,
    },
    { role: "user", content: "when is iphone 16 launched" },
  ];

  while (true) {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0,
      messages: messages,
      tools: [
        {
          type: "function",
          function: {
            name: "webSearch",
            description: "searches the web for the given query",
            parameters: {
              type: "object",
              properties: {
                query: {
                  type: "string",
                  description: "when is iphone 16 launched",
                },
              },
              required: ["query"],
            },
          },
        },
      ],
      tool_choice: "auto",
    });

    messages.push(completion.choices[0].message);

    const toolCalls = completion.choices[0].message.tool_calls;
    //console.log("Tool Calls:", toolCalls);

    if (!toolCalls) {
      console.log(`Assitant: ${completion.choices[0].message.content}`);
      break;
    }

    for (const tool of toolCalls) {
      //console.log(`Tool: ${tool}`);
      const functionName = tool.function.name;
      const functionArgs = tool.function.arguments;

      if (functionName === "webSearch") {
        const toolResult = await webSearch(JSON.parse(functionArgs));

        messages.push({
          tool_call_id: tool.id,
          role: "tool",
          name: "webSearch",
          content: toolResult,
        });

        //console.log(`Tool Result: ${toolResult}`);
        return;
      }
    }

    console.log(JSON.stringify(completion.choices[0].message, null, 2));
  }
}

main();

async function webSearch({ query }) {
  //tavily api call
  console.log("calling websearch");

  const response = await tvly.search(query, { maxResults: 1 });

  const finalResult = response.results
    .map((result) => result.content)
    .join("\n\n");

  return finalResult;
}
