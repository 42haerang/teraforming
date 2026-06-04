const worlds = {
  mars: {
    name: "화성",
    line: "NASA fact sheet 기반: CO2 대기, 낮은 압력, 낮은 평균 온도, 표면 방사선.",
    sky: ["#2b1410", "#8b3e2f", "#d48b61"],
    ocean: false,
    recommended: "chroococcidiopsis",
    atmosphere: { CO2: 95.32, N2: 2.7, Ar: 1.6, O2: 0.13, CH4: 0.0001, H2O: 0.03 },
    facts: {
      atmosphere: "CO2 95.32%, N2 2.7%, Ar 1.6%, O2 0.13%, H2O 0.03%(예상값)",
      temperature: "평균 -63°C, 대략 -153~20°C",
      pressure: "평균 6.35 mbar",
      radiation: "표면 약 0.67 mSv/day",
      salinity: "염수 가능, 전 행성 평균 염도 직접값 없음(예상값)"
    },
    env: { tempTop: -82, tempBottom: -24, saltTop: 2, saltBottom: 55, radTop: 0.67, radBottom: 0.05, pressureTop: 6.35, pressureBottom: 30, energyTop: 40, energyBottom: 55 },
    refuges: [
      { name: "지하 얼음층/차폐 배양돔(예상값)", x: 0.36, y: 0.62, r: 0.18, temp: 24, rad: 0.03, pressure: 80, energy: 78, salt: 18 }
    ]
  },
  europa: {
    name: "유로파",
    line: "얼음 지각 아래 바다와 조석 가열. 표면보다 내부 해양과 열수구 근처가 훨씬 유리하다.",
    sky: ["#071018", "#164456", "#a7d8df"],
    ocean: true,
    recommended: "shewanella",
    atmosphere: { O2: 99, H2O: 0.8, CO2: 0.1, N2: 0.1, CH4: 0.01 },
    facts: {
      atmosphere: "매우 희박한 O2 대기, 조성비 세부값은 모델용(예상값)",
      temperature: "표면 약 -160°C",
      pressure: "표면 대기압 극히 낮음, 지하 바다 고압(예상값)",
      radiation: "표면 강한 목성 방사선, 얼음 아래 급감(예상값)",
      salinity: "지하 바다 염분 존재 가능, 범위는 해수 유사 가정(예상값)"
    },
    env: { tempTop: -160, tempBottom: 2, saltTop: 0, saltBottom: 35, radTop: 5400, radBottom: 0.01, pressureTop: 0.001, pressureBottom: 100, energyTop: 5, energyBottom: 82 },
    refuges: [
      { name: "얼음 아래 바다/열수구 근처(예상값)", x: 0.68, y: 0.76, r: 0.2, temp: 18, rad: 0.01, pressure: 80, energy: 95, salt: 35 }
    ]
  },
  enceladus: {
    name: "엔셀라두스",
    line: "내부 바다 물질이 남극 분출기둥으로 나온다. H2, CH4, 유기물이 생명 흔적 탐지에 중요하다.",
    sky: ["#06111c", "#1c5266", "#d2f1f2"],
    ocean: true,
    recommended: "methanogen",
    atmosphere: { H2O: 91, CO2: 4, CH4: 2, H2: 2, N2: 1, O2: 0.01 },
    facts: {
      atmosphere: "분출기둥: H2O 주성분, CO2/CH4/H2 검출, 조성비는 모델용(예상값)",
      temperature: "표면 약 -200°C",
      pressure: "표면 대기 거의 없음, 내부 바다 고압(예상값)",
      radiation: "토성권 방사선 낮음~중간, 내부 바다에서는 차폐(예상값)",
      salinity: "내부 바다 염분 존재 가능(예상값)"
    },
    env: { tempTop: -200, tempBottom: 16, saltTop: 1, saltBottom: 35, radTop: 0.2, radBottom: 0.005, pressureTop: 0.001, pressureBottom: 80, energyTop: 18, energyBottom: 95 },
    refuges: [
      { name: "내부 바다/분출공 열수 환경(예상값)", x: 0.68, y: 0.77, r: 0.22, temp: 58, rad: 0.005, pressure: 80, energy: 98, salt: 35 }
    ]
  }
};

const organisms = {
  chroococcidiopsis: {
    name: "화성 남세균 (Chroococcidiopsis sp. CCMEE 029)",
    metabolism: "광합성 · CO2 소모 · O2 배출",
    lifespan: 90,
    gasNeed: { CO2: [1, 100], O2: [0, 40], H2O: [0.001, 100] },
    temp: [15, 35],
    salt: [0, 35],
    rad: [0, 0.2],
    pressure: [6, 1000],
    energy: [35, 100],
    color: "#ff7367",
    gasEffect: { CO2: -0.0009, O2: 0.00065 },
    evidence: "생존/광합성 연구 기반, 화성 표면 직접 노출은 불리하며 차폐 환경 필요"
  },
  psychro: {
    name: "저온성 세균 (Psychrobacter cryohalolentis K5)",
    metabolism: "호기성/저온 대사 · O2 소모 · CO2 배출",
    lifespan: 110,
    gasNeed: { O2: [0.1, 30] },
    temp: [-10, 28],
    salt: [0, 42],
    rad: [0, 0.05],
    pressure: [0, 70],
    energy: [8, 70],
    color: "#7ec8ff",
    gasEffect: { O2: -0.00045, CO2: 0.00045 },
    evidence: "영구동토 저온성 세균. 방사선 내성 대표종이 아니므로 화성 표면 방사선에서는 사멸해야 함"
  },
  halophile: {
    name: "고염성 조류 (Dunaliella salina)",
    metabolism: "염분 적응 · 탄소 고정",
    lifespan: 95,
    gasNeed: { CO2: [1, 100] },
    temp: [-20, 48],
    salt: [32, 95],
    rad: [0, 66],
    pressure: [0, 80],
    energy: [10, 85],
    color: "#ffc35a",
    gasEffect: { CO2: -0.0010, O2: 0.0004 },
    evidence: "고염 환경 광합성 생물. 천체 적용은 염수 환경 가정(예상값)"
  },
  methanogen: {
    name: "엔셀라두스 고세균 (Methanothermococcus okinawensis IH1)",
    metabolism: "메탄생성 · H2/CO2 소모 · CH4 배출",
    lifespan: 85,
    gasNeed: { CO2: [0.1, 100], H2: [0.1, 100], O2: [0, 0.1] },
    temp: [40, 65],
    salt: [0, 65],
    rad: [0, 0.05],
    pressure: [25, 100],
    energy: [44, 100],
    color: "#7ee879",
    gasEffect: { CO2: -0.0007, H2: -0.0028, CH4: 0.0007 },
    evidence: "H2 + CO2 -> CH4 + H2O 메탄생성. 엔셀라두스 H2 검출과 연결"
  },
  shewanella: {
    name: "유로파 혐기성 세균 (Shewanella oneidensis MR-1)",
    metabolism: "혐기성 호흡 · O2 소모 가능 · 금속산화물 환원",
    lifespan: 75,
    gasNeed: { O2: [0, 30], H2O: [0.1, 100] },
    temp: [4, 40],
    salt: [18, 76],
    rad: [0, 0.05],
    pressure: [48, 100],
    energy: [62, 100],
    color: "#61f0c5",
    gasEffect: { O2: -0.00025, CO2: 0.00025 },
    evidence: "유로파 지하 바다의 무산소/고압 환경을 단순화한 선택. 압력/방사선 범위는 내부 바다 가정(예상값)"
  }
};

const gasColors = { CO2: "#f06a5c", O2: "#70d77b", N2: "#67d7e6", Ar: "#b9a5ff", CH4: "#f0b44d", H2O: "#82d9ff", H2: "#f7f4c4" };
const seedPopulation = 72;
const carryingCapacity = 260;
const simulationStep = 0.2;
const canvas = document.querySelector("#field");
const ctx = canvas.getContext("2d");
const gasChart = document.querySelector("#gasChart");
const chartCtx = gasChart.getContext("2d");
const worldSelect = document.querySelector("#worldSelect");
const organismSelect = document.querySelector("#organismSelect");
const speedRange = document.querySelector("#speedRange");
const speedLabel = document.querySelector("#speedLabel");
const graphSelect = document.querySelector("#graphSelect");

let worldKey = "mars";
let organismKey = worlds[worldKey].recommended;
let atmosphere;
let agents = [];
let terraform = 0;
let elapsed = 0;
let lastTime = performance.now();
let timeScale = Number(speedRange.value);
let storedTimeScale = timeScale;
let paused = false;
let gasHistory = [];
let historyTimer = 0;
let climate = { greenhouse: 0, shielding: 0, pressureBoost: 0 };
let timeline = [];
let nextTimelineMark = 100;

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
  if (timeScale > 0) {
    paused = false;
    storedTimeScale = timeScale;
  }
  speedLabel.textContent = timeScale === 0 ? "정지" : `${timeScale}x`;
});

window.addEventListener("keydown", (event) => {
  if (event.code === "Space") {
    event.preventDefault();
    togglePause();
  } else if (event.key.toLowerCase() === "r") {
    reset();
  } else if (event.key === "ArrowRight") {
    event.preventDefault();
    jumpYears(100);
  } else if (event.key === "ArrowLeft") {
    event.preventDefault();
    jumpYears(-100);
  }
});

function togglePause() {
  paused = !paused;
  if (paused) {
    storedTimeScale = timeScale || storedTimeScale || 1;
    timeScale = 0;
  } else {
    timeScale = storedTimeScale || 1;
  }
  speedRange.value = timeScale;
  speedLabel.textContent = timeScale === 0 ? "정지" : `${timeScale}x`;
}

window.addEventListener("resize", resize);
graphSelect.addEventListener("change", drawGasChart);

function reset() {
  const world = worlds[worldKey];
  atmosphere = { ...world.atmosphere };
  agents = Array.from({ length: seedPopulation }, () => spawnAgent());
  terraform = 0;
  elapsed = 0;
  historyTimer = 0;
  gasHistory = [snapshotAtmosphere()];
  timeline = [snapshotState()];
  nextTimelineMark = 100;
  lastTime = performance.now();
  document.querySelector("#worldName").textContent = world.name;
  document.querySelector("#metabolism").textContent = organisms[organismKey].metabolism;
  updateCriteriaText();
}

function snapshotState() {
  return {
    elapsed,
    atmosphere: { ...atmosphere },
    terraform,
    agents: agents.map((agent) => ({ ...agent })),
    gasHistory: gasHistory.map((point) => ({ ...point })),
    nextTimelineMark
  };
}

function restoreState(state) {
  elapsed = state.elapsed;
  atmosphere = { ...state.atmosphere };
  terraform = state.terraform;
  agents = state.agents.map((agent) => ({ ...agent }));
  gasHistory = state.gasHistory.map((point) => ({ ...point }));
  nextTimelineMark = Math.floor(elapsed / 100) * 100 + 100;
  historyTimer = 0;
  lastTime = performance.now();
}

function rememberTimeline() {
  if (elapsed < nextTimelineMark) return;
  timeline.push(snapshotState());
  timeline = timeline.slice(-80);
  nextTimelineMark += 100;
}

function jumpYears(years) {
  if (years > 0) {
    const wasPaused = paused;
    for (let remaining = years; remaining > 0; remaining -= simulationStep) {
      update(Math.min(simulationStep, remaining));
    }
    if (wasPaused) {
      paused = true;
      timeScale = 0;
      speedRange.value = 0;
      speedLabel.textContent = "정지";
    }
  } else {
    const target = Math.max(0, elapsed + years);
    const candidates = timeline.filter((state) => state.elapsed <= target);
    restoreState(candidates.at(-1) || timeline[0]);
  }
  updateHud();
  draw();
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
  const organism = organisms[organismKey];
  const oceanBias = world.ocean ? 0.58 : 0.36;
  const refuge = (world.refuges || [])[0];
  const seedNearRefuge = refuge && Math.random() < 0.18;
  const x = seedNearRefuge
    ? clamp(refuge.x + (Math.random() - 0.5) * refuge.r * 2.2, 0.04, 0.96)
    : 0.18 + Math.random() * 0.64;
  const y = seedNearRefuge
    ? clamp(refuge.y + (Math.random() - 0.5) * refuge.r * 2.2, 0.16, 0.94)
    : oceanBias + Math.random() * 0.32;
  return {
    x,
    y,
    vx: 0,
    vy: 0,
    energy: 0.65 + Math.random() * 0.35,
    age: 0,
    lifespan: organism.lifespan * (0.72 + Math.random() * 0.56),
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
  const baseEnv = {
    temp: lerp(e.tempTop, e.tempBottom, depth) + climate.greenhouse + vent * 48 + Math.sin(x * Math.PI * 2 + elapsed * 0.06) * 3,
    salt: lerp(e.saltTop, e.saltBottom, depth) + vent * 8,
    rad: Math.max(0, lerp(e.radTop, e.radBottom, depth) * (1 - localShield)),
    pressure: clamp(lerp(e.pressureTop, e.pressureBottom, depth) + climate.pressureBoost, 0, 100),
    energy: clamp(lerp(e.energyTop, e.energyBottom, depth) + vent * 38, 0, 100)
  };
  return applyRefugeEnvironment(baseEnv, x, y, world);
}

function applyRefugeEnvironment(baseEnv, x, y, world) {
  let env = { ...baseEnv };
  for (const refuge of world.refuges || []) {
    const influence = Math.exp(-(((x - refuge.x) ** 2 + (y - refuge.y) ** 2) / (refuge.r ** 2)));
    env.temp = lerp(env.temp, refuge.temp + climate.greenhouse * 0.25, influence);
    env.rad = lerp(env.rad, refuge.rad, influence);
    env.pressure = lerp(env.pressure, refuge.pressure, influence);
    env.energy = lerp(env.energy, refuge.energy, influence);
    env.salt = lerp(env.salt, refuge.salt, influence);
  }
  return env;
}

function refugeScoreAt(x, y, world = worlds[worldKey]) {
  const refuges = world.refuges || [];
  if (!refuges.length) return 1;
  return Math.max(...refuges.map((refuge) => {
    const distance = Math.hypot(x - refuge.x, y - refuge.y);
    return clamp(1 - distance / refuge.r, 0, 1);
  }));
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

function survivalRangeScore(value, range) {
  const [min, max] = range;
  if (value >= min && value <= max) return 1;
  const span = Math.max(max - min, 1e-6);
  if (value < min) return clamp(1 - (min - value) / span, 0, 1);
  return clamp(1 - (value - max) / span, 0, 1);
}

function gasRangeScore(value, range) {
  const [min, max] = range;
  if (value < min) return clamp(value / Math.max(min, 0.01), 0, 1);
  if (value > max) return clamp(1 - (value - max) / Math.max(100 - max, 1), 0, 1);
  return 1;
}

function gasSuitability(organism = organisms[organismKey]) {
  if (!organism.gasNeed) return 1;
  const scores = Object.entries(organism.gasNeed).map(([gas, range]) => gasRangeScore(gasRatio(gas), range));
  return scores.reduce((sum, score) => sum + score, 0) / scores.length;
}

function fitnessAt(x, y) {
  const organism = organisms[organismKey];
  const env = envAt(x, y);
  const scores = [
    survivalRangeScore(env.temp, organism.temp),
    survivalRangeScore(env.salt, organism.salt),
    survivalRangeScore(env.rad, organism.rad),
    survivalRangeScore(env.pressure, organism.pressure),
    survivalRangeScore(env.energy, organism.energy)
  ];
  const localScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
  const refugeScore = refugeScoreAt(x, y);
  return localScore * (0.15 + gasSuitability(organism) * 0.85) * (0.05 + refugeScore * 0.95);
}

function update(dt) {
  if (dt > simulationStep) {
    for (let remaining = dt; remaining > 0; remaining -= simulationStep) {
      update(Math.min(simulationStep, remaining));
    }
    return;
  }

  elapsed += dt;
  const organism = organisms[organismKey];

  for (const agent of agents) {
    agent.age += dt;
    const here = fitnessAt(agent.x, agent.y);
    let best = { x: agent.x, y: agent.y, score: here };

    for (let i = 0; i < 14; i += 1) {
      const angle = Math.random() * Math.PI * 2;
      const distance = 0.015 + Math.random() * 0.055;
      const nx = clamp(agent.x + Math.cos(angle) * distance, 0.04, 0.96);
      const ny = clamp(agent.y + Math.sin(angle) * distance, 0.16, 0.94);
      const score = fitnessAt(nx, ny);
      if (score > best.score) best = { x: nx, y: ny, score };
    }

    let spreadX = 0;
    let spreadY = 0;
    for (const other of agents) {
      if (other === agent) continue;
      const dx = agent.x - other.x;
      const dy = agent.y - other.y;
      const distance = Math.hypot(dx, dy);
      if (distance > 0 && distance < 0.085) {
        const push = (0.085 - distance) / 0.085;
        spreadX += dx / distance * push;
        spreadY += dy / distance * push;
      }
    }

    const searchPull = 0.12 + clamp(elapsed / 45, 0, 1) * 1.75;
    const roaming = 0.01 * (1 - clamp(elapsed / 80, 0, 0.85));
    agent.vx = agent.vx * 0.58 + (best.x - agent.x) * searchPull + spreadX * 0.014 + (Math.random() - 0.5) * roaming;
    agent.vy = agent.vy * 0.58 + (best.y - agent.y) * searchPull + spreadY * 0.014 + (Math.random() - 0.5) * roaming;
    agent.x = clamp(agent.x + agent.vx * dt * 1.9, 0.04, 0.96);
    agent.y = clamp(agent.y + agent.vy * dt * 1.9, 0.16, 0.94);
    agent.fitness = fitnessAt(agent.x, agent.y);
    const gasScore = gasSuitability(organism);
    const refugeScore = refugeScoreAt(agent.x, agent.y);
    const oldAgeStress = clamp((agent.age - agent.lifespan * 0.72) / (agent.lifespan * 0.28), 0, 1);
    agent.energy += (agent.fitness - 0.44) * gasScore * dt * 0.38;
    const outsideStress = refugeScore < 0.35 ? 1.55 : (1 - refugeScore) * 0.04;
    agent.energy -= dt * (0.004 + oldAgeStress * 0.018 + (1 - gasScore) * 0.055 + outsideStress);
  }

  agents = agents.filter((agent) => agent.energy > 0 && agent.age < agent.lifespan);

  const babies = [];
  const gasScore = gasSuitability(organism);
  for (const agent of agents) {
    if (agent.fitness > 0.45 && refugeScoreAt(agent.x, agent.y) > 0.35 && gasScore > 0.52 && agent.energy > 0.52 && Math.random() < dt * 0.52) {
      agent.energy *= 0.72;
      babies.push(makeBaby(agent));
    }
  }
  agents.push(...babies);
  stabilizeViablePopulation(dt, gasScore);
  if (agents.length > carryingCapacity) {
    agents.sort((a, b) => populationRank(b) - populationRank(a));
    agents = agents.slice(0, carryingCapacity);
  }

  applyMetabolism(dt);

  terraform = humanAtmosphereScore();

  historyTimer += dt;
  if (historyTimer > 0.45) {
    gasHistory.push(snapshotAtmosphere());
    gasHistory = gasHistory.slice(-90);
    historyTimer = 0;
  }
  rememberTimeline();
}

function humanAtmosphereScore() {
  const o2 = gasRatio("O2");
  const co2 = gasRatio("CO2");
  const ch4 = gasRatio("CH4");
  const n2 = gasRatio("N2") + gasRatio("Ar");
  const total = atmosphereTotal();
  const oxygen = scoreRange(o2, [18, 24]);
  const bufferGas = scoreRange(n2, [55, 82]);
  const lowCo2 = clamp(1 - co2 / 4, 0, 1);
  const lowMethane = clamp(1 - ch4 / 3, 0, 1);
  const pressure = clamp(total / 80, 0, 1);
  return Math.round((oxygen * 0.34 + bufferGas * 0.2 + lowCo2 * 0.2 + lowMethane * 0.12 + pressure * 0.14) * 100);
}

function makeBaby(parent) {
  return {
    ...spawnAgent(),
    x: clamp(parent.x + (Math.random() - 0.5) * 0.12, 0.04, 0.96),
    y: clamp(parent.y + (Math.random() - 0.5) * 0.12, 0.16, 0.94),
    energy: 0.68 + Math.random() * 0.12
  };
}

function populationRank(agent) {
  const agePenalty = clamp(agent.age / Math.max(agent.lifespan, 1), 0, 1);
  return agent.fitness * 1.4 + agent.energy * 0.6 + refugeScoreAt(agent.x, agent.y) * 0.8 - agePenalty;
}

function stabilizeViablePopulation(dt, gasScore) {
  if (agents.length >= seedPopulation) return;
  if (gasScore < 0.58 || averageFitness() < 0.5) return;
  const parents = agents.filter((agent) => agent.fitness > 0.52 && agent.energy > 0.35 && refugeScoreAt(agent.x, agent.y) > 0.45);
  if (!parents.length) return;
  const needed = Math.min(seedPopulation - agents.length, Math.ceil(dt * 3));
  for (let i = 0; i < needed; i += 1) {
    agents.push(makeBaby(parents[Math.floor(Math.random() * parents.length)]));
  }
}

function applyMetabolism(dt) {
  const organism = organisms[organismKey];
  for (const agent of agents) {
    if (agent.fitness < 0.36) continue;
    if (refugeScoreAt(agent.x, agent.y) < 0.35) continue;
    const env = envAt(agent.x, agent.y);
    const exchange = gasExchange(organism, env, agent.fitness);
    for (const [gas, delta] of Object.entries(exchange)) {
      atmosphere[gas] = Math.max(0, (atmosphere[gas] || 0) + delta * dt);
    }
  }
  leakAtmosphere(dt);
}

function gasExchange(organism, env, fitness) {
  const activity = Math.max(0, fitness - 0.34) * gasSuitability(organism) * 0.006;
  const energyBonus = clamp(env.energy / 100, 0.2, 1.25);
  const pressureBonus = clamp(env.pressure / 65, 0.18, 1.2);
  const base = activity * energyBonus * pressureBonus;

  if (organismKey === "methanogen") {
    return { CO2: -base * 0.75, H2: -base * 3.0, CH4: base * 0.75 };
  }
  if (organismKey === "chroococcidiopsis" || organismKey === "halophile") {
    const co2 = gasRatio("CO2");
    const o2 = gasRatio("O2");
    const photosynthesisGate = clamp(co2 / 12, 0, 1) * clamp((48 - o2) / 24, 0, 1);
    const respirationGate = 1 - photosynthesisGate;
    return {
      CO2: -base * 0.9 * photosynthesisGate + base * 0.28 * respirationGate,
      O2: base * 0.65 * photosynthesisGate - base * 0.28 * respirationGate
    };
  }
  if (organismKey === "psychro" || organismKey === "shewanella") {
    return { O2: -base * 0.45, CO2: base * 0.45 };
  }
  return {};
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

function drawRefuges(width, height, world) {
  for (const refuge of world.refuges || []) {
    const x = refuge.x * width;
    const y = refuge.y * height;
    const r = refuge.r * Math.min(width, height);
    const glow = ctx.createRadialGradient(x, y, 0, x, y, r);
    glow.addColorStop(0, "rgba(112, 215, 123, .22)");
    glow.addColorStop(0.65, "rgba(103, 215, 230, .1)");
    glow.addColorStop(1, "rgba(103, 215, 230, 0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(112, 215, 123, .35)";
    ctx.lineWidth = 1.4;
    ctx.setLineDash([6, 8]);
    ctx.beginPath();
    ctx.arc(x, y, r * 0.72, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = "rgba(248, 251, 247, .78)";
    ctx.font = "700 12px Segoe UI, Malgun Gothic, sans-serif";
    ctx.fillText("보호 서식지", x - r * 0.52, y - r * 0.58);
  }
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
  const cell = 34;
  for (let y = 0; y < height; y += cell) {
    for (let x = 0; x < width; x += cell) {
      const env = envAt(x / width, y / height);
      const tempAlpha = clamp((env.temp + 120) / 180, 0, 1) * 0.14;
      const saltAlpha = clamp(env.salt / 100, 0, 1) * 0.16;
      const radAlpha = clamp(Math.log10(env.rad + 1) / 4, 0, 1) * 0.24;
      ctx.fillStyle = `rgba(240, 106, 92, ${radAlpha})`;
      ctx.fillRect(x, y, cell, cell);
      ctx.fillStyle = `rgba(103, 215, 230, ${saltAlpha})`;
      ctx.fillRect(x, y, cell, cell);
      ctx.fillStyle = `rgba(240, 180, 77, ${tempAlpha})`;
      ctx.fillRect(x, y, cell, cell);
    }
  }
}

function drawAgents(width, height, organism) {
  for (const agent of agents) {
    const x = agent.x * width;
    const y = agent.y * height;
    const refugeScore = refugeScoreAt(agent.x, agent.y);
    const outsideRefuge = refugeScore <= 0;
    const radius = 2.4 + agent.fitness * 3.8;
    ctx.beginPath();
    ctx.fillStyle = outsideRefuge ? "rgba(240, 106, 92, .72)" : organism.color;
    ctx.shadowColor = outsideRefuge ? "rgba(240, 106, 92, .9)" : organism.color;
    ctx.shadowBlur = outsideRefuge ? 6 : 16 + agent.fitness * 20;
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = outsideRefuge ? "rgba(240, 106, 92, .85)" : `rgba(255,255,255,${0.25 + agent.fitness * 0.55})`;
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
  document.querySelector("#gasFitness").textContent = `${Math.round(gasSuitability() * 100)}%`;
  document.querySelector("#terraform").textContent = `${Math.round(terraform)}%`;
  document.querySelector("#habitability").textContent = `${Math.round(terraform)}%`;
  const nowClimate = climateEffects();
  const local = averageLocalEnv();
  document.querySelector("#greenhouse").textContent = `${nowClimate.greenhouse >= 0 ? "+" : ""}${nowClimate.greenhouse.toFixed(1)}°C`;
  document.querySelector("#shielding").textContent = `${Math.round(nowClimate.shielding * 100)}%`;
  document.querySelector("#metabolism").textContent = metabolismSummary(local);
  const organism = organisms[organismKey];
  document.querySelector("#conditionRange").textContent =
    `${organism.temp[0]}~${organism.temp[1]}°C · 방사선 ${organism.rad[0]}~${organism.rad[1]} mSv/day`;
  updateCriteriaText();

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

function updateCriteriaText() {
  document.querySelector("#criteriaText").textContent = criteriaText(worlds[worldKey], organisms[organismKey]);
}

function criteriaText(world, organism) {
  const gasNeedText = organism.gasNeed
    ? Object.entries(organism.gasNeed).map(([gas, range]) => `${gas} ${range[0]}~${range[1]}%`).join(", ")
    : "특정 기체 제한 없음";
  return [
    `[${world.name} 초기 환경]`,
    `대기: ${world.facts.atmosphere}`,
    `온도: ${world.facts.temperature}`,
    `압력: ${world.facts.pressure}`,
    `방사선: ${world.facts.radiation}`,
    `염도: ${world.facts.salinity}`,
    "",
    `[${organism.name} 생존 조건]`,
    `온도: ${organism.temp[0]}~${organism.temp[1]}°C`,
    `염도: ${organism.salt[0]}~${organism.salt[1]} ppt`,
    `방사선: ${organism.rad[0]}~${organism.rad[1]} mSv/day`,
    `압력: ${organism.pressure[0]}~${organism.pressure[1]} mbar/상대압`,
    `필요 기체: ${gasNeedText}`,
    `대사: ${organism.metabolism}`,
    `근거: ${organism.evidence}`
  ].join("\n");
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
  const env = sampledEnvironment();
  return {
    elapsed,
    CO2: gasRatio("CO2"),
    O2: gasRatio("O2"),
    CH4: gasRatio("CH4"),
    N2: gasRatio("N2"),
    H2O: gasRatio("H2O"),
    H2: gasRatio("H2"),
    temp: env.temp,
    rad: env.rad
  };
}

function sampledEnvironment() {
  const points = [
    [0.25, 0.3], [0.5, 0.3], [0.75, 0.3],
    [0.25, 0.62], [0.5, 0.62], [0.75, 0.62],
    [0.5, 0.82]
  ];
  const sum = points.reduce((acc, [x, y]) => {
    const env = envAt(x, y);
    acc.temp += env.temp;
    acc.rad += env.rad;
    return acc;
  }, { temp: 0, rad: 0 });
  return { temp: sum.temp / points.length, rad: sum.rad / points.length };
}

function drawGasChart() {
  const width = gasChart.clientWidth;
  const height = gasChart.clientHeight;
  chartCtx.clearRect(0, 0, width, height);
  chartCtx.fillStyle = "rgba(255,255,255,.62)";
  chartCtx.font = "11px Segoe UI, Malgun Gothic, sans-serif";
  const mode = graphSelect.value;
  chartCtx.fillText(mode === "gas" ? "시간에 따른 대기 변화" : mode === "temp" ? "시간에 따른 평균 온도 변화" : "시간에 따른 평균 방사선 변화", 10, 18);
  chartCtx.strokeStyle = "rgba(255,255,255,.12)";
  chartCtx.lineWidth = 1;
  for (let i = 1; i < 4; i += 1) {
    const y = 28 + (height - 42) * i / 4;
    chartCtx.beginPath();
    chartCtx.moveTo(10, y);
    chartCtx.lineTo(width - 10, y);
    chartCtx.stroke();
  }

  if (mode !== "gas") {
    drawSingleMetric(mode, width, height);
    return;
  }

  const gases = ["CO2", "O2", "CH4", "N2", "H2O", "H2"].filter((gas) => gasHistory.some((point) => point[gas] > 0.05));
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

function drawSingleMetric(metric, width, height) {
  const values = gasHistory.map((point) => point[metric]).filter((value) => Number.isFinite(value));
  if (!values.length) return;
  const min = metric === "temp" ? Math.min(-220, ...values) : 0;
  const max = metric === "temp" ? Math.max(50, ...values) : Math.max(1, ...values);
  const color = metric === "temp" ? gasColors.CH4 : gasColors.CO2;
  chartCtx.strokeStyle = color;
  chartCtx.lineWidth = 2.5;
  chartCtx.beginPath();
  gasHistory.forEach((point, index) => {
    const value = point[metric];
    const x = 10 + (width - 20) * (gasHistory.length <= 1 ? 0 : index / (gasHistory.length - 1));
    const y = height - 12 - (height - 42) * clamp((value - min) / Math.max(max - min, 1e-6), 0, 1);
    if (index === 0) chartCtx.moveTo(x, y);
    else chartCtx.lineTo(x, y);
  });
  chartCtx.stroke();
  const latest = values.at(-1);
  chartCtx.fillStyle = color;
  chartCtx.fillText(metric === "temp" ? `${latest.toFixed(1)}°C` : `${latest.toFixed(3)} mSv/day`, 10, height - 10);
}

function loop(now) {
  const realDt = Math.min((now - lastTime) / 1000, 0.05);
  lastTime = now;
  const scaledDt = realDt * timeScale * 0.18;
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
