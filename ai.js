// ============================================================
// ai.js — OpenRouter AI integration module
// ============================================================

const config = require("./config");

/**
 * Sends a user message to the AI and returns the response text.
 * @param {string} userMessage - The message received from WhatsApp
 * @returns {Promise<string>} - AI reply text
 */
async function getAIReply(userMessage) {
  try {
    const response = await fetch(`${config.BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.OPENROUTER_API_KEY}`,
        "HTTP-Referer": "https://github.com/whatsapp-ai-bot",
        "X-Title": "WhatsApp AI Bot",
      },
      body: JSON.stringify({
        model: config.MODEL,
        messages: [
          { role: "system", content: config.SYSTEM_PROMPT },
          { role: "user", content: userMessage },
        ],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("❌ AI API error:", errText);
      return "Sorry, I couldn't process your message right now.";
    }

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content?.trim();

    if (!reply) {
      return "I received your message but couldn't generate a response.";
    }

    return reply;
  } catch (error) {
    console.error("❌ AI request failed:", error.message);
    return "An error occurred while contacting the AI. Please try again later.";
  }
}

module.exports = { getAIReply };
