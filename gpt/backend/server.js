import express from "express";
import cors from "cors";
import { generate } from "./chatbot.js";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to chat DPT!");
});

app.post("/chat", async (req, res) => {
  const { message, threadId } = req.body;

  if (!message || !threadId) {
    res.status(400).json({ error: "All fields are required." });
    return;
  }

  const result = await generate(message, threadId);

  res.json({ message: result });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
