# WhatsApp AI Bot — GitHub Actions Edition

> 🎓 **Educational prototype** — runs entirely on GitHub Actions, no VPS or hosting required.

---

## What this does

This project runs a WhatsApp chatbot that:

- Connects to WhatsApp via QR code (like WhatsApp Web)
- Displays the QR code in a beautiful full-screen web UI
- Automatically replies to incoming messages using AI (via [OpenRouter](https://openrouter.ai))
- Runs completely inside **GitHub Actions** — no external server needed

---

## Project Structure

```
whatsapp-ai-bot/
├── index.js              # Bot entry point
├── ai.js                 # OpenRouter AI integration
├── config.js             # API keys and settings ← Edit this
├── qr-server.js          # Web server for QR viewer
├── package.json
├── public/
│   ├── index.html        # QR viewer web page
│   ├── style.css         # Styles
│   └── script.js         # Auto-refresh logic
├── session/              # WhatsApp session data (auto-created)
└── .github/workflows/
    └── main.yml          # GitHub Actions workflow
```

---

## Setup Guide

### Step 1 — Fork or clone this repo

```bash
git clone https://github.com/YOUR_USERNAME/whatsapp-ai-bot.git
cd whatsapp-ai-bot
```

### Step 2 — Add your OpenRouter API key

Open `config.js` and fill in your key:

```js
OPENROUTER_API_KEY: "sk-or-v1-xxxxxxxxxxxxxxxxxxxx",
BASE_URL: "https://openrouter.ai/api/v1",
MODEL: "openai/gpt-oss-120b:free",
```

Get a free API key at: https://openrouter.ai

### Step 3 — Push to GitHub

```bash
git add .
git commit -m "Add API key"
git push
```

> ⚠️ If your repo is public, use a GitHub Secret instead of hardcoding the key.  
> Go to **Settings → Secrets → Actions → New secret**, name it `OPENROUTER_API_KEY`,  
> then reference it in `config.js` as `process.env.OPENROUTER_API_KEY`.

---

## How to run

### 1. Go to your GitHub repo → **Actions** tab

### 2. Select **"Run WhatsApp AI Bot"** workflow

### 3. Click **"Run workflow"** → **"Run workflow"** button

### 4. Watch the logs

In the workflow logs you'll see a public URL like:

```
======================================================
🌐 QR VIEWER URL (open this on your phone/tablet):
   https://xxxx-xxxx.trycloudflare.com
======================================================
```

### 5. Open the QR Viewer URL on your phone or tablet

A large QR code will appear on screen.

### 6. Scan the QR code

1. Open **WhatsApp** on your phone
2. Tap **⋮ (Menu)** → **Linked Devices**
3. Tap **"Link a Device"**
4. Point your camera at the QR code

✅ Done! The bot is now connected and will auto-reply to messages.

---

## How it works internally

```
GitHub Actions Runner
  │
  ├─ npm install
  ├─ Install Chromium (for Puppeteer/WhatsApp Web)
  ├─ Start Cloudflare Tunnel → exposes localhost:3000 publicly
  └─ node index.js
        │
        ├─ whatsapp-web.js initializes WhatsApp Web client
        ├─ QR code generated → saved as public/qr.png
        ├─ Express server serves public/index.html + qr.png
        ├─ User scans QR → WhatsApp authenticates
        └─ On incoming message:
              → getAIReply(message)
              → OpenRouter API call
              → message.reply(aiResponse)
```

---

## ⚠️ Limitations

| Limitation | Details |
|---|---|
| **Max runtime** | GitHub Actions jobs time out at ~6 hours |
| **No persistence** | Bot stops when workflow ends; session may reset |
| **Manual restart** | Must re-run the workflow manually each time |
| **Not for production** | Session storage is temporary; no guarantees |
| **WhatsApp ToS** | Unofficial API — use at your own risk |
| **Free tier limits** | OpenRouter free models have rate limits |

---

## Customization

### Change the AI model
Edit `config.js`:
```js
MODEL: "openai/gpt-4o:free",  // or any OpenRouter model
```

### Change the bot's personality
Edit the `SYSTEM_PROMPT` in `config.js`:
```js
SYSTEM_PROMPT: "You are a sarcastic but helpful assistant.",
```

### Add group message support
In `index.js`, remove the group filter:
```js
// Remove or comment out this line:
if (message.isGroupMsg || message.from === "status@broadcast") return;
```

---

## Local development

```bash
npm install
node index.js
# Open http://localhost:3000 in your browser
```

---

## License

MIT — Educational use only.

---

*Built as a student prototype. Not affiliated with WhatsApp or Meta.*
