/**
 * ═══════════════════════════════════════════════════════════════
 * will-you-be-my-valentine — script.js
 *
 * Single IIFE containing all logic for the 3-screen Valentine's
 * experience. No global variables. All customizable content is
 * in the CONFIG object below.
 * ═══════════════════════════════════════════════════════════════
 */
(function () {
  "use strict";

  /* ═══════════════════════════════════════════════════════════
     CONFIG — Edit this object to customize everything.
     ═══════════════════════════════════════════════════════════ */

  /**
   * @typedef {Object} Config
   * @property {string} partnerName - The name shown in the final starfield message.
   * @property {Object} starfield   - Canvas starfield settings.
   * @property {string[]} messages  - Sequential romantic messages for the intro.
   * @property {string[]} finalLines - Persistent lines shown after messages finish.
   * @property {string} continueButtonText - Text on the button after starfield.
   * @property {Object} proposal    - Proposal screen settings.
   * @property {Object} celebration - Celebration screen settings.
   * @property {Object} audio       - Audio settings for celebration screen.
   * @property {string} fontFamily  - CSS font-family string (must match loaded font).
   */
  const CONFIG = {
    // ── Personalization ──
    partnerName: "My Love",

    // ── Starfield Canvas ──
    starfield: {
      starCount: 500,             // Number of stars rendered
      colorHues: [0, 60, 240],    // HSL hue values: red, gold, blue
      maxRadius: 1.2,             // Max star radius in px
      twinkleChance: 0.01,        // Probability per frame per star to change opacity
      frameDuration: 250,         // Frames for each fade-in or fade-out phase
    },

    // ── Romantic Messages (shown one-by-one on the starfield) ──
    messages: [
      "Every single day, I cannot believe how lucky I am",
      "Amongst trillions and trillions of stars, over billions of years",
      "To be alive, and to get to spend this life with you",
      "Is so incredibly, unfathomably unlikely",
      "And yet here I am, with the impossible chance to know you",
    ],

    // ── Final Lines (persist on screen after all messages) ──
    // Use {name} as a placeholder — it gets replaced with partnerName.
    finalLines: [
      "I love you so much {name}, more than all the time and space in the universe can contain",
      "And I can't wait to spend all the time in the world to share that love with you!",
      "Happy Valentine's Day ❤️",
    ],

    // ── Continue Button ──
    continueButtonText: "Continue 💌",

    // ── Proposal Screen ──
    proposal: {
      question: "Will you be my Valentine?",
      yesText: "Yes ❤️",
      noText: "No 😢",
      noGrowthPx: 12,            // How many px the Yes button grows per No click
      noMessages: [               // Cycling question text when No is clicked
        "Are you sure? 🥺",
        "Think again... 💕",
        "Pretty please? 🌹",
        "I'll be sad... 😿",
        "Last chance... 💘",
      ],
    },

    // ── Celebration Screen ──
    celebration: {
      mainPhoto: "assets/us.jpg",           // Central hero photo
      sidePhotos: [                          // 4 photos distributed around the main
        "assets/aatsu name.jpg",
        "assets/brush.jpg",
        "assets/coffee.jpg",
        "assets/flower.jpg",
      ],
      message: "Yay! You made my heart so happy! 💖",
      subMessage: "I love you to the moon and back 🌙",
    },

    // ── Audio (plays on celebration screen) ──
    audio: {
      enabled: true,
      src: "assets/music.mp3",
      loop: true,
    },

    // ── Font (must match the Google Font loaded in index.html) ──
    fontFamily: "'Poppins', sans-serif",
  };


  /* ═══════════════════════════════════════════════════════════
     SCREEN MANAGER
     Handles transitions between the 3 screens.
     ═══════════════════════════════════════════════════════════ */

  const ScreenManager = (() => {
    let currentId = "screen-starfield";

    /**
     * Transition from the current screen to a target screen.
     * @param {string} targetId - The id of the screen section to show.
     * @param {Function} [onComplete] - Optional callback after transition.
     */
    function transitionTo(targetId, onComplete) {
      const current = document.getElementById(currentId);
      const target = document.getElementById(targetId);

      if (!current || !target || currentId === targetId) return;

      // Fade out current
      current.classList.remove("active");

      // After CSS transition completes, fade in target
      const speed = parseFloat(
        getComputedStyle(document.documentElement)
          .getPropertyValue("--transition-speed")
      ) * 1000 || 600;

      setTimeout(() => {
        target.classList.add("active");
        currentId = targetId;
        if (typeof onComplete === "function") onComplete();
      }, speed);
    }

    /** @returns {string} The id of the currently active screen. */
    function getCurrent() {
      return currentId;
    }

    return { transitionTo, getCurrent };
  })();


  /* ═══════════════════════════════════════════════════════════
     STARFIELD MODULE
     Renders twinkling stars and sequentially fading messages
     on an HTML5 canvas using requestAnimationFrame.
     ═══════════════════════════════════════════════════════════ */

  const Starfield = (() => {
    let canvas, ctx;
    let stars = [];
    let animFrameId = null;
    let frameNumber = 0;
    let isRunning = false;

    // Pre-computed message timing
    let messageSlots = [];   // { text, fadeInStart, fadeInEnd, fadeOutStart, fadeOutEnd }
    let finalSlots = [];     // { text, fadeInStart, lineOffset }
    let continueFrame = 0;   // Frame at which the continue button appears

    /**
     * Initialize the main starfield canvas.
     * @param {HTMLCanvasElement} canvasEl - The canvas element.
     */
    function init(canvasEl) {
      canvas = canvasEl;
      ctx = canvas.getContext("2d");
      resize();

      // Build star array
      const cfg = CONFIG.starfield;
      stars = [];
      for (let i = 0; i < cfg.starCount; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * cfg.maxRadius,
          hue: cfg.colorHues[Math.floor(Math.random() * cfg.colorHues.length)],
          sat: 50 + Math.random() * 50,
          opacity: Math.random(),
        });
      }

      // Pre-compute message timing from CONFIG
      computeMessageTiming();

      // Listen for resize
      window.addEventListener("resize", resize);
    }

    /** Resize the canvas to fill the viewport. */
    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    /**
     * Compute frame-based timing for each message and final line.
     * Each message gets `frameDuration` frames to fade in, then
     * `frameDuration` frames to fade out, with a gap frame between.
     */
    function computeMessageTiming() {
      const fd = CONFIG.starfield.frameDuration;
      let frame = 0;

      // Sequential messages: fade in → fade out
      messageSlots = CONFIG.messages.map((text) => {
        const slot = {
          text,
          fadeInStart: frame + 1,
          fadeInEnd: frame + fd,
          fadeOutStart: frame + fd,
          fadeOutEnd: frame + fd * 2,
        };
        frame = frame + fd * 2; // next message starts after fade-out
        return slot;
      });

      // Final lines: fade in one after another, stay visible
      const finalGap = Math.round(fd * 1.0); // frames between final lines
      finalSlots = CONFIG.finalLines.map((rawText, i) => {
        const text = rawText.replace(/\{name\}/g, CONFIG.partnerName);
        const fadeInStart = frame + 1 + i * finalGap;
        return { text, fadeInStart, lineIndex: i };
      });

      // Continue button appears after the last final line is mostly faded in
      const lastFinal = finalSlots[finalSlots.length - 1];
      continueFrame = lastFinal.fadeInStart + fd;
    }

    /** Main animation loop. */
    function draw() {
      if (!isRunning) return;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = getComputedStyle(document.documentElement)
        .getPropertyValue("--bg-dark").trim() || "#0a0a1a";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      renderStars();
      twinkleStars();
      renderMessages();

      // Show continue button
      if (frameNumber >= continueFrame) {
        showContinueButton();
      }

      frameNumber++;
      animFrameId = requestAnimationFrame(draw);
    }

    /** Render all stars onto the canvas. */
    function renderStars() {
      for (const star of stars) {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${star.hue}, ${star.sat}%, 88%, ${star.opacity})`;
        ctx.fill();
      }
    }

    /** Randomly twinkle stars by changing opacity. */
    function twinkleStars() {
      const chance = CONFIG.starfield.twinkleChance;
      for (const star of stars) {
        if (Math.random() < chance) {
          star.opacity = Math.random();
        }
      }
    }

    /**
     * Render the current message or final lines based on frameNumber.
     * Uses fade-in/out opacity mapped to frame ranges.
     */
    function renderMessages() {
      const fd = CONFIG.starfield.frameDuration;
      const fontSize = Math.min(28, window.innerWidth / 26);
      ctx.font = `500 ${fontSize}px ${CONFIG.fontFamily}`;
      ctx.textAlign = "center";

      // Glow effect
      ctx.shadowColor = "rgba(180, 140, 255, 0.9)";
      ctx.shadowBlur = 12;

      // ── Sequential messages ──
      for (const slot of messageSlots) {
        let opacity = 0;

        if (frameNumber >= slot.fadeInStart && frameNumber < slot.fadeInEnd) {
          // Fading in
          opacity = (frameNumber - slot.fadeInStart) / (slot.fadeInEnd - slot.fadeInStart);
        } else if (frameNumber >= slot.fadeOutStart && frameNumber < slot.fadeOutEnd) {
          // Fading out
          opacity = 1 - (frameNumber - slot.fadeOutStart) / (slot.fadeOutEnd - slot.fadeOutStart);
        }

        if (opacity > 0) {
          ctx.fillStyle = `rgba(220, 200, 255, ${opacity})`;
          drawWrappedText(slot.text, canvas.width / 2, canvas.height / 2, fontSize);
        }
      }

      // ── Final persistent lines ──
      for (const slot of finalSlots) {
        let opacity = 0;

        if (frameNumber >= slot.fadeInStart) {
          opacity = Math.min(1, (frameNumber - slot.fadeInStart) / fd);
        }

        if (opacity > 0) {
          ctx.fillStyle = `rgba(220, 200, 255, ${opacity})`;
          const yOffset = slot.lineIndex * (fontSize + 16);
          drawWrappedText(
            slot.text,
            canvas.width / 2,
            canvas.height / 2 - 30 + yOffset,
            fontSize
          );
        }
      }

      // Reset shadow
      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;
    }

    /**
     * Draw text with automatic line wrapping for narrow screens.
     * @param {string} text - The text to draw.
     * @param {number} x - Center X position.
     * @param {number} y - Center Y position.
     * @param {number} fontSize - Current font size for line height calc.
     */
    function drawWrappedText(text, x, y, fontSize) {
      const maxWidth = canvas.width * 0.85;
      const words = text.split(" ");
      const lines = [];
      let currentLine = "";

      for (const word of words) {
        const testLine = currentLine ? currentLine + " " + word : word;
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && currentLine) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      }
      lines.push(currentLine);

      const lineHeight = fontSize + 10;
      const totalHeight = lines.length * lineHeight;
      const startY = y - totalHeight / 2 + lineHeight / 2;

      for (let i = 0; i < lines.length; i++) {
        ctx.fillText(lines[i], x, startY + i * lineHeight);
      }
    }

    /** Reveal the continue button with a fade-in. */
    function showContinueButton() {
      const btn = document.getElementById("btn-continue");
      if (btn && btn.classList.contains("hidden")) {
        btn.classList.add("show");
      }
    }

    /** Start the animation loop. */
    function start() {
      if (isRunning) return;
      isRunning = true;
      frameNumber = 0;
      animFrameId = requestAnimationFrame(draw);
    }

    /** Stop the animation loop and clean up. */
    function destroy() {
      isRunning = false;
      if (animFrameId) {
        cancelAnimationFrame(animFrameId);
        animFrameId = null;
      }
      window.removeEventListener("resize", resize);
    }

    return { init, start, destroy };
  })();


  /* ═══════════════════════════════════════════════════════════
     AMBIENT STARFIELD
     A lighter starfield for background ambiance on screens 2/3.
     Reuses star-drawing logic with fewer stars and no text.
     ═══════════════════════════════════════════════════════════ */

  function createAmbientStarfield(canvasEl, starCount) {
    const ctx = canvasEl.getContext("2d");
    let stars = [];
    let animId = null;
    let running = false;

    function resize() {
      canvasEl.width = canvasEl.parentElement.offsetWidth || window.innerWidth;
      canvasEl.height = canvasEl.parentElement.offsetHeight || window.innerHeight;
    }

    function init() {
      resize();
      const hues = CONFIG.starfield.colorHues;
      stars = [];
      for (let i = 0; i < starCount; i++) {
        stars.push({
          x: Math.random() * canvasEl.width,
          y: Math.random() * canvasEl.height,
          radius: Math.random() * 1.0,
          hue: hues[Math.floor(Math.random() * hues.length)],
          sat: 50 + Math.random() * 50,
          opacity: Math.random(),
        });
      }
      window.addEventListener("resize", resize);
    }

    function draw() {
      if (!running) return;
      ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);

      for (const s of stars) {
        if (Math.random() < 0.008) s.opacity = Math.random();
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${s.hue}, ${s.sat}%, 88%, ${s.opacity})`;
        ctx.fill();
      }

      animId = requestAnimationFrame(draw);
    }

    function start() {
      if (running) return;
      running = true;
      animId = requestAnimationFrame(draw);
    }

    function stop() {
      running = false;
      if (animId) cancelAnimationFrame(animId);
    }

    return { init, start, stop };
  }


  /* ═══════════════════════════════════════════════════════════
     PROPOSAL MODULE
     Handles the "Will you be my Valentine?" screen logic.
     ═══════════════════════════════════════════════════════════ */

  const Proposal = (() => {
    let noClickCount = 0;
    let ambientStars = null;

    /** Initialize proposal screen elements from CONFIG. */
    function init() {
      const questionEl = document.getElementById("proposal-question");
      const btnYes = document.getElementById("btn-yes");
      const btnNo = document.getElementById("btn-no");

      questionEl.textContent = CONFIG.proposal.question;
      btnYes.textContent = CONFIG.proposal.yesText;
      btnNo.textContent = CONFIG.proposal.noText;

      // ── No button → grow Yes, cycle question text ──
      btnNo.addEventListener("click", () => {
        noClickCount++;

        // Grow Yes button font size
        const currentSize = parseFloat(window.getComputedStyle(btnYes).fontSize);
        btnYes.style.fontSize = (currentSize + CONFIG.proposal.noGrowthPx) + "px";
        btnYes.style.padding = `${14 + noClickCount * 3}px ${40 + noClickCount * 6}px`;

        // Quick pulse animation
        btnYes.style.animation = "none";
        // Trigger reflow to restart animation
        void btnYes.offsetHeight;
        btnYes.style.animation = "pulse 0.4s ease";

        // Cycle question text
        const msgs = CONFIG.proposal.noMessages;
        if (msgs.length > 0) {
          questionEl.textContent = msgs[(noClickCount - 1) % msgs.length];
        }
      });

      // ── Yes button → transition to celebration ──
      btnYes.addEventListener("click", () => {
        ScreenManager.transitionTo("screen-celebration", () => {
          Celebration.init();
        });
      });

      // ── Ambient starfield behind the card ──
      const bgCanvas = document.getElementById("starfield-bg");
      ambientStars = createAmbientStarfield(bgCanvas, 150);
      ambientStars.init();
      ambientStars.start();
    }

    return { init };
  })();


  /* ═══════════════════════════════════════════════════════════
     CELEBRATION MODULE
     Handles the final celebration screen: GIF, message,
     audio, and floating hearts.
     ═══════════════════════════════════════════════════════════ */

  const Celebration = (() => {
    let heartsInterval = null;
    let ambientStars = null;

    // ── Carousel state ──
    let photos = [];      // array of <img> elements
    let currentIndex = 0; // index of the centre photo

    /**
     * Assign data-slot attributes so CSS positions each photo.
     * Slots: -2, -1, 0 (centre), 1, 2.  Anything else → "hidden".
     */
    function updateSlots() {
      const n = photos.length;
      photos.forEach((img, i) => {
        // Distance from centre (circular)
        let diff = i - currentIndex;
        // Wrap into range [-floor(n/2) .. +floor(n/2)]
        if (diff > Math.floor(n / 2))  diff -= n;
        if (diff < -Math.floor(n / 2)) diff += n;

        if (diff >= -2 && diff <= 2) {
          img.setAttribute("data-slot", String(diff));
        } else {
          img.setAttribute("data-slot", "hidden");
        }
      });
    }

    /** Rotate carousel: direction = 1 (right→centre) or -1 (left→centre). */
    function rotate(direction) {
      const n = photos.length;
      currentIndex = (currentIndex + direction + n) % n;
      updateSlots();
    }

    /** Initialize celebration screen from CONFIG. */
    function init() {
      // ── Build carousel photos ──
      const track = document.getElementById("carousel-track");
      const allPhotos = [CONFIG.celebration.mainPhoto].concat(CONFIG.celebration.sidePhotos);

      allPhotos.forEach((src, i) => {
        const img = document.createElement("img");
        img.src = src;
        img.alt = i === 0 ? "Us" : "Memory " + i;
        img.classList.add("carousel-photo");
        track.appendChild(img);
        photos.push(img);
      });

      // Initial slot assignment (first photo = centre)
      currentIndex = 0;
      updateSlots();

      // Arrow listeners
      document.getElementById("carousel-left").addEventListener("click", () => rotate(-1));
      document.getElementById("carousel-right").addEventListener("click", () => rotate(1));

      // Optional: swipe support for touch devices
      let touchStartX = 0;
      track.addEventListener("touchstart", (e) => {
        touchStartX = e.changedTouches[0].clientX;
      }, { passive: true });
      track.addEventListener("touchend", (e) => {
        const diff = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(diff) > 40) rotate(diff < 0 ? 1 : -1);
      }, { passive: true });

      // Set text
      document.getElementById("celebration-msg").textContent = CONFIG.celebration.message;
      document.getElementById("celebration-sub").textContent = CONFIG.celebration.subMessage;

      // Audio
      if (CONFIG.audio.enabled) {
        const audio = document.getElementById("celebration-audio");
        audio.src = CONFIG.audio.src;
        audio.loop = CONFIG.audio.loop;
        audio.play().catch(() => {
          /* Autoplay blocked — user can interact to play */
        });
      }

      // Floating hearts
      startHearts();

      // Ambient starfield
      const bgCanvas = document.getElementById("starfield-bg-2");
      ambientStars = createAmbientStarfield(bgCanvas, 120);
      ambientStars.init();
      ambientStars.start();
    }

    /** Spawn floating heart elements periodically. */
    function startHearts() {
      const container = document.getElementById("hearts-container");
      const heartEmojis = ["💖", "💕", "💗", "💘", "💝", "❤️", "💓"];

      heartsInterval = setInterval(() => {
        const heart = document.createElement("div");
        heart.classList.add("floating-heart");
        heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];

        // Random horizontal position
        heart.style.left = Math.random() * 100 + "%";

        // Random duration and delay
        const duration = 3 + Math.random() * 4;
        heart.style.setProperty("--heart-duration", duration + "s");
        heart.style.setProperty("--heart-delay", Math.random() * 0.5 + "s");
        heart.style.fontSize = (1 + Math.random() * 1.4) + "rem";

        container.appendChild(heart);

        // Remove after animation ends to prevent DOM bloat
        heart.addEventListener("animationend", () => {
          heart.remove();
        });
      }, 400);
    }

    return { init };
  })();


  /* ═══════════════════════════════════════════════════════════
     BOOTSTRAP
     Wait for fonts to load, then initialize Screen 1.
     ═══════════════════════════════════════════════════════════ */

  document.fonts.ready.then(() => {
    // ── Set continue button text from config ──
    const continueBtn = document.getElementById("btn-continue");
    continueBtn.textContent = CONFIG.continueButtonText;

    // ── Initialize and start the main starfield ──
    const mainCanvas = document.getElementById("starfield");
    Starfield.init(mainCanvas);
    Starfield.start();

    // ── Continue button → transition to proposal ──
    continueBtn.addEventListener("click", () => {
      Starfield.destroy();
      ScreenManager.transitionTo("screen-proposal", () => {
        Proposal.init();
      });
    });
  });

})();
