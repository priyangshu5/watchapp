// ============================================================
// script.js — QR Viewer auto-refresh and UI logic
// ============================================================

(function () {
  const qrImg = document.getElementById("qrImage");
  const qrPlaceholder = document.getElementById("qrPlaceholder");
  const statusText = document.getElementById("statusText");
  const statusPill = document.getElementById("statusPill");
  const fullscreenBtn = document.getElementById("fullscreenBtn");

  let qrAvailable = false;
  const REFRESH_INTERVAL_MS = 5000; // 5 seconds

  // ── Load QR image with cache-busting ──────────────────────
  function loadQR() {
    const url = `qr.png?t=${Date.now()}`;
    const img = new Image();

    img.onload = () => {
      // QR loaded successfully
      qrImg.src = url;
      qrImg.classList.remove("hidden");
      qrPlaceholder.style.display = "none";

      if (!qrAvailable) {
        qrAvailable = true;
        updateStatus("Scan with WhatsApp", false);
      }
    };

    img.onerror = () => {
      // QR not available yet
      qrImg.classList.add("hidden");
      qrPlaceholder.style.display = "flex";

      if (qrAvailable) {
        // Was available before → session likely connected
        qrAvailable = false;
        updateStatus("Bot Connected ✓", true);
      } else {
        updateStatus("Waiting for QR...", false);
      }
    };

    img.src = url;
  }

  // ── Update status pill text and style ─────────────────────
  function updateStatus(text, connected) {
    statusText.textContent = text;
    if (connected) {
      statusPill.classList.add("connected");
    } else {
      statusPill.classList.remove("connected");
    }
  }

  // ── Fullscreen toggle ──────────────────────────────────────
  fullscreenBtn.addEventListener("click", () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  });

  // ── Auto-refresh loop ──────────────────────────────────────
  loadQR(); // Initial load
  setInterval(loadQR, REFRESH_INTERVAL_MS);
})();
