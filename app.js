const canvas = document.querySelector("#field");
const ctx = canvas.getContext("2d");

const sources = [
  ["NASA Mars Facts", "https://science.nasa.gov/mars/facts/"],
  ["NASA Mars Exploration", "https://mars.nasa.gov/"],
  ["NASA Europa Facts", "https://science.nasa.gov/jupiter/jupiter-moons/europa/europa-facts/"],
  ["NASA Europa Clipper Mission Science", "https://science.nasa.gov/mission/europa-clipper/mission-science/"],
  ["NASA Cassini Enceladus", "https://science.nasa.gov/mission/cassini/science/enceladus/"]
];

const baseWorlds = {
  mars: {
    name: "화성",
    tag: "평균 표면 온도 약 -65°C, 저압·건조·방사선",
    color: "#d96f4a",
    note: "화성의 평균 표면 온도와 낮은 대기압은 NASA Facts를 기준으로 두었습니다. 지하 얼음층과 염수 주머니는 보고서용 개념 모델입니다.",
    anchors: [
      { id: "surface", name: "표면", x: 0.30, y: 0.34, temp: -65, pressure: 0.006, radiation: 92, salinity: 14, water: 6, chemical: 15, oxygen: 0, organics: 12 },
      { id: "ice", name: "지하 얼음층", x: 0.46, y: 0.73, temp: -35, pressure: 0.35, radiation: 22, salinity: 22, water: 42, chemical: 24, oxygen: 0, organics: 20 },
      { id: "brine", name: "염수 주머니", x: 0.70, y: 0.66, temp: -20, pressure: 0.6, radiation: 18, salinity: 58, water: 54, chemical: 32, oxygen: 0, organics: 24 }
    ]
  },
  europa: {
    name: "유로파",
    tag: "표면 약 -160°C, 얼음 아래 바다 가능성",
    color: "#bfe9f5",
    note: "유로파의 표면 온도와 지하 바다 가능성은 NASA 자료를 기준으로 두었습니다. 바다 내부 염도·열수구 수치는 개념 모델 추정값입니다.",
    anchors: [
      { id: "ice", name: "얼음 지각", x: 0.34, y: 0.20, temp: -160, pressure: 4, radiation: 70, salinity: 18, water: 28, chemical: 14, oxygen: 1, organics: 14 },
      { id: "ocean", name: "지하 바다", x: 0.46, y: 0.52, temp: -5, pressure: 720, radiation: 4, salinity: 48, water: 96, chemical: 58, oxygen: 1, organics: 42 },
      { id: "vent", name: "해저 열수구", x: 0.70, y: 0.77, temp: 25, pressure: 760, radiation: 1, salinity: 42, water: 98, chemical: 88, oxygen: 0, organics: 56 }
    ]
  },
  enceladus: {
    name: "엔셀라두스",
    tag: "지하 바다·분출기둥·수소/유기물 관측",
    color: "#dff7ff",
    note: "엔셀라두스의 지하 바다, 분출기둥, 수소와 유기물 관측은 NASA Cassini 자료를 기준으로 했습니다. 내부 구역 수치는 개념 모델 추정값입니다.",
    anchors: [
      { id: "ice", name: "얼음 지각", x: 0.32, y: 0.20, temp: -160, pressure: 2, radiation: 24, salinity: 12, water: 24, chemical: 18, oxygen: 0, organics: 20 },
      { id: "ocean", name: "지하 바다", x: 0.47, y: 0.52, temp: -3, pressure: 520, radiation: 3, salinity: 36, water: 94, chemical: 74, oxygen: 0, organics: 68 },
      { id: "vent", name: "열수 활동부", x: 0.68, y: 0.76, temp: 18, pressure: 560, radiation: 1, salinity: 34, water: 98, chemical: 94, oxygen: 0, organics: 76 }
    ]
  }
};

const microbes = {
  deinococcus: {
    name: "데이노코쿠스",
    tag: "방사선 손상 DNA 복구",
    color: "#ff6b6b",
    ideal: { temp: 20, pressure: 1, radiation: 85, salinity: 16, water: 34, chemical: 24, oxygen: 6, organics: 28 },
    tolerance: { temp: 90, pressure: 90, radiation: 45, salinity: 38, water: 48, chemical: 50, oxygen: 22, organics: 52 },
    effect: { organics: 0.06, shield: 0.035 }
  },
  psychrobacter: {
    name: "사이크로박터",
    tag: "저온 세포막 적응",
    color: "#78aee8",
    ideal: { temp: -10, pressure: 1, radiation: 22, salinity: 18, water: 62, chemical: 28, oxygen: 4, organics: 32 },
    tolerance: { temp: 38, pressure: 180, radiation: 58, salinity: 42, water: 42, chemical: 52, oxygen: 20, organics: 52 },
    effect: { organics: 0.04 }
  },
  methanogen: {
    name: "메탄생성균",
    tag: "무산소 화학대사",
    color: "#83d768",
    ideal: { temp: 2, pressure: 470, radiation: 2, salinity: 34, water: 92, chemical: 92, oxygen: 0, organics: 60 },
    tolerance: { temp: 58, pressure: 370, radiation: 24, salinity: 36, water: 28, chemical: 24, oxygen: 5, organics: 44 },
    effect: { methane: 0.2, organics: 0.045, chemical: -0.08 }
  },
  halobacterium: {
    name: "할로박테리움",
    tag: "고염 삼투압 조절",
    color: "#f18ac9",
    ideal: { temp: 25, pressure: 1, radiation: 28, salinity: 72, water: 62, chemical: 42, oxygen: 2, organics: 36 },
    tolerance: { temp: 60, pressure: 200, radiation: 60, salinity: 24, water: 38, chemical: 48, oxygen: 16, organics: 48 },
    effect: { organics: 0.055, salinity: -0.025 }
  },
  vent: {
    name: "열수구 화학합성균",
    tag: "고압·무산소·화학합성",
    color: "#59d6d6",
    ideal: { temp: 18, pressure: 620, radiation: 1, salinity: 36, water: 98, chemical: 96, oxygen: 0, organics: 62 },
    tolerance: { temp: 70, pressure: 330, radiation: 20, salinity: 30, water: 22, chemical: 20, oxygen: 6, organics: 36 },
    effect: { organics: 0.18, chemical: -0.06, biomass: 0.12 }
  }
};

const sliderDefs = [
  { key: "temp", label: "온도 보정", min: -80, max: 80, value: 0, unit: "°C" },
  { key: "radiation", label: "방사선 보정", min: -60, max: 60, value: 0, unit: "" },
  { key: "salinity", label: "염도 보정", min: -50, max: 50, value: 0, unit: "" },
  { key: "chemical", label: "화학에너지 보정", min: -50, max: 50, value: 0, unit: "" }
];

let selectedWorld = "mars";
let selectedMicrobe = "deinococcus";
let adjustments = Object.fromEntries(sliderDefs.map((d) => [d.key, d.value]));
let world = copy(baseWorlds[selectedWorld]);
let sim;
let running = false;
let timer = null;
let time = 0;

function copy(obj) { return JSON.parse(JSON.stringify(obj)); }
function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
function closeness(value, ideal, tol) { return clamp(1 - Math.abs(value - ideal) / tol, 0, 1); }

function applyAdjustments() {
  world = copy(baseWorlds[selectedWorld]);
  for (const a of world.anchors) {
    a.temp += adjustments.temp;
    a.radiation = clamp(a.radiation + adjustments.radiation, 0, 100);
    a.salinity = clamp(a.salinity + adjustments.salinity, 0, 100);
    a.chemical = clamp(a.chemical + adjustments.chemical, 0, 100);
  }
}

function envAt(x, y) {
  const weighted = world.anchors.map((a) => ({ a, w: 1 / ((x - a.x) ** 2 + (y - a.y) ** 2 + 0.018) }));
  const total = weighted.reduce((s, item) => s + item.w, 0);
  const env = {};
  for (const k of ["temp", "pressure", "radiation", "salinity", "water", "chemical", "oxygen", "organics"]) {
    env[k] = weighted.reduce((s, item) => s + item.a[k] * item.w, 0) / total;
  }
  env.radiation = Math.max(0, env.radiation - sim.shield);
  return env;
}

function suitability(x, y, microbe = microbes[selectedMicrobe]) {
  const env = envAt(x, y);
  const weights = { temp: 1, pressure: 0.8, radiation: 1, salinity: 0.78, water: 1.25, chemical: 1.12, oxygen: 0.55, organics: 0.65 };
  let sum = 0, total = 0;
  for (const k of Object.keys(weights)) {
    sum += closeness(env[k], microbe.ideal[k], microbe.tolerance[k]) * weights[k];
    total += weights[k];
  }
  return clamp(sum / total, 0, 1);
}

function localBest(cell) {
  const steps = [[0,0],[.035,0],[-.035,0],[0,.035],[0,-.035],[.025,.025],[-.025,.025],[.025,-.025],[-.025,-.025]];
  let best = { x: cell.x, y: cell.y, fit: suitability(cell.x, cell.y) };
  for (const [dx, dy] of steps) {
    const x = clamp(cell.x + dx, 0.05, 0.95);
    const y = clamp(cell.y + dy, 0.07, 0.93);
    const fit = suitability(x, y);
    if (fit > best.fit) best = { x, y, fit };
  }
  return best;
}

function resetSim() {
  applyAdjustments();
  sim = {
    year: 0,
    products: 0,
    methane: 0,
    organics: 0,
    shield: 0,
    cells: Array.from({ length: 95 }, () => ({
      x: 0.08 + Math.random() * 0.84,
      y: 0.12 + Math.random() * 0.76,
      active: false,
      alive: true,
      energy: 0.45 + Math.random() * 0.4,
      wobble: Math.random() * Math.PI * 2
    }))
  };
  updateText();
}

function stepSim(years = 100) {
  for (let y = 0; y < years; y += 10) {
    let births = 0;
    const microbe = microbes[selectedMicrobe];
    for (const cell of sim.cells) {
      if (!cell.alive) continue;
      const best = localBest(cell);
      cell.x = clamp(cell.x + (best.x - cell.x) * 0.75 + (Math.random() - .5) * .012, .05, .95);
      cell.y = clamp(cell.y + (best.y - cell.y) * 0.75 + (Math.random() - .5) * .012, .07, .93);
      const env = envAt(cell.x, cell.y);
      const fit = suitability(cell.x, cell.y, microbe);
      const resource = Math.min(env.water / 45, env.chemical / 35);
      const stress = 1 - fit;
      cell.active = fit > .5 && env.water > 24 && env.chemical > 12;
      cell.energy = clamp(cell.energy + (cell.active ? fit * resource * .055 : -.12 - stress * .09), 0, 1.25);
      const deathChance = (fit < .42 || env.water < 14 || env.chemical < 12) ? .22 + stress * .34 : stress * .05;
      if (cell.energy <= .08 || Math.random() < deathChance) cell.alive = false;
      if (cell.alive && cell.active && cell.energy > 1.02 && Math.random() < fit * resource * .06) {
        cell.energy *= .55;
        births += 1;
      }
    }
    const living = sim.cells.filter((c) => c.alive);
    for (let i = 0; i < births && sim.cells.length < 150; i++) {
      const parent = living[Math.floor(Math.random() * living.length)];
      if (!parent) break;
      sim.cells.push({ ...parent, x: clamp(parent.x + (Math.random() - .5) * .04, .05, .95), y: clamp(parent.y + (Math.random() - .5) * .04, .07, .93), energy: .45, wobble: Math.random() * Math.PI * 2 });
    }
    applyMicrobeEffects();
    sim.year += 10;
  }
  updateText();
}

function applyMicrobeEffects() {
  const microbe = microbes[selectedMicrobe];
  const active = sim.cells.filter((c) => c.alive && c.active).length;
  const amount = active / 60;
  sim.products = clamp(sim.products + amount * 1.45, 0, 100);
  sim.organics = clamp(sim.organics + (microbe.effect.organics || 0) * active / 2, 0, 100);
  sim.methane = clamp(sim.methane + (microbe.effect.methane || 0) * active / 2, 0, 100);
  sim.shield = clamp(sim.shield + (microbe.effect.shield || 0) * active / 2 + sim.methane * .001, 0, 60);
}

function stats() {
  const living = sim.cells.filter((c) => c.alive);
  const active = living.filter((c) => c.active);
  const terraform = clamp(Math.round(sim.products * .34 + sim.organics * .26 + sim.methane * .24 + sim.shield * .16), 0, 100);
  return { living: living.length, active: active.length, product: Math.round(sim.products), terraform };
}

function renderChoices() {
  document.querySelector("#worldChoices").innerHTML = Object.entries(baseWorlds).map(([key, w]) => `
    <button class="choice ${key === selectedWorld ? "active" : ""}" data-world="${key}" type="button"><strong>${w.name}</strong><span>${w.tag}</span></button>
  `).join("");
  document.querySelector("#microbeChoices").innerHTML = Object.entries(microbes).map(([key, m]) => `
    <button class="choice ${key === selectedMicrobe ? "active" : ""}" data-microbe="${key}" type="button"><strong>${m.name}</strong><span>${m.tag}</span></button>
  `).join("");
}

function renderSliders() {
  document.querySelector("#sliders").innerHTML = sliderDefs.map((d) => `
    <label class="slider-row"><span>${d.label}<b id="${d.key}Value">${adjustments[d.key]}${d.unit}</b></span><input type="range" data-adjust="${d.key}" min="${d.min}" max="${d.max}" value="${adjustments[d.key]}"></label>
  `).join("");
}

function updateText() {
  const s = stats();
  document.querySelector("#yearValue").textContent = sim.year;
  for (const [key, value] of Object.entries({ population: s.living, active: s.active, product: s.product, terraform: s.terraform })) {
    document.querySelector(`#${key}Value`).textContent = value;
    document.querySelector(`#${key}Bar`).style.width = `${clamp(value, 0, 100)}%`;
  }
  for (const d of sliderDefs) {
    const el = document.querySelector(`#${d.key}Value`);
    if (el) el.textContent = `${adjustments[d.key]}${d.unit}`;
  }
  const microbe = microbes[selectedMicrobe];
  document.querySelector("#zoneReadout").innerHTML = world.anchors.map((a) => {
    const fit = Math.round(suitability(a.x, a.y, microbe) * 100);
    return `<div class="row"><span>${a.name}</span><strong>${fit}/100</strong></div>`;
  }).join("");
  document.querySelector("#verdict").textContent = verdict(s);
  document.querySelector("#modelNote").textContent = world.note;
  document.querySelector("#sourceLinks").innerHTML = sources.map(([label, url]) => `<a href="${url}" target="_blank" rel="noreferrer">${label}</a>`).join("");
}

function verdict(s) {
  const name = microbes[selectedMicrobe].name;
  if (s.living < 8) return `${name} 군집이 대부분 사라졌습니다. 현재 조절값에서는 적합한 온도·물·에너지 영역이 부족합니다.`;
  if (s.active > 40 && s.terraform > 45) return `${name} 군집이 적합한 영역으로 모여 활성 대사를 하고 있습니다. 대사산물이 누적되어 테라포밍 논의가 가능합니다.`;
  if (s.active > 15) return `${name} 일부가 적합한 미세환경에서 활성화되었습니다. 생존과 테라포밍은 별개의 조건임을 보여줍니다.`;
  return `${name}은 일부 생존하지만 대부분 휴면 상태입니다. 슬라이더를 조절해 병목 조건을 확인할 수 있습니다.`;
}

function draw() {
  time += .012;
  drawBackground();
  drawScene();
  drawOverlay();
  requestAnimationFrame(draw);
}

function drawBackground() {
  const g = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  g.addColorStop(0, "#071012");
  g.addColorStop(.55, "#0b171a");
  g.addColorStop(1, "#090d0e");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawScene() {
  const f = { x: 56, y: 118, w: 620, h: 380 };
  roundRect(f.x, f.y, f.w, f.h, 10);
  ctx.fillStyle = "rgba(255,255,255,.035)";
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,.14)";
  ctx.stroke();
  selectedWorld === "mars" ? drawMars(f) : drawOcean(f);
  drawEnvironmentField(f);
  drawCells(f);
  drawProducts(f);
  drawProcessPanel();
  drawLegendPanel(f);
}

function drawMars(f) {
  const surface = f.y + f.h * .42;
  ctx.fillStyle = "rgba(217,111,74,.35)";
  ctx.fillRect(f.x, f.y, f.w, surface - f.y);
  ctx.fillStyle = "rgba(118,74,52,.98)";
  ctx.fillRect(f.x, surface, f.w, f.h - (surface - f.y));
  ctx.fillStyle = "rgba(126,174,232,.34)";
  ctx.fillRect(f.x + 72, f.y + f.h * .73, f.w - 144, 27);
  ctx.fillStyle = "rgba(241,138,201,.2)";
  roundRect(f.x + f.w * .56, f.y + f.h * .65, 165, 46, 23);
  ctx.fill();
  drawRadiation(f.x, f.y, f.w, world.anchors[0].radiation / 115);
}

function drawOcean(f) {
  const ice = selectedWorld === "europa" ? 95 : 60;
  const rock = f.y + f.h - 90;
  ctx.fillStyle = "rgba(220,247,255,.96)";
  ctx.fillRect(f.x, f.y, f.w, ice);
  ctx.fillStyle = "rgba(89,214,214,.32)";
  ctx.fillRect(f.x, f.y + ice, f.w, rock - f.y - ice);
  ctx.fillStyle = "rgba(56,43,35,.98)";
  ctx.fillRect(f.x, rock, f.w, f.y + f.h - rock);
  drawVent(f.x + f.w * .68, rock, 1);
  if (selectedWorld === "europa") drawRadiation(f.x, f.y, f.w, .34);
}

function drawRadiation(x, y, w, alpha) {
  ctx.strokeStyle = `rgba(228,111,98,${clamp(alpha, .1, .85)})`;
  ctx.lineWidth = 2;
  for (let i = 0; i < 16; i++) {
    const px = x + 28 + i * (w / 16);
    ctx.beginPath();
    ctx.moveTo(px, y - 10);
    ctx.lineTo(px + Math.sin(time * 3 + i) * 18, y + 86);
    ctx.stroke();
  }
}

function drawVent(x, baseY, scale) {
  ctx.fillStyle = "rgba(228,111,98,.9)";
  ctx.beginPath();
  ctx.moveTo(x - 20 * scale, baseY + 34 * scale);
  ctx.lineTo(x, baseY - 25 * scale);
  ctx.lineTo(x + 20 * scale, baseY + 34 * scale);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,.45)";
  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.moveTo(x + Math.sin(time * 5 + i) * 7, baseY - 24 - i * 18);
    ctx.bezierCurveTo(x - 24, baseY - 46 - i * 20, x + 20, baseY - 62 - i * 18, x + 4, baseY - 82 - i * 16);
    ctx.stroke();
  }
}

function drawEnvironmentField(f) {
  const microbe = microbes[selectedMicrobe];
  for (const a of world.anchors) {
    const p = toCanvas(a.x, a.y, f);
    const fit = suitability(a.x, a.y, microbe);
    const r = 48 + fit * 70;
    const g = ctx.createRadialGradient(p.x, p.y, 5, p.x, p.y, r);
    g.addColorStop(0, fit > .65 ? "rgba(131,215,104,.36)" : fit > .35 ? "rgba(233,189,93,.25)" : "rgba(228,111,98,.19)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(0,0,0,.48)";
    roundRect(p.x - 58, p.y - 34, 116, 28, 6);
    ctx.fill();
    ctx.fillStyle = fit > .65 ? "#83d768" : fit > .35 ? "#e9bd5d" : "#e46f62";
    ctx.font = "bold 12px Segoe UI";
    ctx.textAlign = "center";
    ctx.fillText(`${a.name} ${Math.round(fit * 100)}`, p.x, p.y - 16);
  }
  ctx.textAlign = "left";
}

function drawCells(f) {
  const microbe = microbes[selectedMicrobe];
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  for (const c of sim.cells) {
    if (!c.alive) continue;
    const p = toCanvas(c.x, c.y, f);
    ctx.fillStyle = c.active ? microbe.color : "rgba(185,195,195,.25)";
    ctx.beginPath();
    ctx.arc(p.x + Math.sin(time + c.wobble) * 3, p.y + Math.cos(time * .8 + c.wobble) * 3, c.active ? 5.8 : 3.2, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawProducts(f) {
  if (sim.products < 4) return;
  const labels = selectedMicrobe === "methanogen" ? ["CH4", "CO2 순환", "온실효과"] : selectedMicrobe === "vent" ? ["유기물", "황 순환", "먹이망"] : ["유기물", "미세환경", "대사산물"];
  const best = world.anchors.map((a) => ({ a, fit: suitability(a.x, a.y) })).sort((a, b) => b.fit - a.fit)[0].a;
  const p = toCanvas(best.x, best.y, f);
  for (let i = 0; i < labels.length; i++) {
    const x = p.x + 84;
    const y = p.y - 58 + i * 32 + Math.sin(time * 3 + i) * 4;
    ctx.fillStyle = `rgba(233,189,93,${.25 + sim.products / 150})`;
    roundRect(x, y, 110, 23, 11);
    ctx.fill();
    ctx.fillStyle = "#071013";
    ctx.font = "bold 12px Segoe UI";
    ctx.fillText(labels[i], x + 12, y + 16);
  }
}

function drawProcessPanel() {
  const s = stats();
  const items = [["탐색", 100, "#78aee8"], ["정착", s.living, "#59d6d6"], ["활성", s.active, "#83d768"], ["환경 변화", s.terraform, "#e9bd5d"]];
  const x = 710, y = 126, w = 250;
  for (let i = 0; i < items.length; i++) {
    const [name, value, color] = items[i];
    const yy = y + i * 88;
    ctx.fillStyle = "rgba(255,255,255,.045)";
    roundRect(x, yy, w, 64, 8);
    ctx.fill();
    ctx.strokeStyle = value > 35 ? color : "rgba(255,255,255,.14)";
    ctx.stroke();
    ctx.fillStyle = color;
    ctx.font = "bold 15px Segoe UI";
    ctx.fillText(name, x + 16, yy + 25);
    ctx.fillStyle = "#eef3ef";
    ctx.font = "bold 24px Segoe UI";
    ctx.fillText(String(Math.round(value)), x + w - 62, yy + 38);
    ctx.fillStyle = "rgba(255,255,255,.08)";
    roundRect(x + 16, yy + 42, 150, 8, 5);
    ctx.fill();
    ctx.fillStyle = color;
    roundRect(x + 16, yy + 42, 150 * clamp(value, 0, 100) / 100, 8, 5);
    ctx.fill();
  }
}

function drawLegendPanel(f) {
  const x = f.x + 6, y = 520;
  ctx.fillStyle = "rgba(0,0,0,.42)";
  roundRect(x, y, 610, 82, 10);
  ctx.fill();
  ctx.fillStyle = "#eef3ef";
  ctx.font = "14px Segoe UI";
  ctx.fillText("연속 환경장: 기준점 사이의 온도·방사선·염도·에너지를 보간", x + 18, y + 25);
  const labels = [["초록", "적합"], ["노랑", "부분 적합"], ["빨강", "부적합"], ["밝은 점", "활성 대사"]];
  labels.forEach(([a, b], i) => {
    const bx = x + 18 + i * 142;
    ctx.fillStyle = i === 0 ? "#83d768" : i === 1 ? "#e9bd5d" : i === 2 ? "#e46f62" : microbes[selectedMicrobe].color;
    ctx.beginPath();
    ctx.arc(bx, y + 54, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#9aa8a2";
    ctx.font = "12px Segoe UI";
    ctx.fillText(`${a}: ${b}`, bx + 12, y + 58);
  });
}

function drawOverlay() {
  ctx.fillStyle = "rgba(0,0,0,.52)";
  ctx.fillRect(24, 24, 490, 128);
  ctx.fillStyle = "#eef3ef";
  ctx.font = "16px Segoe UI";
  ctx.fillText(`${world.name} + ${microbes[selectedMicrobe].name}`, 44, 56);
  ctx.font = "13px Segoe UI";
  ctx.fillStyle = microbes[selectedMicrobe].color;
  ctx.fillText(`환경 보정: 온도 ${adjustments.temp}°C / 방사선 ${adjustments.radiation} / 염도 ${adjustments.salinity} / 에너지 ${adjustments.chemical}`, 44, 84);
  ctx.fillStyle = "#e9bd5d";
  ctx.fillText("개체는 연속 환경장에서 적합도가 높은 방향으로 이동", 44, 112);
  ctx.fillStyle = "#9aa8a2";
  ctx.fillText("자료 기준: NASA 공식값 + 내부 환경은 개념 모델 추정값", 44, 138);
}

function toCanvas(x, y, f) { return { x: f.x + f.w * x, y: f.y + f.h * y }; }

function roundRect(x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function toggleRun() {
  running = !running;
  document.querySelector("#playButton").textContent = running ? "정지" : "실행";
  if (running) timer = setInterval(() => stepSim(50), 450);
  else clearInterval(timer);
}

document.querySelector("#worldChoices").addEventListener("click", (e) => {
  const button = e.target.closest("[data-world]");
  if (!button) return;
  selectedWorld = button.dataset.world;
  adjustments = Object.fromEntries(sliderDefs.map((d) => [d.key, d.value]));
  renderChoices();
  renderSliders();
  resetSim();
});

document.querySelector("#microbeChoices").addEventListener("click", (e) => {
  const button = e.target.closest("[data-microbe]");
  if (!button) return;
  selectedMicrobe = button.dataset.microbe;
  renderChoices();
  resetSim();
});

document.querySelector("#sliders").addEventListener("input", (e) => {
  const input = e.target.closest("[data-adjust]");
  if (!input) return;
  adjustments[input.dataset.adjust] = Number(input.value);
  resetSim();
});

document.querySelector("#playButton").addEventListener("click", toggleRun);
document.querySelector("#stepButton").addEventListener("click", () => stepSim(100));
document.querySelector("#resetButton").addEventListener("click", resetSim);

renderChoices();
renderSliders();
resetSim();
draw();
