# 💌 Will You Be My Valentine?

A cinematic, single-page Valentine's Day website with twinkling starfield, romantic message reveals, a playful proposal interaction, and a celebration finale.

**Pure HTML/CSS/JS** — no frameworks, no backend, no build step. Open `index.html` and it just works.

---

## ✨ Features

- **Starfield Intro** — 500 twinkling stars with sequentially fading romantic messages
- **Proposal Screen** — "Will you be my Valentine?" where clicking No makes Yes grow hilariously larger
- **Celebration Screen** — GIF, heartfelt message, floating hearts, and optional background audio
- **Fully Responsive** — centered card on desktop, full-width on mobile
- **One Config Object** — customize everything (names, messages, images, audio) in one place
- **Dark Starry Theme** — consistent cinematic ambiance across all screens
- **Smooth Transitions** — CSS fade transitions between screens
- **No Global Variables** — all JS lives inside a single IIFE

---

## 📁 Project Structure

```
will-you-be-my-valentine/
├── index.html          ← Entry point (open this in your browser)
├── styles.css          ← All styling
├── script.js           ← All logic + CONFIG object at the top
├── PLAN.md             ← Implementation plan and architecture
├── README.md           ← This file
└── assets/
    ├── celebration.gif ← Replace with your GIF
    └── music.mp3       ← Replace with your audio
```

---

## 🎯 How to Use

### 1. Replace Placeholder Assets

| File | What to do |
|---|---|
| `assets/celebration.gif` | Replace with a cute/romantic GIF (e.g., from [Tenor](https://tenor.com) or [GIPHY](https://giphy.com)). Rename your file to `celebration.gif` or update the path in CONFIG. |
| `assets/music.mp3` | Replace with a romantic MP3 track. Or set `CONFIG.audio.enabled = false` to disable audio entirely. |

> **Note:** The `*.txt` placeholder files exist only to document what goes there. Delete them and add the real assets.

### 2. Customize the CONFIG

Open `script.js` and edit the `CONFIG` object at the very top (lines 33–93):

| What to change | Where in CONFIG |
|---|---|
| Partner's name | `CONFIG.partnerName` |
| Romantic intro messages | `CONFIG.messages[]` — add, remove, or edit |
| Final persistent lines | `CONFIG.finalLines[]` — use `{name}` for the partner's name |
| Continue button text | `CONFIG.continueButtonText` |
| Proposal question | `CONFIG.proposal.question` |
| Yes / No button text | `CONFIG.proposal.yesText` / `.noText` |
| Sassy "no" responses | `CONFIG.proposal.noMessages[]` |
| Yes button growth per click | `CONFIG.proposal.noGrowthPx` (default: 12px) |
| Celebration GIF path | `CONFIG.celebration.gifPath` |
| Celebration message | `CONFIG.celebration.message` |
| Sub-message | `CONFIG.celebration.subMessage` |
| Audio file path | `CONFIG.audio.src` |
| Enable/disable audio | `CONFIG.audio.enabled` (true/false) |
| Number of stars | `CONFIG.starfield.starCount` |
| Star colors (HSL hues) | `CONFIG.starfield.colorHues` |
| Message fade speed | `CONFIG.starfield.frameDuration` (higher = slower) |

### 3. Open in Browser

Just double-click `index.html` — no server needed.

---

## 🚀 GitHub Pages Deployment

1. Create a new GitHub repository (e.g., `will-you-be-my-valentine`)
2. Push the contents of this folder:
   ```bash
   cd will-you-be-my-valentine
   git init
   git add .
   git commit -m "💌 Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/will-you-be-my-valentine.git
   git push -u origin main
   ```
3. Go to your repo → **Settings** → **Pages**
4. Under **Source**, select **Deploy from a branch**
5. Branch: `main`, Folder: `/ (root)`
6. Click **Save**
7. Your site will be live at: `https://YOUR_USERNAME.github.io/will-you-be-my-valentine/`

---

## 🧪 Testing Checklist

- [ ] `index.html` opens directly in browser (no server needed)
- [ ] Starfield renders with twinkling stars
- [ ] Messages fade in and out sequentially
- [ ] "Continue 💌" button appears after final message
- [ ] Smooth fade transition to proposal screen
- [ ] Proposal question and buttons display correctly
- [ ] Clicking "No" grows the "Yes" button each time
- [ ] Question text cycles through sassy messages on No
- [ ] Clicking "Yes" transitions to celebration screen
- [ ] Celebration GIF displays
- [ ] Celebration message and sub-message display
- [ ] Audio plays (if enabled and file present)
- [ ] Floating hearts animate and clean themselves up
- [ ] Responsive on mobile (≤ 600px) — full-width cards
- [ ] Responsive on desktop — centered card layout
- [ ] No console errors
- [ ] CONFIG changes reflect immediately without code changes

---

## 🛠 Technical Notes

- **Font**: [Poppins](https://fonts.google.com/specimen/Poppins) loaded via Google Fonts CDN. Canvas text waits for `document.fonts.ready` before rendering.
- **Screen transitions**: CSS `opacity` + `visibility` transitions, managed by `ScreenManager.transitionTo()`.
- **Starfield**: HTML5 Canvas with `requestAnimationFrame`. Message timing is data-driven from `CONFIG.messages` and `CONFIG.starfield.frameDuration`.
- **No globals**: All JS is wrapped in a single IIFE. Modules (`Starfield`, `Proposal`, `Celebration`, `ScreenManager`) are scoped constants.
- **Hearts cleanup**: Floating heart `<div>` elements are removed from the DOM on `animationend` to prevent memory leaks.
- **Audio**: Triggered by user gesture (Yes click) to comply with browser autoplay policies.

---

## 📄 License

Made with ❤️ for someone special.
