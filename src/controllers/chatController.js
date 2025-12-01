// src/controllers/chatController.js
const { askAI } = require("../services/aiService");
const { SERVER_API_KEY } = require("../config/keys");

exports.chatController = async (req, res) => {
  try {
    // Basic API key check (send header 'x-api-key')
    const clientKey = req.headers["x-api-key"] || req.headers["authorization"];
    if (!clientKey || clientKey !== SERVER_API_KEY) {
      return res.status(401).json({ error: "Unauthorized - missing or invalid API key" });
    }

    const { message, context, options } = req.body || {};

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return res.status(400).json({ error: "Invalid request - 'message' is required" });
    }

    // Build prompt/messages object as needed
    const resp = await askAI({ message, context, options });

    // Normalize reply
    const reply = resp?.reply ?? resp?.text ?? null;

    if (!reply) {
      return res.status(502).json({ error: "No reply from AI backend" });
    }

    return res.json({ reply, raw: resp.raw ?? null });
  } catch (err) {
    console.error("chatController error:", err);
    return res.status(500).json({ error: "Server error", details: err.message });
  }
};
