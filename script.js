const canvas = document.getElementById('bg');
const ctx = canvas.getContext('2d', { alpha: true });
let w, h, dpr;
const particles = [];
const P_COUNT = 50;
let t = 0;
let color = 'rgba(11,11,20,0.12)';
const mouse = { x: 0, y: 0, vx: 0, vy: 0, down: false };
const cursorEl = document.querySelector('.cursor');

function resize() {
  w = canvas.width = innerWidth * devicePixelRatio;
  h = canvas.height = innerHeight * devicePixelRatio;
  dpr = devicePixelRatio || 1;
  canvas.style.width = innerWidth + 'px';
  canvas.style.height = innerHeight + 'px';
}
addEventListener('resize', resize);
resize();

function rand(a, b) { return a + Math.random() * (b - a); }

// class Particle {
//   constructor(i) {
//     this.reset(true);
//     this.i = i;
//   }
//   reset(randomPos = false) {
//     this.x = randomPos ? rand(0, w) : (w / 2 + rand(-50, 50));
//     this.y = randomPos ? rand(0, h) : (h / 2 + rand(-50, 50));
//     this.baseSpeed = rand(0.2, 0.8);
//     this.amp = rand(6, 30);
//     this.theta = rand(0, Math.PI * 2);
//     this.size = rand(0.8, 2.2) * dpr;
//     this.hue = rand(250, 320); // purples
    
//   }
//   step(dt) {
//     // Flow field using sin/cos of position and time for organic motion
//     const nx = (this.x / w) * 2 - 1;
//     const ny = (this.y / h) * 2 - 1;
//     const angle =
//       Math.sin(nx * 3.1 + t * 0.0007) * 1.7 +
//       Math.cos(ny * 2.3 - t * 0.0009) * 1.4 +
//       Math.sin((nx + ny) * 1.5 + t * 0.0005) * 0.7;

//     const spd = this.baseSpeed + 0.6;
//     this.vx = Math.cos(angle) * spd + Math.sin(this.theta) * (this.amp * 0.01);
//     this.vy = Math.sin(angle) * spd + Math.cos(this.theta) * (this.amp * 0.01);

//     // Mouse influence
//     const dx = (mouse.x * dpr) - this.x;
//     const dy = (mouse.y * dpr) - this.y;
//     const dist2 = dx * dx + dy * dy;
//     const R = 160 * dpr;
//     if (dist2 < R * R) {
//       const f = (1 - dist2 / (R * R)) * 0.9;
//       this.vx += (dx / Math.sqrt(dist2 + 1)) * f * (mouse.down ? 2.0 : 0.6);
//       this.vy += (dy / Math.sqrt(dist2 + 1)) * f * (mouse.down ? 2.0 : 0.6);
//       this.hue = 200 + (dist2 % 120); // subtle hue shift near cursor
//     }

//     this.x += this.vx;
//     this.y += this.vy;
//     this.theta += 0.02;

//     if (this.x < -20 || this.x > w + 20 || this.y < -20 || this.y > h + 20) {
//       this.reset(true);
//     }
//   }
//   draw() {
//     ctx.beginPath();
//     ctx.fillStyle = `hsla(${this.hue}, 90%, 65%, 0.06)`;
//     ctx.arc(this.x, this.y, this.size * 2.0, 0, Math.PI * 2);
//     ctx.fill();

//     ctx.beginPath();
//     ctx.fillStyle = `hsla(${this.hue + 40}, 90%, 55%, 0.08)`;
//     ctx.arc(this.x + 1, this.y + 1, this.size * 1.2, 0, Math.PI * 2);
//     ctx.fill();
//   }
// }

// for (let i = 0; i < P_COUNT; i++) particles.push(new Particle(i));

function loop(ts) {
  t = ts;
  // Trail effect
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, w, h);
  ctx.globalCompositeOperation = 'lighter';

  for (let p of particles) {
    p.step(ts);
    p.draw();
  }

  ctx.globalCompositeOperation = 'xor';
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

// Cursor
addEventListener('pointermove', (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
  cursorEl.style.left = e.clientX + 'px';
  cursorEl.style.top = e.clientY + 'px';
});
addEventListener('pointerdown', () => { mouse.down = true; cursorEl.style.width = '36px'; cursorEl.style.height = '36px'; });
addEventListener('pointerup', () => { mouse.down = false; cursorEl.style.width = '22px'; cursorEl.style.height = '22px'; });

// Reveal on scroll via IntersectionObserver
const io = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (entry.isIntersecting) entry.target.classList.add('in');
  }
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Magnetic buttons/cards
function addMagnet(el, strength = 0.25) {
  const r = el.getBoundingClientRect();
  el.addEventListener('pointermove', (e) => {
    const x = ((e.clientX - r.left) / r.width - 0.5) * 2;
    const y = ((e.clientY - r.top) / r.height - 0.5) * 2;
    el.style.transform = `translate(${x * 8 * strength}px, ${y * 8 * strength}px)`;
  });
  el.addEventListener('pointerleave', () => {
    el.style.transform = 'translate(0,0)';
  });
}
document.querySelectorAll('.magnetic, .card').forEach(el => addMagnet(el, el.classList.contains('card') ? 0.15 : 0.35));

// Theme toggle
const toggle = document.querySelector('.theme-toggle');
toggle.addEventListener('click', () => {
  document.body.classList.toggle('light')
  if (document.body.classList.contains('light')) {
    color = 'rgba(255, 255, 255, 0.18)';
  } else {
    color = 'rgba(11,11,20,0.12)';
  }
});

// Year
document.getElementById('year').textContent = new Date().getFullYear();

const lt = () => {
  fetch(`https://leetcode-stats-api.herokuapp.com/anisul770`)
  .then(data => data.json()).then(data =>{
    const div = document.getElementById("leetcode");
    div.innerText = `${data['totalSolved']}+`
  });
};
lt();