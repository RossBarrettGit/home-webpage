// ========== GITHUB ==========
function github(){
  window.open("https://github.com/RossBarrettGit", "_blank");
}

// ========== BURGER MENU ==========
function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  if (sidebar.style.left === "0px") {
    sidebar.style.left = "-200px";
  } else {
    sidebar.style.left = "0px";
  }
}

// ========== FLOATING DOT NETWORK + MOUSE REPULSION WITH RECOVERY ==========
const canvas = document.getElementById("floating-lines");
const ctx = canvas.getContext("2d");

let width = window.innerWidth;
let height = window.innerHeight;
canvas.width = width;
canvas.height = height;

window.addEventListener("resize", () => {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
});

// Mouse tracking
const mouse = {
  x: null,
  y: null,
  radius: 100
};

window.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

window.addEventListener("mouseout", () => {
  mouse.x = null;
  mouse.y = null;
});

const numDots = 100;
const maxDistance = 120;
const dots = [];

class Dot {
  constructor() {
    this.spawnRandom();
    this.radius = Math.random() * 2 + 1;
    this.maxLife = 1000; // frames before respawn (~10 seconds at 60fps)
    this.life = Math.floor(Math.random() * this.maxLife); // random start life for staggered respawn
  }

  spawnRandom() {
    this.x = Math.random() * width;
    this.y = Math.random() * height;

    this.vx = (Math.random() - 0.5) * 0.8;
    this.vy = (Math.random() - 0.5) * 0.8;

    this.baseVx = this.vx;
    this.baseVy = this.vy;
  }

  move() {
    this.life++;

    // Respawn if life exceeded
    if (this.life > this.maxLife) {
      this.spawnRandom();
      this.life = 0;
    }

    // Repulsion
    if (mouse.x !== null && mouse.y !== null) {
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < mouse.radius) {
        const angle = Math.atan2(dy, dx);
        const force = (mouse.radius - dist) / mouse.radius;
        const repelStrength = 2;

        this.vx += Math.cos(angle) * force * repelStrength;
        this.vy += Math.sin(angle) * force * repelStrength;
      }
    }

    // Gradually return to base velocity
    const recoverySpeed = 0.01;
    this.vx += (this.baseVx - this.vx) * recoverySpeed;
    this.vy += (this.baseVy - this.vy) * recoverySpeed;

    this.x += this.vx;
    this.y += this.vy;

    // Bounce off edges
    if (this.x <= 0 || this.x >= width) this.vx *= -1;
    if (this.y <= 0 || this.y >= height) this.vy *= -1;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = "#ff5f1f";
    ctx.fill();
  }
}

// Initialize dots
for (let i = 0; i < numDots; i++) {
  dots.push(new Dot());
}

function connectDots() {
  for (let i = 0; i < dots.length; i++) {
    for (let j = i + 1; j < dots.length; j++) {
      const dx = dots[i].x - dots[j].x;
      const dy = dots[i].y - dots[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < maxDistance) {
        ctx.strokeStyle = "rgba(255, 95, 31," + (1 - distance / maxDistance) + ")";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(dots[i].x, dots[i].y);
        ctx.lineTo(dots[j].x, dots[j].y);
        ctx.stroke();
      }
    }
  }
}

function animate() {
  ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
  ctx.fillRect(0, 0, width, height);

  for (const dot of dots) {
    dot.move();
    dot.draw();
  }

  connectDots();
  requestAnimationFrame(animate);
}

animate();
