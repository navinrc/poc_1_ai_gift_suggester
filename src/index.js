import OpenAI from "openai";
import { checkEnvironment } from "./utils.js";

const openai = new OpenAI({
  apiKey: process.env.AI_KEY,
  baseURL: process.env.AI_URL,
  dangerouslyAllowBrowser: true,
});

checkEnvironment();

const outputEl = document.getElementById("output");
const buttonEl = document.getElementById("giftBtn");

const invoke = async () => {
  const prompt = "Suggest some gifts for my birthday to myself. I am a huge office fan. especially Michael scott and dwight schrute";

  outputEl.textContent = "Thinking...";

  try {
    const response = await openai.chat.completions.create({
      model: process.env.AI_MODEL,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });
    console.log("response", JSON.stringify(response))
    outputEl.textContent =
      response.choices[0].message.content;
  } catch (error) {
    if (error.status === 401 || error.status === 403) {
      outputEl.textContent =
        "Authentication error: Check your AI_KEY.";
    } else if (error.status >= 500) {
      outputEl.textContent =
        "AI provider error. Try again shortly.";
    } else {
      outputEl.textContent =
        error.message || "Unexpected error";
    }
  }
};

buttonEl.addEventListener("click", invoke);
