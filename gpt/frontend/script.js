const input = document.querySelector("#input");

const chatContainer = document.querySelector("#chat-container");

const askBtn = document.querySelector("#ask");

input.addEventListener("keyup", handleEnter);

askBtn.addEventListener("click", handleAsk);

function generate(text) {
  //append the message to ui
  const message = document.createElement("div");

  message.className = "my-6 bg-neutral-800 p-3 rounded-xl ml-auto max-w-fit";

  message.textContent = text;

  chatContainer.appendChild(message);

  input.value = "";

  //send it to llm
  //append the response to ui
}

function handleAsk(event) {
  if (event.key === "Enter") {
    const text = input.value.trim();
    if (!text) {
      return;
    }
    generate(text);
  }
}
function handleEnter(event) {
  if (event.key === "Enter") {
    const text = input.value.trim();
    if (!text) {
      return;
    }
    generate(text);
  }
}
