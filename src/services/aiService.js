// src/services/aiService.js
const axios = require("axios");
const { OPENAI_API_KEY, OPENAI_MODEL, EXTERNAL_AI_URL } = require("../config/keys");

/**
 * askAI({ message, context, options })
 * - message: string (user prompt)
 * - context: optional array or string for prior messages or system prompt
 * - options: optional object for model overrides
 *
 * Returns: { reply: string, raw: object }
 */
async function askOpenAI({ message, context, options }) {
  // Build messages array — include system prompt if provided via context
  const messages = [];

  if (context) {
    if (Array.isArray(context)) {
      messages.push(...context);
    } else if (typeof context === "string") {
      messages.push({ role: "system", content: context });
    }
  }

  messages.push({ role: "user", content: message });

  const model = options?.model || OPENAI_MODEL || "gpt-4o-mini";

  const payload = {
    model,
    messages
  };

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${OPENAI_API_KEY}`
  };

  const res = await axios.post("https://api.openai.com/v1/chat/completions", payload, { headers });
  // Safely read the content
  const content = res.data?.choices?.[0]?.message?.content;
  return { reply: content, raw: res.data };
}

async function askExternalAI({ message }) {
  // Very simple fallback: if EXTERNAL_AI_URL expects a query param or JSON, adapt here.
  // If EXTERNAL_AI_URL contains '<PROMPT>' we'll replace it, else we POST JSON { prompt: message }.
  const url = EXTERNAL_AI_URL;
  if (!url) throw new Error("No EXTERNAL_AI_URL configured");

  try {
    if (url.includes("<PROMPT>")) {
      const finalUrl = url.replace("<PROMPT>", encodeURIComponent(message));
      const res = await axios.get(finalUrl);
      // Assume the external API returns something like { answer: "..." } or text
      const reply = res.data?.answer ?? res.data?.reply ?? (typeof res.data === "string" ? res.data : null);
      return { reply, raw: res.data };
    } else {
      // POST JSON { prompt: message }
      const res = await axios.post(url, { prompt: message }, { headers: { "Content-Type": "application/json" } });
      const reply = res.data?.answer ?? res.data?.reply ?? (typeof res.data === "string" ? res.data : null);
      return { reply, raw: res.data };
    }
  } catch (err) {
    throw new Error("External AI request failed: " + err.message);
  }
}

async function askAI({ message, context = null, options = {} }) {
  if (OPENAI_API_KEY) {
    // prefer OpenAI when key is present
    return askOpenAI({ message, context, options });
  } else if (EXTERNAL_AI_URL) {
    return askExternalAI({ message, context, options });
  } else {
    throw new Error("No AI provider configured. Set OPENAI_API_KEY or EXTERNAL_AI_URL in .env");
  }
}

module.exports = { askAI };
