// ============================================================
// qr-server.js — Simple Express server for QR web viewer
// ============================================================

const express = require("express");
const path = require("path");
const fs = require("fs");
const config = require("./config");

const app = express();
const PORT = config.QR_SERVER_PORT || 3000;

// ── Serve static files from /public ─────────────────────────
app.use(express.static(path.join(__dirname, "public")));

// ── Endpoint: check if QR image exists ──────────────────────
app.get("/qr-status", (req, res) => {
  const qrExists = fs.existsSync(path.join(__dirname, "public", "qr.png"));
  res.json({ available: qrExists });
});

// ── Root → serve QR viewer page ─────────────────────────────
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ── Start server ─────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🌐 QR Web Server running at: http://localhost:${PORT}`);
  console.log(`   Open this URL in your browser to scan the QR code.\n`);
});

module.exports = app;
