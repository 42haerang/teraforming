const worlds = {
  mars: {
    name: "화성",
    line: "차갑고 건조하며 CO2가 압도적으로 많은 대기. 지하 얼음과 방사선 회피가 생존의 핵심.",
    sky: ["#2b1410", "#8b3e2f", "#d48b61"],
    ocean: false,
    recommended: "psychro",
    atmosphere: { CO2: 95, N2: 2.7, Ar: 1.6, O2: 0.13, CH4: 0.01 },
    env: { tempTop: -82, tempBottom: -24, saltTop: 12, saltBottom: 45, radTop: 92, radBottom: 34, pressureTop: 6, pressureBottom: 28, energyTop: 22, energyBottom: 38 }
  },
  europa: {
    name: "유로파",
    line: "얼음 지각 아래 바다와 조석 가열. 표면보다 내부 해양과 열수구 근처가 훨씬 유리하다.",
    sky: ["#071018", "#164456", "#a7d8df"],
    ocean: true,
    recommended: "vent",
    atmosphere: { O2: 86, H2O: 8, CO2: 3, N2: 2, CH4: 1 },
    env: { tempTop: -160, tempBottom: 8, saltTop: 2, saltBottom: 58, radTop: 88, radBottom: 14, pressureTop: 1, pressureBottom: 86, energyTop: 10, energyBottom: 78 }
  },
  enceladus: {
    name: "엔셀라두스",
    line: "내부 바다 물질이 남극 분출기둥으로 나온다. H2, CH4, 유기물이 생명 흔적 탐지에 중요하다.",
    sky: ["#06111c", "#1c5266", "#d2f1f2"],
    ocean: true,
    recommended: "methanogen",
    atmosphere: { H2O: 91, CO2: 4, CH4: 2, N2: 2, O2: 1 },
    env: { tempTop: -200, tempBottom: 16, saltTop: 1, saltBottom: 36, radTop: 58, radBottom: 8, pressureTop: 1, pressureBottom: 72, energyTop: 16, energyBottom: 90 }
  }
};

const organisms = {
  deinococcus: {
    name: "방사선 내성균",
    metabolism: "DNA 복구 · CO2 완만 고정",
    temp: [-35, 42],
    salt: [0, 25],
    rad: [0, 96],
    pressure: [0, 55],
    energy: [12, 85],
    color: "#ff7367",
    gasEffect: { CO2: -0.0009, O2: 0.0005, N2: 0.0001 }
  },
  psychro: {
    name: "저온성 미생물",
    metabolism: "저온 대사 · CO2 고정",
    temp: [-90, 12],
    salt: [0, 42],
    rad: [0, 48],
    pressure: [0, 70],
    energy: [8, 70],
    color: "#7ec8ff",
    gasEffect: { CO2: -0.0012, O2: 0.0007, N2: 0.0001 }
  },
  halophile: {
    name: "호염성 미생물",
    metabolism: "염분 적응 · 탄소 고정",
    temp: [-20, 48],
    salt: [32, 95],
    rad: [0, 66],
    pressure: [0, 80],
    energy: [10, 85],
    color: "#ffc35a",
    gasEffect: { CO2: -0.0010, O2: 0.0004, CH4: 0.00015 }
  },
  methanogen: {
    name: "메탄생성균",
    metabolism: "혐기성 대사 · CH4 생성",
    temp: [-12, 92],
    salt: [0, 65],
    rad: [0, 38],
    pressure: [25, 100],
    energy: [44, 100],
    color: "#7ee879",
    gasEffect: { CO2: -0.0007, CH4: 0.0015, O2: -0.00025 }
  },
  vent: {
    name: "열수구 화학합성균",
    metabolism: "화학합성 · O2/유기물 증가",
    temp: [0, 118],
    salt: [18, 76],
    rad: [0, 35],
    pressure: [48, 100],
    energy: [62, 100],
    color: "#61f0c5",
    gasEffect: { CO2: -0.0015, O2: 0.0010, CH4: 0.00025 }
  }
};

const gasColors = { CO2: "#f06a5c", O2: "#70d77b", N2: "#67d7e6", Ar: "#b9a5ff", CH4: "#f0b44d", H2O: "#82d9ff" };
const canvas = document.querySelector("#field");
const ctx = canvas.getContext("2d");
const gasChart = document.querySelector("#gasChart");
const chartCtx = gasChart.getContext("2d");
const worldSelect = document.querySelector("#worldSelect");
const organismSelect = document.querySelector("#organismSelect");
const speedRange = document.querySelector("#speedRange");
const speedLabel = document.querySelector("#speedLabel");
const resetBtn = document.querySelector("#resetBtn");

let worldKey = "mars";
let organismKey = "psychro";
let atmosphere;
let agents = [];
let terraform = 0;
let elapsed = 0;
let lastTime = performance.now();
let timeScale = Number(speedRange.value);
let gasHistory = [];
let historyTimer = 0;
let climate = { greenhouse: 0, shielding: 0, pressureBoost: 0 };

for (const [key, world] of Object.entries(worlds)) {
  worldSelect.add(new Option(world.name, key));
}

for (const [key, organism] of Object.entries(organisms)) {
  organismSelect.add(new Option(organism.name, key));
}

worldSelect.value = worldKey;
organismSelect.value = organismKey;

worldSelect.addEventListener("change", () => {
  worldKey = worldSelect.value;
  organismKey = worlds[worldKey].recommended;
  organismSelect.value = organismKey;
  reset();
});

organismSelect.addEventListener("change", () => {
  organismKey = organismSelect.value;
  reset();
});

speedRange.addEventListener("input", () => {
  timeScale = Number(speedRange.value);
  speedLabel.textContent = timeScale === 0 ? "정지" : `${timeScale}x`;
});

resetBtn.addEventListener("click", reset);
window.addEventListener("resize", resize);

function reset() {
  const world = worlds[worldKey];
  atmosphere = { ...world.atmosphere };
  agents = Array.from({ length: 42 }, () => spawnAgent());
  terraform = 0;
  elapsed = 0;
  historyTimer = 0;
  gasHistory = [snapshotAtmosphere()];
  lastTime = performance.now();
  document.querySelector("#worldName").textContent = world.name;
  document.querySelector("#worldLine").textContent = world.line;
  document.querySelector("#metabolism").textContent = organisms[organismKey].metabolism;
}

function resize() {
  const ratio = window.devicePixelRatio || 1;
  canvas.width = Math.floor(window.innerWidth * ratio);
  canvas.height = Math.floor(window.innerHeight * ratio);
  gasChart.width = Math.floor(gasChart.clientWidth * ratio);
  gasChart.height = Math.floor(gasChart.clientHeight * ratio);
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  chartCtx.setTransform(ratio, 0, 0, ratio, 0, 0);
}

function spawnAgent() {
  const world = worlds[worldKey];
  const oceanBias = world.ocean ? 0.58 : 0.36;
  return {
    x: 0.18 + Math.random() * 0.64,
    y: oceanBias + Math.random() * 0.32,
    vx: 0,
    vy: 0,
    energy: 0.65 + Math.random() * 0.35,
    age: 0,
    fitness: 0
  };
}

function envAt(x, y) {
  const world = worlds[worldKey];
  const e = world.env;
  const depth = clamp(y, 0, 1);
  const vent = world.ocean ? Math.exp(-((x - 0.68) ** 2 / 0.014 + (y - 0.78) ** 2 / 0.026)) : 0;
  const iceShield = world.ocean && y > 0.22 ? 1 : 0;
  const subShield = !world.ocean && y > 0.43 ? 0.7 : 0;
  climate = climateEffects();
  const localShield = clamp(climate.shielding + iceShield * 0.35 + subShield, 0, 0.88);
  return {
    temp: lerp(e.tempTop, e.tempBottom, depth) + climate.greenhouse + vent * 48 + Math.sin(x * Math.PI * 2 + elapsed * 0.06) * 3,
    salt: lerp(e.saltTop, e.saltBottom, depth) + vent * 8,
    rad: Math.max(0, lerp(e.radTop, e.radBottom, depth) * (1 - localShield)),
    pressure: clamp(lerp(e.pressureTop, e.pressureBottom, depth) + climate.pressureBoost, 0, 100),
    energy: clamp(lerp(e.energyTop, e.energyBottom, depth) + vent * 38, 0, 100)
  };
}

function atmosphereTotal() {
  return Object.values(atmosphere).reduce((sum, value) => sum + Math.max(0, value), 0) || 1;
}

function gasRatio(gas) {
  return (atmosphere[gas] || 0) / atmosphereTotal() * 100;
}

function climateEffects() {
  const total = atmosphereTotal();
  const co2 = atmosphere.CO2 || 0;
  const ch4 = atmosphere.CH4 || 0;
  const h2o = atmosphere.H2O || 0;
  const o2 = atmosphere.O2 || 0;
  return {
    greenhouse: clamp((co2 - 3) * 0.035 + ch4 * 0.55 + h2o * 0.045, -8, 46),
    shielding: clamp(total / 260 + (o2 + co2) / 460, 0, 0.62),
    pressureBoost: clamp((total - 35) * 0.22, 0, 38)
  };
}

function scoreRange(value, range) {
  const [min, max] = range;
  const center = (min + max) / 2;
  const radius = (max - min) / 2;
  const distance = Math.abs(value - center);
  return clamp(1 - distance / Math.max(radius, 1), 0, 1);
}

function fitnessAt(x, y) {
  const organism = organisms[organismKey];
  const env = envAt(x, y);
  const scores = [
    scoreRange(env.temp, organism.temp),
    scoreRange(env.salt, organism.salt),
    scoreRange(env.rad, organism.rad),
    scoreRange(env.pressure, organism.pressure),
    scoreRange(env.energy, organism.energy)
  ];
  return scores.reduce((sum, score) => sum + score, 0) / scores.length;
}

function update(dt) {
  elapsed += dt;
  const organism = organisms[organismKey];

  for (const agent of agents) {
    agent.age += dt;
    const here = fitnessAt(agent.x, agent.y);
    let best = { x: agent.x, y: agent.y, score: here };

    for (let i = 0; i < 8; i += 1) {
      const angle = Math.random() * Math.PI * 2;
      const distance = 0.018 + Math.random() * 0.035;
      const nx = clamp(agent.x + Math.cos(angle) * distance, 0.04, 0.96);
      const ny = clamp(agent.y + Math.sin(angle) * distance, 0.16, 0.94);
      const score = fitnessAt(nx, ny);
      if (score > best.score) best = { x: nx, y: ny, score };
    }

    agent.vx = agent.vx * 0.82 + (best.x - agent.x) * 2.1 + (Math.random() - 0.5) * 0.006;
    agent.vy = agent.vy * 0.82 + (best.y - agent.y) * 2.1 + (Math.random() - 0.5) * 0.006;
    agent.x = clamp(agent.x + agent.vx * dt * 9, 0.04, 0.96);
    agent.y = clamp(agent.y + agent.vy * dt * 9, 0.16, 0.94);
    agent.fitness = fitnessAt(agent.x, agent.y);
    agent.energy += (agent.fitness - 0.46) * dt * 0.42;
    agent.energy -= dt * 0.018;
  }

  agents = agents.filter((agent) => agent.energy > 0);

  if (agents.length < 170) {
    const babies = [];
    for (const agent of agents) {
      if (agent.fitness > 0.68 && agent.energy > 0.9 && Math.random() < dt * 0.65) {
        agent.energy *= 0.58;
        babies.push({ ...spawnAgent(), x: clamp(agent.x + (Math.random() - 0.5) * 0.04, 0.04, 0.96), y: clamp(agent.y + (Math.random() - 0.5) * 0.04, 0.16, 0.94), energy: 0.72 });
      }
    }
    agents.push(...babies);
  }

  applyMetabolism(dt);

  const avgFitness = averageFitness();
  const livingForce = Math.min(1, agents.length / 90) * Math.max(0, avgFitness - 0.42);
  if (avgFitness > 0.58 && agents.length > 18) {
    terraform = clamp(terraform + livingForce * dt * 1.8, 0, 100);
  } else {
    terraform = clamp(terraform - dt * 0.12, 0, 100);
  }

  historyTimer += dt;
  if (historyTimer > 0.45) {
    gasHistory.push(snapshotAtmosphere());
    gasHistory = gasHistory.slice(-90);
    historyTimer = 0;
  }
}

function applyMetabolism(dt) {
  const organism = organisms[organismKey];
  for (const agent of agents) {
    if (agent.fitness < 0.36) continue;
    const env = envAt(agent.x, agent.y);
    const exchange = gasExchange(organism, env, agent.fitness);
    for (const [gas, delta] of Object.entries(exchange)) {
      atmosphere[gas] = Math.max(0, (atmosphere[gas] || 0) + delta * dt);
    }
  }
  leakAtmosphere(dt);
}

function gasExchange(organism, env, fitness) {
  const activity = Math.max(0, fitness - 0.34) * 0.018;
  const energyBonus = clamp(env.energy / 100, 0.2, 1.25);
  const pressureBonus = clamp(env.pressure / 65, 0.18, 1.2);
  const base = activity * energyBonus * pressureBonus;

  if (organismKey === "methanogen") {
    return { CO2: -base * 0.75, H2O: -base * 0.18, CH4: base * 1.28 };
  }
  if (organismKey === "vent") {
    return { CO2: -base * 0.9, H2O: -base * 0.08, O2: base * 0.72, CH4: base * 0.12 };
  }
  if (organismKey === "halophile") {
    return { CO2: -base * 0.65, O2: base * 0.34, CH4: base * 0.08 };
  }
  if (organismKey === "deinococcus") {
    return { CO2: -base * 0.42, O2: base * 0.2, N2: base * 0.04 };
  }
  return { CO2: -base * 0.58, O2: base * 0.4, N2: base * 0.03 };
}

function leakAtmosphere(dt) {
  const loss = worlds[worldKey].ocean ? 0.00001 : 0.000035;
  for (const gas of Object.keys(atmosphere)) {
    atmosphere[gas] = Math.max(0, atmosphere[gas] * (1 - loss * dt));
  }
}

function averageFitness() {
  if (!agents.length) return 0;
  return agents.reduce((sum, agent) => sum + agent.fitness, 0) / agents.length;
}

function draw() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const world = worlds[worldKey];
  const organism = organisms[organismKey];

  const sky = ctx.createLinearGradient(0, 0, 0, height);
  sky.addColorStop(0, world.sky[0]);
  sky.addColorStop(0.35, world.sky[1]);
  sky.addColorStop(1, world.sky[2]);
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, width, height);

  drawLayers(width, height, world);
  drawFields(width, height);
  drawAgents(width, height, organism);
  drawAtmosphereTint(width, height);
  drawOrbitLines(width, height);
}

function drawLayers(width, height, world) {
  if (world.ocean) {
    fillBand(0.25, 0.48, "#174f62");
    fillBand(0.73, 0.27, "#201b17");
    fillBand(0.14, 0.11, "rgba(231, 250, 255, .9)");
    drawVent(width, height);
  } else {
    fillBand(0.43, 0.57, "#4a2c22");
    fillBand(0.30, 0.13, "#a45d48");
    drawCracks(width, height);
  }

  function fillBand(start, size, color) {
    ctx.fillStyle = color;
    ctx.fillRect(0, height * start, width, height * size);
  }
}

function drawFields(width, height) {
  const cell = 42;
  for (let y = 0; y < height; y += cell) {
    for (let x = 0; x < width; x += cell) {
      const env = envAt(x / width, y / height);
      ctx.fillStyle = `rgba(240, 106, 92, ${env.rad / 520})`;
      ctx.fillRect(x, y, cell, cell);
      ctx.fillStyle = `rgba(103, 215, 230, ${env.salt / 740})`;
      ctx.fillRect(x, y, cell, cell);
      ctx.fillStyle = `rgba(240, 180, 77, ${clamp((env.temp + 210) / 360, 0, 1) * 0.07})`;
      ctx.fillRect(x, y, cell, cell);
    }
  }
}

function drawAgents(width, height, organism) {
  for (const agent of agents) {
    const x = agent.x * width;
    const y = agent.y * height;
    const radius = 3.5 + agent.fitness * 5.5;
    ctx.beginPath();
    ctx.fillStyle = organism.color;
    ctx.shadowColor = organism.color;
    ctx.shadowBlur = 16 + agent.fitness * 20;
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = `rgba(255,255,255,${0.25 + agent.fitness * 0.55})`;
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }
}

function drawAtmosphereTint(width, height) {
  const o2 = atmosphere.O2 || 0;
  const ch4 = atmosphere.CH4 || 0;
  const terraformAlpha = clamp(terraform / 100, 0, 1) * 0.18;
  const gasGlow = ctx.createRadialGradient(width * 0.55, height * 0.62, 20, width * 0.55, height * 0.62, width * 0.62);
  gasGlow.addColorStop(0, `rgba(112, 215, 123, ${terraformAlpha + o2 / 800})`);
  gasGlow.addColorStop(0.55, `rgba(240, 180, 77, ${ch4 / 700})`);
  gasGlow.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = gasGlow;
  ctx.fillRect(0, 0, width, height);
}

function drawOrbitLines(width, height) {
  ctx.strokeStyle = "rgba(255,255,255,.08)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.ellipse(width * 0.5, height * 0.58, width * 0.56, height * 0.22, -0.18, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(width * 0.52, height * 0.62, width * 0.44, height * 0.17, 0.28, 0, Math.PI * 2);
  ctx.stroke();
}

function drawVent(width, height) {
  const x = width * 0.68;
  const y = height * 0.78;
  const plume = ctx.createRadialGradient(x, y - 70, 5, x, y - 70, 130);
  plume.addColorStop(0, "rgba(255,255,255,.58)");
  plume.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = plume;
  ctx.beginPath();
  ctx.ellipse(x, y - 70, 92, 132, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#c95e42";
  ctx.beginPath();
  ctx.moveTo(x - 24, y + 48);
  ctx.lineTo(x, y - 28);
  ctx.lineTo(x + 26, y + 48);
  ctx.closePath();
  ctx.fill();
}

function drawCracks(width, height) {
  ctx.strokeStyle = "rgba(255, 143, 109, .34)";
  ctx.lineWidth = 2;
  for (let i = 0; i < 18; i += 1) {
    const x = width * (0.06 + i * 0.052);
    ctx.beginPath();
    ctx.moveTo(x, height * 0.3);
    ctx.lineTo(x + Math.sin(i) * 24, height * 0.43);
    ctx.stroke();
  }
}

function updateHud() {
  document.querySelector("#clock").textContent = `${Math.floor(elapsed).toLocaleString("ko-KR")}년`;
  document.querySelector("#population").textContent = agents.length;
  document.querySelector("#fitness").textContent = `${Math.round(averageFitness() * 100)}%`;
  document.querySelector("#terraform").textContent = `${Math.round(terraform)}%`;
  document.querySelector("#habitability").textContent = `${Math.round(terraform)}%`;
  const nowClimate = climateEffects();
  const local = averageLocalEnv();
  document.querySelector("#greenhouse").textContent = `${nowClimate.greenhouse >= 0 ? "+" : ""}${nowClimate.greenhouse.toFixed(1)}°C`;
  document.querySelector("#shielding").textContent = `${Math.round(nowClimate.shielding * 100)}%`;
  document.querySelector("#localEnv").textContent = local
    ? `${local.temp.toFixed(1)}°C · 방사선 ${Math.round(local.rad)} · 압력 ${Math.round(local.pressure)}`
    : "-";
  document.querySelector("#metabolism").textContent = metabolismSummary(local);
  const organism = organisms[organismKey];
  document.querySelector("#conditionRange").textContent =
    `${organism.temp[0]}~${organism.temp[1]}°C · 방사선 ${organism.rad[0]}~${organism.rad[1]} · 압력 ${organism.pressure[0]}~${organism.pressure[1]}`;

  const sorted = Object.keys(atmosphere)
    .map((gas) => [gas, gasRatio(gas)])
    .sort((a, b) => b[1] - a[1]);
  document.querySelector("#gasBars").innerHTML = sorted.map(([gas, value]) => `
    <div class="gas-row">
      <strong>${gas}</strong>
      <div class="gas-track"><div class="gas-fill" style="width:${Math.max(1, value)}%; background:${gasColors[gas] || "#fff"}"></div></div>
      <span>${value.toFixed(value >= 10 ? 0 : 1)}%</span>
    </div>
  `).join("");
  drawGasChart();
}

function metabolismSummary(local) {
  if (!local || !agents.length) return organisms[organismKey].metabolism;
  const exchange = gasExchange(organisms[organismKey], local, averageFitness());
  return Object.entries(exchange)
    .filter(([, value]) => Math.abs(value) > 0.00001)
    .map(([gas, value]) => `${gas}${value < 0 ? "↓소모" : "↑배출"}`)
    .join(" · ");
}

function averageLocalEnv() {
  if (!agents.length) return null;
  const total = agents.reduce((sum, agent) => {
    const env = envAt(agent.x, agent.y);
    sum.temp += env.temp;
    sum.rad += env.rad;
    sum.pressure += env.pressure;
    sum.energy += env.energy;
    return sum;
  }, { temp: 0, rad: 0, pressure: 0, energy: 0 });
  return {
    temp: total.temp / agents.length,
    rad: total.rad / agents.length,
    pressure: total.pressure / agents.length,
    energy: total.energy / agents.length
  };
}

function snapshotAtmosphere() {
  return {
    elapsed,
    CO2: gasRatio("CO2"),
    O2: gasRatio("O2"),
    CH4: gasRatio("CH4"),
    N2: gasRatio("N2"),
    H2O: gasRatio("H2O")
  };
}

function drawGasChart() {
  const width = gasChart.clientWidth;
  const height = gasChart.clientHeight;
  chartCtx.clearRect(0, 0, width, height);
  chartCtx.fillStyle = "rgba(255,255,255,.62)";
  chartCtx.font = "11px Segoe UI, Malgun Gothic, sans-serif";
  chartCtx.fillText("시간에 따른 대기 변화", 10, 18);
  chartCtx.strokeStyle = "rgba(255,255,255,.12)";
  chartCtx.lineWidth = 1;
  for (let i = 1; i < 4; i += 1) {
    const y = 28 + (height - 42) * i / 4;
    chartCtx.beginPath();
    chartCtx.moveTo(10, y);
    chartCtx.lineTo(width - 10, y);
    chartCtx.stroke();
  }

  const gases = ["CO2", "O2", "CH4", "N2", "H2O"].filter((gas) => gasHistory.some((point) => point[gas] > 0.05));
  gases.forEach((gas) => {
    chartCtx.strokeStyle = gasColors[gas] || "#fff";
    chartCtx.lineWidth = gas === "CO2" ? 2.5 : 2;
    chartCtx.beginPath();
    gasHistory.forEach((point, index) => {
      const x = 10 + (width - 20) * (gasHistory.length <= 1 ? 0 : index / (gasHistory.length - 1));
      const y = height - 12 - (height - 42) * clamp(point[gas] / 100, 0, 1);
      if (index === 0) chartCtx.moveTo(x, y);
      else chartCtx.lineTo(x, y);
    });
    chartCtx.stroke();
  });
}

function loop(now) {
  const realDt = Math.min((now - lastTime) / 1000, 0.05);
  lastTime = now;
  const scaledDt = realDt * timeScale;
  if (scaledDt > 0) {
    const steps = Math.max(1, Math.ceil(scaledDt / 0.05));
    const step = scaledDt / steps;
    for (let i = 0; i < steps; i += 1) update(step);
  }
  draw();
  updateHud();
  requestAnimationFrame(loop);
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

resize();
reset();
requestAnimationFrame(loop);
