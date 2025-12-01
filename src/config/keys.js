// src/config/keys.js
require("dotenv").config();

module.exports = {
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || "",
  OPENAI_MODEL: process.env.OPENAI_MODEL || "gpt-4o-mini",
  EXTERNAL_AI_URL: process.env.EXTERNAL_AI_URL || "",
  SERVER_API_KEY: process.env.SERVER_API_KEY || "changeme_local_key"
};
