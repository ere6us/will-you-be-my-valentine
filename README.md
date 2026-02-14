# 💌 Will You Be My Valentine?

A cinematic, multi-screen Valentine's Day website with twinkling starfield, romantic message reveals, a playful proposal, prank love contract, date planner, countdown timer, and animated flower bouquet.

**Pure HTML/CSS/JS** — no frameworks, no backend, no build step. Open `index.html` and it just works.

---

## ✨ Features

- **Starfield Intro** — 500 twinkling stars with sequentially fading romantic messages, plus a 🌙 skip shortcut
- **Proposal Screen** — "Will you be my Valentine?" where clicking No makes Yes grow hilariously larger
- **Confetti Burst** — canvas confetti explosion on clicking Yes
- **Celebration Screen** — circular photo carousel, heartfelt message, floating hearts, and optional background audio
- **Photo Carousel** — 5-slot circular carousel with arrow navigation and touch/swipe support
- **Prank Love Letter** — name input gate with funny rejections, revealing a binding "love contract" when the correct name is entered
- **Date Picker** — pick a date for your Valentine's outing (with funny messages if you try to skip)
- **Plan the Date** — tabbed selection grids for food, dessert, and activities
- **Final Screen** — live countdown timer to your date + animated CSS flower bouquet with falling petals
- **7 Screens Total** — smooth CSS fade transitions between each screen
- **Fully Responsive** — works beautifully on both desktop and mobile
- **One Config Object** — customize everything (names, messages, photos, audio, letter, date options) in one place
- **Dark Starry Theme** — consistent cinematic ambiance with ambient starfields on every screen
- **No Global Variables** — all JS lives inside a single IIFE

---

## 📁 Project Structure

```
will-you-be-my-valentine/
├── index.html          ← Entry point (open this in your browser)
├── styles.css          ← All styling
├── script.js           ← All logic + CONFIG object at the top
├── README.md           ← This file
└── assets/
    ├── *.jpg           ← Your photos (carousel)
    └── music.mp3       ← Background audio (optional)
```

---

## 🎯 How to Use

### 1. Add Your Assets

Place your photos in the `assets/` folder and an optional MP3 for background music.

### 2. Customize the CONFIG

Open `script.js` and edit the `CONFIG` object at the very top:

| What to change | Where in CONFIG |
|---|---|
| Partner's name | `partnerName` |
| Romantic intro messages | `messages[]` |
| Final persistent lines | `finalLines[]` — use `{name}` as a placeholder |
| Continue button text | `continueButtonText` |
| Proposal question & buttons | `proposal.question`, `.yesText`, `.noText` |
| Sassy "no" responses | `proposal.noMessages[]` |
| Carousel photos | `celebration.mainPhoto`, `celebration.sidePhotos[]` |
| Celebration text | `celebration.message`, `.subMessage` |
| Audio file | `audio.src`, `audio.enabled` |
| Allowed names for letter | `letter.allowedNames[]` |
| Wrong-name rejections | `letter.wrongNameMessages[]` |
| Prank contract text | `letter.greeting`, `.body`, `.closing` |
| Food / Dessert / Activities | `dateOptions.food[]`, `.dessert[]`, `.activities[]` |
| Final screen message | `finalMessage` |
| Starfield settings | `starfield.starCount`, `.frameDuration`, etc. |

### 3. Open in Browser

Just double-click `index.html` — no server needed.

---

## 🎬 Screen Flow

1. **Starfield** → twinkling stars + fading messages → Continue button
2. **Proposal** → Yes/No question → confetti burst on Yes
3. **Celebration** → photo carousel + message + floating hearts
4. **Love Letter** → enter name → prank contract reveal
5. **Date Picker** → pick a date for the outing
6. **Plan the Date** → choose food, dessert, activities
7. **Final** → countdown timer + animated flower bouquet

---

---

## 🛠 Technical Notes

- **Font**: [Poppins](https://fonts.google.com/specimen/Poppins) via Google Fonts CDN. Canvas waits for `document.fonts.ready`.
- **Screen transitions**: CSS `opacity` + `visibility`, managed by `ScreenManager.transitionTo()`.
- **Starfield**: HTML5 Canvas with `requestAnimationFrame`. Two-pass measure-then-draw for mobile text wrapping.
- **IIFE architecture**: 10 modules — `ScreenManager`, `Starfield`, `createAmbientStarfield`, `Proposal`, `Celebration`, `Confetti`, `LoveLetter`, `DatePickerScreen`, `PlanDate`, `FinalScreen`.
- **Carousel**: CSS `data-slot` positioning with circular JS rotation + touch swipe (40px threshold).
- **Flower bouquet**: CSS keyframe animations with `animation-play-state: paused` until the final screen is active.
- **Favicon**: Inline SVG emoji — no external file needed.
- **Hearts cleanup**: `<div>` elements removed on `animationend` to prevent memory leaks.

---

## 📄 License

Made with ❤️ for someone special.
