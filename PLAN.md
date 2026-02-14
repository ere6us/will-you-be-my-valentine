# PLAN.md — will-you-be-my-valentine

## Overview

A single-page Valentine's Day website with 3 screens, orchestrated via JS-driven
CSS transitions. No page reloads. All customizable content lives in a single
`CONFIG` object at the top of `script.js`.

Derived from two existing projects:
- **valentine-website** → starfield canvas + fade-in/out romantic messages
- **valentine.github.io** → "Will you be my valentine?" yes/no interaction

---

## Folder Structure

```
will-you-be-my-valentine/
├── index.html          # Single entry point (all 3 screens)
├── styles.css          # All styling (scoped by screen class)
├── script.js           # All logic (IIFE-wrapped, CONFIG at top)
├── PLAN.md             # This file
├── README.md           # Setup, deploy, and customization guide
└── assets/
    ├── celebration.gif # Placeholder — replace with your GIF
    ├── cursor.png      # Custom heart cursor (optional)
    └── music.mp3       # Placeholder — replace with your audio
```

---

## Screen Flow

```
┌─────────────────────┐
│  SCREEN 1: Starfield│
│  (full-screen canvas │
│  + fading messages)  │
│                      │
│  [Continue 💌]       │──── fade transition ────┐
└─────────────────────┘                          │
                                                 ▼
                              ┌─────────────────────────┐
                              │  SCREEN 2: Proposal      │
                              │  "Will you be my         │
                              │   Valentine?"             │
                              │                           │
                              │  [Yes ❤️]  [No 😢]        │
                              │  (No → Yes grows +12px)  │
                              │  (Yes → fade transition) │
                              └───────────┬───────────────┘
                                          │
                                          ▼
                              ┌─────────────────────────┐
                              │  SCREEN 3: Celebration   │
                              │  🎉 GIF + final message  │
                              │  + optional audio        │
                              │  + floating hearts anim  │
                              └─────────────────────────┘
```

---

## CONFIG Object Structure

```js
const CONFIG = {
  // — Personalization —
  partnerName: "My Love",

  // — Starfield Settings —
  starfield: {
    starCount: 500,
    colorHues: [0, 60, 240],       // red, gold, blue
    maxRadius: 1.2,
    twinkleChance: 0.01,           // 1% per frame per star
    frameDuration: 250,            // frames per fade-in or fade-out
  },

  // — Romantic Messages (shown sequentially on starfield) —
  messages: [
    "Every single day, I cannot believe how lucky I am",
    "Amongst trillions and trillions of stars, over billions of years",
    "To be alive, and to get to spend this life with you",
    "Is so incredibly, unfathomably unlikely",
    "And yet here I am, with the impossible chance to know you",
  ],

  // — Final starfield lines (persist after messages finish) —
  finalLines: [
    "I love you so much {name}, more than all the time and space in the universe can contain",
    "And I can't wait to spend all the time in the world to share that love with you!",
    "Happy Valentine's Day ❤️",
  ],

  // — Continue button (appears after starfield finishes) —
  continueButtonText: "Continue 💌",

  // — Proposal Screen —
  proposal: {
    question: "Will you be my Valentine?",
    yesText: "Yes ❤️",
    noText: "No 😢",
    noGrowthPx: 12,
    noMessages: [
      "Are you sure? 🥺",
      "Think again... 💕",
      "Pretty please? 🌹",
      "I'll be sad... 😿",
      "Last chance... 💘",
    ],
  },

  // — Celebration Screen —
  celebration: {
    gifPath: "assets/celebration.gif",
    message: "Yay! You made my heart so happy! 💖",
    subMessage: "I love you to the moon and back 🌙",
  },

  // — Audio (optional) —
  audio: {
    enabled: true,
    src: "assets/music.mp3",
    autoplay: true,
    loop: true,
  },

  // — Font (Google Font loaded in index.html) —
  fontFamily: "'Poppins', sans-serif",
};
```

---

## HTML Structure (index.html)

Single HTML file with 3 screen `<section>` elements, only one visible at a time.

```html
<body>
  <!-- SCREEN 1: Starfield Intro -->
  <section id="screen-starfield" class="screen active">
    <canvas id="starfield"></canvas>
    <button id="btn-continue" class="btn hidden">Continue 💌</button>
  </section>

  <!-- SCREEN 2: Proposal -->
  <section id="screen-proposal" class="screen">
    <canvas id="starfield-bg"></canvas>
    <div class="card">
      <h1 id="proposal-question"></h1>
      <div class="btn-group">
        <button id="btn-yes" class="btn btn-yes"></button>
        <button id="btn-no" class="btn btn-no"></button>
      </div>
    </div>
  </section>

  <!-- SCREEN 3: Celebration -->
  <section id="screen-celebration" class="screen">
    <canvas id="starfield-bg-2"></canvas>
    <div class="card celebration-card">
      <img id="celebration-gif" alt="Celebration" />
      <h1 id="celebration-msg"></h1>
      <p id="celebration-sub"></p>
      <div id="hearts-container"></div>
    </div>
    <audio id="celebration-audio"></audio>
  </section>
</body>
```

---

## CSS Architecture (styles.css)

### Approach
- Single file, scoped by `#screen-*` and `.card` selectors.
- CSS custom properties for theming at `:root`.
- Mobile-first responsive design.

### Key Sections

| Section | Purpose |
|---|---|
| `:root` variables | Colors, font, transition speed, card width |
| Reset + base | `*, html, body` — margin 0, box-sizing |
| `.screen` + transitions | `position: fixed; inset: 0;` with `opacity` + `visibility` transitions |
| `#screen-starfield` | Canvas full-screen, button centered below text |
| `#screen-proposal` | Dark bg, centered `.card` with glassmorphism |
| `#screen-celebration` | Dark bg, centered `.card`, floating hearts keyframes |
| `.card` | `max-width: 500px`, padding, border-radius, backdrop-filter blur |
| Buttons | Shared `.btn` base, `.btn-yes` / `.btn-no` variants, hover/active transforms |
| Responsive | `@media (max-width: 600px)` — card goes full-width, font adjusts |
| Animations | `@keyframes fadeIn`, `slideUp`, `floatHeart`, `pulse` |

### Theme Variables

```css
:root {
  --bg-dark: #0a0a1a;
  --text-glow: rgba(45, 45, 255, 1);
  --accent-pink: #ff6b9d;
  --accent-coral: #ff9494;
  --card-bg: rgba(255, 255, 255, 0.05);
  --card-border: rgba(255, 255, 255, 0.1);
  --btn-yes-bg: #ff6b9d;
  --btn-no-bg: rgba(255, 255, 255, 0.15);
  --font-main: 'Poppins', sans-serif;
  --transition-speed: 0.6s;
}
```

---

## JS Architecture (script.js)

### Structure — Single IIFE

```
(function() {
  "use strict";

  const CONFIG = { ... };

  // ── Module: Screen Manager ──
  //    - transitionTo(screenId) → handles fade out/in
  //    - getCurrentScreen()

  // ── Module: Starfield ──
  //    - init(canvasEl) → setup stars array
  //    - draw() → requestAnimationFrame loop
  //    - drawStars() → render + twinkle
  //    - drawMessages() → frame-based fade in/out from CONFIG.messages
  //    - showContinueButton() → reveal at end
  //    - destroy() → cancelAnimationFrame, cleanup

  // ── Module: Proposal ──
  //    - init() → populate text from CONFIG, bind events
  //    - handleNo() → grow Yes button, cycle noMessages
  //    - handleYes() → trigger transition to celebration

  // ── Module: Celebration ──
  //    - init() → show GIF, message, start audio, spawn hearts
  //    - spawnHearts() → create floating heart elements periodically

  // ── Bootstrap ──
  //    document.fonts.ready.then(() => { ... })
  //    - Wait for Google Font to load
  //    - Initialize Screen 1
})();
```

### Key Decisions

1. **No global variables** — everything inside the IIFE. CONFIG is a `const` at the top.
2. **`document.fonts.ready`** — ensures Poppins is loaded before canvas draws text.
3. **`requestAnimationFrame` cleanup** — when leaving Screen 1, cancel to save resources.
4. **Starfield on proposal/celebration screens** — smaller ambient canvases (100 stars, no text).
5. **Message system is data-driven** — frame math computed from `CONFIG.messages.length` and `CONFIG.starfield.frameDuration`.
6. **No button grows via `font-size`** — +12px per click, with CSS `transform: scale()` bump animation.
7. **Floating hearts** — CSS `@keyframes` on dynamically created `<div>` elements, removed on `animationend`.
8. **Audio triggered on Yes click** — avoids browser autoplay policy blocks.

---

## Implementation Phases

### Phase 1: Scaffolding + Layout + Config
- Create folder structure and all files
- Write `index.html` with 3 screen sections (static placeholder text)
- Write CSS reset, screen transitions, card layout, responsive rules
- Write `CONFIG` object skeleton in `script.js`
- Write screen manager (transition logic)
- **Verify**: open `index.html`, see Screen 1 active, can toggle screens via dev console

### Phase 2: Starfield + Message Reveal
- Port starfield canvas (stars, twinkling, resize handler)
- Implement data-driven message system (loop CONFIG.messages)
- Add text glow rendering with Poppins font
- Implement responsive line breaks for mobile
- Add "Continue 💌" button reveal after final message
- Wire Continue button → transition to Screen 2
- **Verify**: starfield animates, messages fade in/out, button appears, click transitions

### Phase 3: Proposal Screen + Yes/No Logic
- Populate question/button text from CONFIG
- Implement No-click → Yes grows (+12px, pulse animation)
- Implement cycling "no messages" (question text changes)
- Add background starfield (smaller canvas, ambient only)
- Wire Yes button → transition to Screen 3
- **Verify**: No grows Yes repeatedly, Yes transitions to celebration

### Phase 4: Celebration Screen + Polish
- Show GIF from CONFIG path
- Display celebration message + sub-message
- Implement optional audio (play/pause toggle, respects CONFIG.audio.enabled)
- Implement floating hearts animation
- Add entrance animations (GIF slides up, text fades in)
- Add background starfield (ambient)
- **Verify**: celebration screen shows all elements, audio plays, hearts float

### Phase 5: Cleanup + README + Deploy
- Review all code for comments/docs
- Remove any debug code
- Write README.md with customization + deployment instructions
- Final testing checklist
- **Verify**: full flow works on desktop + mobile, README is complete

---

## Screen Transition Mechanism

```css
.screen {
  position: fixed;
  inset: 0;
  opacity: 0;
  visibility: hidden;
  transition: opacity var(--transition-speed) ease,
              visibility 0s linear var(--transition-speed);
}

.screen.active {
  opacity: 1;
  visibility: visible;
  transition: opacity var(--transition-speed) ease,
              visibility 0s linear 0s;
}
```

JS `transitionTo(id)`:
1. Remove `.active` from current screen
2. After transition duration, add `.active` to target screen
3. Clean up previous screen resources (e.g., cancel starfield animation)

---

## Conflict Avoidance

| Concern | Mitigation |
|---|---|
| Global variables | Entire JS is in an IIFE; `CONFIG` is a `const` |
| CSS leaking | Only one CSS file, scoped by `#screen-*` selectors |
| Multiple canvases | Each gets a unique ID (`#starfield`, `#starfield-bg`, `#starfield-bg-2`) |
| Font loading race | `document.fonts.ready` gate before canvas rendering |
| DOM bloat (hearts) | Floating hearts removed on `animationend` |
| Audio autoplay blocked | Audio triggered by user-gesture (Yes click) |

---

## Testing Checklist

- [ ] `index.html` opens directly in browser (no server needed)
- [ ] Starfield renders with twinkling stars
- [ ] Messages fade in and out sequentially with correct pacing
- [ ] "Continue 💌" button appears after final message
- [ ] Smooth transition from starfield → proposal screen
- [ ] Proposal question and buttons display correctly
- [ ] Clicking "No" grows the "Yes" button each time
- [ ] "No" button shows cycling messages
- [ ] Clicking "Yes" transitions to celebration screen
- [ ] Celebration GIF displays (or placeholder)
- [ ] Celebration message displays from CONFIG
- [ ] Audio plays (if enabled and file present)
- [ ] Floating hearts animate and get cleaned up
- [ ] Works on mobile (≤ 600px) — full-width cards, readable text
- [ ] Works on desktop — centered card layout
- [ ] No console errors
- [ ] CONFIG changes reflect immediately (name, messages, paths)

---

## GitHub Pages Deployment

1. Push `will-you-be-my-valentine/` to a GitHub repo
2. Go to **Settings → Pages**
3. Source: **Deploy from a branch**
4. Branch: `main`, folder: `/ (root)`
5. Save → site available at `https://<username>.github.io/<repo-name>/`

---

## Where to Customize

| What | Where in CONFIG |
|---|---|
| Partner's name | `CONFIG.partnerName` |
| Romantic messages | `CONFIG.messages[]` |
| Final persistent lines | `CONFIG.finalLines[]` |
| Continue button text | `CONFIG.continueButtonText` |
| Proposal question | `CONFIG.proposal.question` |
| Yes/No button text | `CONFIG.proposal.yesText / .noText` |
| No-click sass messages | `CONFIG.proposal.noMessages[]` |
| Growth per No click | `CONFIG.proposal.noGrowthPx` |
| Celebration GIF | `CONFIG.celebration.gifPath` |
| Celebration message | `CONFIG.celebration.message` |
| Sub-message | `CONFIG.celebration.subMessage` |
| Audio file | `CONFIG.audio.src` |
| Enable/disable audio | `CONFIG.audio.enabled` |
| Star count / colors | `CONFIG.starfield.*` |
