// ============================================================
// config.js — Central configuration file
// ⚠️ Replace placeholders before running
// ============================================================

const config = {
  // ── OpenRouter API ──────────────────────────────────────────
  OPENROUTER_API_KEY: "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",
  BASE_URL: "https://openrouter.ai/api/v1",
  MODEL: "openai/gpt-oss-120b:free",

  // ── AI Persona ──────────────────────────────────────────────
  SYSTEM_PROMPT: "You are a helpful, friendly WhatsApp assistant. Keep replies concise and natural.",

  // ── QR Server ───────────────────────────────────────────────
  QR_SERVER_PORT: 3000,

  // ── WhatsApp session directory ───────────────────────────────
  SESSION_DIR: "./session",

  // ── QR image output path ─────────────────────────────────────
  QR_IMAGE_PATH: "./public/qr.png",
};

module.exports = config;
