// ============================================================
// index.js — Main WhatsApp AI Bot entry point
// ============================================================

const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode");
const fs = require("fs");
const path = require("path");
const config = require("./config");
const { getAIReply } = require("./ai");

// ── Ensure public/ directory exists ─────────────────────────
const publicDir = path.resolve("./public");
if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });

// ── Ensure session/ directory exists ────────────────────────
const sessionDir = path.resolve(config.SESSION_DIR);
if (!fs.existsSync(sessionDir)) fs.mkdirSync(sessionDir, { recursive: true });

// ── Start QR web server ──────────────────────────────────────
// (Runs alongside the bot so users can view QR in browser)
require("./qr-server");

// ── WhatsApp Client Setup ────────────────────────────────────
const client = new Client({
  authStrategy: new LocalAuth({
    dataPath: config.SESSION_DIR,
  }),
  puppeteer: {
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
      "--no-first-run",
      "--no-zygote",
      "--single-process",
    ],
  },
});

// ── QR Code Event ────────────────────────────────────────────
client.on("qr", async (qr) => {
  console.log("\n📱 QR Code received — saving to public/qr.png ...\n");

  // Save QR as PNG image (for web UI)
  try {
    await qrcode.toFile(config.QR_IMAGE_PATH, qr, {
      width: 400,
      margin: 2,
      color: { dark: "#000000", light: "#ffffff" },
    });
    console.log("✅ QR image saved → public/qr.png");
    console.log("🌐 Open the QR web UI in your browser to scan.");
  } catch (err) {
    console.error("❌ Failed to save QR image:", err.message);
  }

  // Also print QR in terminal as fallback
  try {
    const qrcodeTerminal = require("qrcode-terminal");
    qrcodeTerminal.generate(qr, { small: true });
    console.log("\n⬆️  Scan the QR above in WhatsApp → Linked Devices\n");
  } catch (_) {
    console.log("(Install qrcode-terminal for terminal QR display)");
  }
});

// ── Ready Event ──────────────────────────────────────────────
client.on("ready", () => {
  console.log("\n✅ WhatsApp bot is ready and connected!\n");

  // Remove the QR image once logged in (no longer needed)
  if (fs.existsSync(config.QR_IMAGE_PATH)) {
    fs.unlinkSync(config.QR_IMAGE_PATH);
    console.log("🗑️  QR image removed (session active).");
  }
});

// ── Incoming Message Handler ─────────────────────────────────
client.on("message", async (message) => {
  // Ignore group messages and status broadcasts
  if (message.isGroupMsg || message.from === "status@broadcast") return;

  const userText = message.body?.trim();
  if (!userText) return;

  console.log(`\n📩 Message from ${message.from}: "${userText}"`);

  try {
    // Get AI response
    const aiReply = await getAIReply(userText);
    console.log(`🤖 AI reply: "${aiReply}"`);

    // Send reply back to user
    await message.reply(aiReply);
    console.log("✅ Reply sent.");
  } catch (err) {
    console.error("❌ Error handling message:", err.message);
  }
});

// ── Authentication Failure ───────────────────────────────────
client.on("auth_failure", (msg) => {
  console.error("❌ Authentication failed:", msg);
});

// ── Disconnected ─────────────────────────────────────────────
client.on("disconnected", (reason) => {
  console.warn("⚠️  WhatsApp disconnected:", reason);
});

// ── Initialize Client ────────────────────────────────────────
console.log("🚀 Starting WhatsApp AI Bot...");
console.log("🌐 QR Viewer will be available at: http://localhost:3000\n");
client.initialize();
