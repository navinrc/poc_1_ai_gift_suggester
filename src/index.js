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
  outputEl.textContent = "Thinking...";

  try {
    const response = await openai.chat.completions.create({
      model: process.env.AI_MODEL,
      messages: [
        {
          role: "user",
          content: `Suggest some gifts for someone who loves hiphop music. 
Make these suggestions thoughtful and practical. Your response must be under 100 words. 
Skip intros and conclusions. Only output gift suggestions.`, // crisp prompt
        },
      ],
      max_completion_tokens: 256, // explicitly setting 256 tokens
      reasoning_effort: "minimal", // this limits the reasoning token to 0 ( minimal )
    });
    console.log("response", JSON.stringify(response));
    outputEl.textContent = response.choices[0].message.content;
  } catch (error) {
    if (error.status === 401 || error.status === 403) {
      outputEl.textContent = "Authentication error: Check your AI_KEY.";
    } else if (error.status >= 500) {
      outputEl.textContent = "AI provider error. Try again shortly.";
    } else {
      outputEl.textContent = error.message || "Unexpected error";
    }
  }
};

buttonEl.addEventListener("click", invoke);
