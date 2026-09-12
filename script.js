/* =========================================================
   PROJECTS
   ========================================================= */
const projects = [
  {
    title: "Personal Portfolio",
    description: "A site built from scratch with HTML, CSS and JavaScript, including a small browser game.",
    tags: ["HTML", "CSS", "JavaScript"],
    link: "#top",
    status: "live"
  },
  {
    title: "In progress",
    description: "New project — details coming soon.",
    tags: ["Coming soon"],
    status: "planned"
  }
];

function renderProjects() {
  const grid = document.getElementById("project-grid");
  if (!grid) return;

  grid.innerHTML = projects.map(project => {
    if (project.status === "planned") {
      return `
        <article class="project-card project-card--planned">
          <h3>${project.title}</h3>
          <p>${project.description}</p>
          <div class="project-card__tags">
            ${project.tags.map(tag => `<span>${tag}</span>`).join("")}
          </div>
        </article>
      `;
    }
    return `
      <article class="project-card">
        <h3>${project.title}</h3>
        <p>${project.description}</p>
        <div class="project-card__tags">
          ${project.tags.map(tag => `<span>${tag}</span>`).join("")}
        </div>
        ${project.link ? `<a class="project-card__link" href="${project.link}">View →</a>` : ""}
      </article>
    `;
  }).join("");
}
renderProjects();

/* =========================================================
   HERO TYPEWRITER
   ========================================================= */
(function typewriter() {
  const el = document.getElementById("typed-text");
  if (!el) return;

  const lines = [
    "Building with code.",
    "Turning ideas into interfaces.",
    "Always learning something new."
  ];
  let lineIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function tick() {
    const current = lines[lineIndex];
    if (!deleting) {
      charIndex++;
      el.textContent = current.slice(0, charIndex);
      if (charIndex === current.length) {
        deleting = true;
        setTimeout(tick, 1600);
        return;
      }
    } else {
      charIndex--;
      el.textContent = current.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        lineIndex = (lineIndex + 1) % lines.length;
      }
    }
    setTimeout(tick, deleting ? 35 : 55);
  }
  tick();
})();

/* =========================================================
   SCROLLSPY NAV
   ========================================================= */
(function scrollspy() {
  const links = document.querySelectorAll("[data-nav]");
  const indicator = document.getElementById("nav-indicator");
  const sections = Array.from(links).map(link => document.querySelector(link.getAttribute("href")));
  if (!links.length || !indicator) return;

  function moveIndicator(link) {
    indicator.style.left = link.offsetLeft + "px";
    indicator.style.width = link.offsetWidth + "px";
    indicator.style.opacity = "1";
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const activeLink = document.querySelector(`[data-nav][href="#${entry.target.id}"]`);
        if (activeLink) {
          links.forEach(l => l.classList.remove("is-active"));
          activeLink.classList.add("is-active");
          moveIndicator(activeLink);
        }
      }
    });
  }, { rootMargin: "-40% 0px -55% 0px" });

  sections.forEach(section => { if (section) observer.observe(section); });
})();

/* =========================================================
   HERO PARTICLE NETWORK
   ========================================================= */
(function heroNetwork() {
  const canvas = document.getElementById("hero-network");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const hero = canvas.closest(".hero");

  let width, height, points;
  const POINT_COUNT = 46;
  const LINK_DIST = 130;

  function resize() {
    width = canvas.width = hero.offsetWidth;
    height = canvas.height = hero.offsetHeight;
  }

  function makePoints() {
    points = Array.from({ length: POINT_COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35
    }));
  }

  function frame() {
    ctx.clearRect(0, 0, width, height);

    points.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;
    });

    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const dx = points[i].x - points[j].x;
        const dy = points[i].y - points[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < LINK_DIST) {
          ctx.strokeStyle = `rgba(124, 154, 184, ${0.35 * (1 - dist / LINK_DIST)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(points[i].x, points[i].y);
          ctx.lineTo(points[j].x, points[j].y);
          ctx.stroke();
        }
      }
    }

    points.forEach(p => {
      ctx.fillStyle = "rgba(226, 58, 74, 0.7)";
      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.6, 0, Math.PI * 2);
      ctx.fill();
    });

    requestAnimationFrame(frame);
  }

  resize();
  makePoints();
  frame();
  window.addEventListener("resize", () => { resize(); makePoints(); });
})();

/* =========================================================
   PROJECT CARD TILT
   ========================================================= */
(function projectTilt() {
  const cards = document.querySelectorAll(".project-card:not(.project-card--planned)");
  cards.forEach(card => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `translateY(-5px) rotateX(${py * -8}deg) rotateY(${px * 8}deg)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "translateY(0) rotateX(0) rotateY(0)";
    });
  });
})();

/* =========================================================
   SPIDER MASCOT
   ========================================================= */
(function spiderMascot() {
  const spider = document.getElementById("spider");
  if (!spider) return;

  function scurry() {
    const margin = 60;
    const x = margin + Math.random() * (window.innerWidth - margin * 2);
    const y = margin + Math.random() * (window.innerHeight - margin * 2);
    spider.classList.add("is-scurrying");
    spider.style.left = x + "px";
    spider.style.top = y + "px";
    spider.style.right = "auto";
    spider.style.bottom = "auto";
  }

  spider.addEventListener("click", scurry);
  spider.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      scurry();
    }
  });
})();

/* =========================================================
   SNAKE GAME
   ========================================================= */
(function snakeGame() {
  const canvas = document.getElementById("game-board");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  const GRID_SIZE = 20;
  const CELL = canvas.width / GRID_SIZE;

  const COLORS = {
    board: "#14181F",
    boardAlt: "#1A1F28",
    snakeBody: "#C42B3A",
    snakeHead: "#E23A4A",
    apple: "#E8E8E0"
  };

  const overlay = document.getElementById("game-overlay");
  const overlayTitle = document.getElementById("overlay-title");
  const overlayText = document.getElementById("overlay-text");
  const startBtn = document.getElementById("game-start-btn");
  const scoreEl = document.getElementById("score");
  const bestScoreEl = document.getElementById("best-score");

  let snake, direction, nextDirection, apple, score, loopId, speedMs;
  const BEST_KEY = "prabinsays-snake-best";

  function loadBest() {
    const stored = parseInt(localStorage.getItem(BEST_KEY), 10);
    return Number.isFinite(stored) ? stored : 0;
  }
  bestScoreEl.textContent = loadBest();

  function resetState() {
    snake = [
      { x: 9, y: 10 },
      { x: 8, y: 10 },
      { x: 7, y: 10 }
    ];
    direction = { x: 1, y: 0 };
    nextDirection = direction;
    score = 0;
    speedMs = 130;
    scoreEl.textContent = score;
    placeApple();
  }

  function placeApple() {
    let position;
    do {
      position = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
    } while (snake.some(segment => segment.x === position.x && segment.y === position.y));
    apple = position;
  }

  function draw() {
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        ctx.fillStyle = (x + y) % 2 === 0 ? COLORS.board : COLORS.boardAlt;
        ctx.fillRect(x * CELL, y * CELL, CELL, CELL);
      }
    }

    ctx.fillStyle = COLORS.apple;
    ctx.beginPath();
    ctx.arc(apple.x * CELL + CELL / 2, apple.y * CELL + CELL / 2, CELL * 0.28, 0, Math.PI * 2);
    ctx.fill();

    snake.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? COLORS.snakeHead : COLORS.snakeBody;
      const pad = 3;
      ctx.beginPath();
      ctx.roundRect(
        segment.x * CELL + pad,
        segment.y * CELL + pad,
        CELL - pad * 2,
        CELL - pad * 2,
        5
      );
      ctx.fill();
    });
  }

  function step() {
    direction = nextDirection;
    const head = {
      x: snake[0].x + direction.x,
      y: snake[0].y + direction.y
    };

    const hitsWall = head.x < 0 || head.y < 0 || head.x >= GRID_SIZE || head.y >= GRID_SIZE;
    const hitsSelf = snake.some(segment => segment.x === head.x && segment.y === head.y);

    if (hitsWall || hitsSelf) {
      endGame();
      return;
    }

    snake.unshift(head);

    if (head.x === apple.x && head.y === apple.y) {
      score += 1;
      scoreEl.textContent = score;
      speedMs = Math.max(70, speedMs - 3);
      placeApple();
      clearInterval(loopId);
      loopId = setInterval(step, speedMs);
    } else {
      snake.pop();
    }

    draw();
  }

  function endGame() {
    clearInterval(loopId);
    const best = loadBest();
    if (score > best) {
      localStorage.setItem(BEST_KEY, String(score));
      bestScoreEl.textContent = score;
      overlayTitle.textContent = "New best!";
      overlayText.textContent = `You scored ${score} — a new personal best.`;
    } else {
      overlayTitle.textContent = "Game over";
      overlayText.textContent = `You scored ${score}. Best so far is ${best}.`;
    }
    startBtn.textContent = "Try again";
    overlay.classList.remove("is-hidden");
  }

  function startGame() {
    resetState();
    overlay.classList.add("is-hidden");
    draw();
    clearInterval(loopId);
    loopId = setInterval(step, speedMs);
  }

  startBtn.addEventListener("click", startGame);

  window.addEventListener("keydown", (event) => {
    const key = event.key.toLowerCase();
    const goingVertical = direction.y !== 0;
    const goingHorizontal = direction.x !== 0;

    if ((key === "arrowup" || key === "w") && !goingVertical) {
      nextDirection = { x: 0, y: -1 };
    } else if ((key === "arrowdown" || key === "s") && !goingVertical) {
      nextDirection = { x: 0, y: 1 };
    } else if ((key === "arrowleft" || key === "a") && !goingHorizontal) {
      nextDirection = { x: -1, y: 0 };
    } else if ((key === "arrowright" || key === "d") && !goingHorizontal) {
      nextDirection = { x: 1, y: 0 };
    } else {
      return;
    }
    event.preventDefault();
  });

  document.querySelectorAll(".game__pad").forEach(pad => {
    pad.addEventListener("click", () => {
      const dir = pad.dataset.dir;
      const goingVertical = direction.y !== 0;
      const goingHorizontal = direction.x !== 0;
      if (dir === "up" && !goingVertical) nextDirection = { x: 0, y: -1 };
      if (dir === "down" && !goingVertical) nextDirection = { x: 0, y: 1 };
      if (dir === "left" && !goingHorizontal) nextDirection = { x: -1, y: 0 };
      if (dir === "right" && !goingHorizontal) nextDirection = { x: 1, y: 0 };
    });
  });

  resetState();
  draw();
})();
