import Groq from "groq-sdk";
import dotenv from "dotenv";
dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

async function main() {
  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    temperature: 0,
    messages: [
      {
        role: "system",
        content: `you are a smart assistant that can answer questions.
        you have access to following tools:
        1. webSearch({query}):{query:string} //the search query to perform search on`,
      },
      { role: "user", content: "when is iphone 16 launched" },
    ],
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
                description: "the search query to perform search on",
              },
            },
            required: ["query"],
          },
        },
      },
    ],
    tool_choice: "auto",
  });

  const toolCalls = completion.choices[0].message.tool_calls;
  console.log("Tool Calls:", toolCalls);

  if (!toolCalls) {
    console.log(`Assitant: ${completion.choices[0].message.content}`);
    return;
  }

  for (const tool of toolCalls) {
    console.log(`Tool: ${tool}`);
    const functionName = tool.function.name;
    const functionArgs = tool.function.arguments;

    if (functionName === "webSearch") {
      const toolResult = await webSearch(JSON.parse(functionArgs));
      console.log(`Tool Result: ${toolResult}`);
      return;
    }
  }

  console.log(JSON.stringify(completion.choices[0].message, null, 2));
}

main();

async function webSearch({ query }) {
  //tavily api call
  console.log("calling websearch");

  return "iphone 16 was launched on 20 september 2024";
}
