const input = document.querySelector("#input");

const chatContainer = document.querySelector("#chat-container");

const askBtn = document.querySelector("#ask");

const threadId =
  Date.now().toString(36) + Math.random().toString(36).substring(2, 8);

input.addEventListener("keyup", handleEnter);

askBtn.addEventListener("click", handleAsk);

const loading = document.createElement("div");
loading.className = "my-6 animate-pulse";
loading.textContent = "Thinking...";

async function generate(text) {
  //append the message to ui
  const message = document.createElement("div");

  message.className = "my-6 bg-neutral-800 p-3 rounded-xl ml-auto max-w-fit";

  message.textContent = text;

  chatContainer.appendChild(message);

  input.value = "";

  //append the loading message to ui
  chatContainer.appendChild(loading);

  //send it to llm

  const assistantMessage = await callServer(text);

  console.log("assistantMessgae: ", assistantMessage);

  //append the response to ui

  const assistantmessageelement = document.createElement("div");

  assistantmessageelement.className = "max-w-fit";

  assistantmessageelement.textContent = assistantMessage;

  //remove the loading message
  chatContainer.removeChild(loading);

  chatContainer.appendChild(assistantmessageelement);
}

async function callServer(inputText) {
  const response = await fetch("http://localhost:3001/chat", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({ threadId: threadId, message: inputText }),
  });

  if (!response.ok) {
    throw new Error("Error generating the response ");
  }

  const result = await response.json();

  return result.message;
}

async function handleAsk(event) {
  if (event.key === "Enter") {
    const text = input.value.trim();
    if (!text) {
      return;
    }
    await generate(text);
  }
}
async function handleEnter(event) {
  if (event.key === "Enter") {
    const text = input.value.trim();
    if (!text) {
      return;
    }
    await generate(text);
  }
}
