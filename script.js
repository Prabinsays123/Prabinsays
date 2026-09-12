/* =========================================================
   PROJECTS
   Add a new project any time by adding one object below.
   status: "live" shows a link button, "planned" shows a
   dashed placeholder card so the grid never looks empty.
   ========================================================= */
const projects = [
  {
    title: "This portfolio",
    description: "A nature-themed personal site, built with plain HTML, CSS and JavaScript — including the snake game below.",
    tags: ["HTML", "CSS", "JavaScript"],
    link: "#top",
    status: "live"
  },
  {
    title: "Your next project",
    description: "Replace this card with a real project once you've built one — a class assignment, a small tool, anything.",
    tags: ["Coming soon"],
    status: "planned"
  },
  {
    title: "Room to grow",
    description: "Add as many of these as you like. Just copy an object in the `projects` array at the top of script.js.",
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
   SNAKE GAME
   ========================================================= */
(function snakeGame() {
  const canvas = document.getElementById("game-board");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  const GRID_SIZE = 20;
  const CELL = canvas.width / GRID_SIZE;

  const COLORS = {
    board: "#E4EDD9",
    boardAlt: "#DCE7CE",
    snake: "#4A6B4E",
    snakeHead: "#2F4538",
    berry: "#C4544B"
  };

  const overlay = document.getElementById("game-overlay");
  const overlayTitle = document.getElementById("overlay-title");
  const overlayText = document.getElementById("overlay-text");
  const startBtn = document.getElementById("game-start-btn");
  const scoreEl = document.getElementById("score");
  const bestScoreEl = document.getElementById("best-score");

  let snake, direction, nextDirection, berry, score, loopId, speedMs;
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
    placeBerry();
  }

  function placeBerry() {
    let position;
    do {
      position = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
    } while (snake.some(segment => segment.x === position.x && segment.y === position.y));
    berry = position;
  }

  function draw() {
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        ctx.fillStyle = (x + y) % 2 === 0 ? COLORS.board : COLORS.boardAlt;
        ctx.fillRect(x * CELL, y * CELL, CELL, CELL);
      }
    }

    ctx.fillStyle = COLORS.berry;
    ctx.beginPath();
    ctx.arc(
      berry.x * CELL + CELL / 2,
      berry.y * CELL + CELL / 2,
      CELL * 0.35,
      0,
      Math.PI * 2
    );
    ctx.fill();

    snake.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? COLORS.snakeHead : COLORS.snake;
      const pad = 2;
      ctx.beginPath();
      ctx.roundRect(
        segment.x * CELL + pad,
        segment.y * CELL + pad,
        CELL - pad * 2,
        CELL - pad * 2,
        6
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

    if (head.x === berry.x && head.y === berry.y) {
      score += 1;
      scoreEl.textContent = score;
      speedMs = Math.max(70, speedMs - 3);
      placeBerry();
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
      overlayText.textContent = `You scored ${score}. That's a new personal best.`;
    } else {
      overlayTitle.textContent = "Back to the soil";
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

  // Draw an idle preview board before the first game starts.
  resetState();
  draw();
})();
