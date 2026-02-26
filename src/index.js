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
    const messages = [
      {
        role: "user",
        content: `Suggest some gifts for someone who loves hiphop music.`,
      },
    ];
    // system prompts are instructions for the model to generate responses that actually matter instead of user instructing these every time.
    messages.push({
      role: "system",
      content: `Make these suggestions thoughtful and practical. Your response must be under 100 words. 
Skip intros and conclusions. Only output gift suggestions.`
    })

    const firstResponse = await openai.chat.completions.create({
      model: process.env.AI_MODEL,
      messages,
      max_completion_tokens: 256, // explicitly setting 256 tokens
      reasoning_effort: "minimal", // this limits the reasoning token to 0 ( minimal )
    });
    
    console.log("response", JSON.stringify(firstResponse));
    outputEl.textContent = firstResponse.choices[0].message.content;

    const firstAssistantMessage = firstResponse.choices[0].message;
    messages.push(firstAssistantMessage);

    messages.push({
      role: "user",
      content: "More budget friendly. Less than $40.",
    });
    // Send second chat completions request with extended messages array
    const secondResponse = await openai.chat.completions.create({
      model: process.env.AI_MODEL,
      messages,
    });

    console.log("Budget friendly suggestions:");
    console.log(secondResponse.choices[0].message.content);

    outputEl.textContent = `${outputEl.textContent}  \n Budget Option under 40$ \n ${secondResponse.choices[0].message.content}`;
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
