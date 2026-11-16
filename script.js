// ---- Edit your trailer here ------------------------------------------------
// One entry per scene. "text" is the caption (write your own lines),
// "ms" is how long the scene lasts. The last scene is the title card.
const SCENES = [
  { text: "A story that begins far from everywhere…", ms: 5000 },
  { text: "…with a drawing, and a small traveler.", ms: 5500 },
  { text: "Every star holds a different kind of loneliness.", ms: 6000 },
  { text: "And every journey teaches what is worth keeping.", ms: 6000 },
  { text: "A tale for children, and for everyone who used to be one.", ms: 6000 },
  { text: "", ms: 8000 } // title card
];
// ---------------------------------------------------------------------------

const stage = document.getElementById("stage");
const caption = document.getElementById("caption");
const bar = document.getElementById("bar");
const canvas = document.getElementById("sky");
const ctx = canvas.getContext("2d");

let stars = [], shooters = [], W = 0, H = 0, running = true;

function resize() {
  const r = canvas.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  W = canvas.width = Math.round(r.width * dpr);
  H = canvas.height = Math.round(r.height * dpr);
  stars = Array.from({ length: 140 }, () => ({
    x: Math.random() * W, y: Math.random() * H * 0.9,
    r: (Math.random() * 1.4 + 0.4) * dpr,
    p: Math.random() * Math.PI * 2, s: Math.random() * 0.02 + 0.006,
    warm: Math.random() < 0.15
  }));
}
window.addEventListener("resize", resize);
resize();

function frame() {
  ctx.clearRect(0, 0, W, H);
  for (const s of stars) {
    s.p += s.s;
    ctx.globalAlpha = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(s.p));
    ctx.fillStyle = s.warm ? "#ffe29a" : "#f6e7c8";
    ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 6.283); ctx.fill();
  }
  if (Math.random() < 0.012) {
    shooters.push({ x: Math.random() * W * 1.2, y: -20, v: (6 + Math.random() * 4) * (W / 900), life: 1 });
  }
  shooters = shooters.filter(m => m.life > 0);
  for (const m of shooters) {
    m.x -= m.v; m.y += m.v; m.life -= 0.012;
    ctx.globalAlpha = Math.max(m.life, 0);
    ctx.strokeStyle = "#ffd98a"; ctx.lineWidth = 2 * (W / 900);
    ctx.beginPath(); ctx.moveTo(m.x, m.y); ctx.lineTo(m.x + 60 * (W / 900), m.y - 60 * (W / 900)); ctx.stroke();
  }
  ctx.globalAlpha = 1;
  if (running) requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

let timer = null;
function play(i) {
  const scene = SCENES[i];
  stage.dataset.scene = i;
  caption.classList.remove("on");
  setTimeout(() => { caption.textContent = scene.text; if (scene.text) caption.classList.add("on"); }, 500);
  bar.style.transition = "none"; bar.style.width = "0"; void bar.offsetWidth;
  bar.style.transition = `width ${scene.ms}ms linear`; bar.style.width = "100%";
  timer = setTimeout(() => play((i + 1) % SCENES.length), scene.ms);
}
function start() { clearTimeout(timer); play(0); }

document.getElementById("replay").addEventListener("click", start);
document.addEventListener("keydown", e => { if (e.code === "Space") { e.preventDefault(); start(); } });
start();
