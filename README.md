# 💌 Will You Be My Valentine?

A cinematic, single-page Valentine's Day website with twinkling starfield, romantic message reveals, a playful proposal interaction, and a celebration finale.

**Pure HTML/CSS/JS** — no frameworks, no backend, no build step. Open `index.html` and it just works.

---

## ✨ Features

- **Starfield Intro** — 500 twinkling stars with sequentially fading romantic messages
- **Proposal Screen** — "Will you be my Valentine?" where clicking No makes Yes grow hilariously larger
- **Celebration Screen** — circular photo carousel, heartfelt message, floating hearts, and optional background audio
- **Photo Carousel** — 5-slot circular carousel with arrow navigation and touch/swipe support
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
    ├── us.jpg          ← Main/center carousel photo
    ├── aatsu name.jpg  ← Side photo 1
    ├── brush.jpg       ← Side photo 2
    ├── coffee.jpg      ← Side photo 3
    ├── flower.jpg      ← Side photo 4
    └── music.mp3       ← Background audio
```

---

## 🎯 How to Use

### 1. Replace Assets

| File | What to do |
|---|---|
| `assets/us.jpg` | Replace with your main photo (center of the carousel). Update `CONFIG.celebration.mainPhoto` if you change the filename. |
| `assets/*.jpg` (side photos) | Replace with your own photos. Update the `CONFIG.celebration.sidePhotos` array to match your filenames. You can have any number of side photos. |
| `assets/music.mp3` | Replace with a romantic MP3 track. Or set `CONFIG.audio.enabled = false` to disable audio entirely. |

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
| Main carousel photo | `CONFIG.celebration.mainPhoto` |
| Side carousel photos | `CONFIG.celebration.sidePhotos[]` — array of image paths |
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
- [ ] Photo carousel displays with center photo prominent
- [ ] Carousel arrows rotate photos circularly
- [ ] Touch/swipe works on mobile carousel
- [ ] Celebration message and sub-message display
- [ ] Audio plays (if enabled and file present)
- [ ] Floating hearts animate and clean themselves up
- [ ] Final starfield lines don't overlap on narrow screens
- [ ] Responsive on mobile (≤ 600px) — full-width cards, 3-slot carousel
- [ ] Responsive on desktop — centered card layout, 5-slot carousel
- [ ] No console errors
- [ ] CONFIG changes reflect immediately without code changes

---

## 🛠 Technical Notes

- **Font**: [Poppins](https://fonts.google.com/specimen/Poppins) loaded via Google Fonts CDN. Canvas text waits for `document.fonts.ready` before rendering.
- **Screen transitions**: CSS `opacity` + `visibility` transitions, managed by `ScreenManager.transitionTo()`.
- **Starfield**: HTML5 Canvas with `requestAnimationFrame`. Message timing is data-driven from `CONFIG.messages` and `CONFIG.starfield.frameDuration`.
- **No globals**: All JS is wrapped in a single IIFE. Modules (`Starfield`, `Proposal`, `Celebration`, `ScreenManager`) are scoped constants.
- **Photo carousel**: CSS `data-slot` based positioning with 5 visible slots. JS tracks `currentIndex` and assigns slots circularly. Supports click arrows and touch swipe (40px threshold).
- **Text wrapping**: Canvas messages use a two-pass measure-then-draw approach so multi-line text doesn't overlap on narrow mobile screens.
- **Favicon**: Inline SVG emoji favicon — no external image file needed.
- **Hearts cleanup**: Floating heart `<div>` elements are removed from the DOM on `animationend` to prevent memory leaks.
- **Audio**: Triggered by user gesture (Yes click) to comply with browser autoplay policies.

---

## 📄 License

Made with ❤️ for someone special.
