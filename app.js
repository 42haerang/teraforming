const worlds = {
  mars: {
    name: "화성",
    rank: "과거 생명 흔적 / 지하 탐사",
    summary: "춥고 건조하며 방사선이 강하다. 표면 생존보다는 지하 얼음, 염수, 과거 생명 흔적 탐사에 적합하다.",
    facts: {
      temp: "-63°C 평균",
      atmosphere: "CO2 95%, 지구의 0.6%",
      water: "극지방·지하 얼음",
      energy: "표면 방사선 강함"
    },
    scene: "mars",
    microbes: [
      { id: "deinococcus", name: "D. 라디오두란스", x: 31, y: 34, active: false },
      { id: "tardigrade", name: "물곰", x: 48, y: 58, active: false },
      { id: "psychro", name: "저온 미생물", x: 45, y: 74, active: true }
    ],
    scores: { 생존: 42, 대사: 18, 탐사: 76, 테라포밍: 20 },
    conclusion: "현재 표면 생명 가능성은 낮지만, 지하 보호 환경과 과거 물 흔적 때문에 생명 흔적 탐사 가치가 크다."
  },
  europa: {
    name: "유로파",
    rank: "얼음 아래 바다 생명 가능성",
    summary: "표면은 매우 차갑지만 얼음층 아래 액체 바다가 있을 가능성이 크다. 해저 열수구가 있으면 화학합성 생태계와 연결된다.",
    facts: {
      temp: "-160°C 표면",
      atmosphere: "매우 희박, 산소 미량",
      water: "지구 해양의 약 2배 가능",
      energy: "조석 가열, 열수구 가능성"
    },
    scene: "ocean",
    microbes: [
      { id: "shew", name: "고압 미생물", x: 45, y: 54, active: true },
      { id: "vent", name: "화학합성균", x: 67, y: 76, active: true },
      { id: "methano", name: "메탄생성균", x: 61, y: 64, active: true }
    ],
    scores: { 생존: 70, 대사: 63, 탐사: 66, 테라포밍: 55 },
    conclusion: "태양빛 없이도 물과 화학에너지가 만난다면 생명 활동이 가능할 수 있어 지하 바다 탐사 가치가 크다."
  },
  enceladus: {
    name: "엔셀라두스",
    rank: "생명 흔적 직접 탐지 유리",
    summary: "내부 바다 물질이 남극 분출기둥으로 나온다. 유기물, 수소, 메탄이 검출되어 생명 흔적 탐지에 가장 유리하다.",
    facts: {
      temp: "-200°C 표면",
      atmosphere: "수증기 기둥 분출",
      water: "남극 간헐천, 내부 바다",
      energy: "수소·메탄·유기물 검출"
    },
    scene: "ocean",
    microbes: [
      { id: "methano", name: "메탄생성균", x: 58, y: 60, active: true },
      { id: "sulfate", name: "황산염환원균", x: 67, y: 75, active: true },
      { id: "vent", name: "화학합성균", x: 70, y: 78, active: true }
    ],
    scores: { 생존: 78, 대사: 80, 탐사: 92, 테라포밍: 68 },
    conclusion: "내부 바다 조건이 좋고 분출기둥으로 물질이 직접 나오기 때문에 생명 흔적 탐지가 가장 유리하다."
  }
};

const organisms = [
  ["고방사선", "D. 라디오두란스 / 물곰", "DNA 복구, 휴면 생존"],
  ["고압·무산소", "세와넬라 / 거대관벌레 공생계", "심해 열수구와 유사"],
  ["화학합성", "메탄생성균 / 황산염환원균", "수소·황 화합물로 에너지 획득"]
];

let mode = "all";

function render() {
  renderCards();
  renderOrganisms();
  const focus = mode === "all" ? "enceladus" : mode;
  document.querySelector("#headline").textContent = `${worlds[focus].name}: ${worlds[focus].rank}`;
  document.querySelector("#terraformText").textContent =
    mode === "all"
      ? "생명체가 환경을 바꿀 가능성은 단순 생존보다 대사 활동에 달려 있다. 화성은 생존/흔적 보존 중심, 유로파와 엔셀라두스는 지하 바다의 화학합성 생태계 가능성이 핵심이다."
      : worlds[focus].conclusion;
}

function renderCards() {
  document.querySelector("#comparison").innerHTML = Object.entries(worlds).map(([key, world]) => `
    <article class="world-card ${mode !== "all" && mode !== key ? "dimmed" : ""}">
      <div class="world-head">
        <h2>${world.name}<span class="rank">${world.rank}</span></h2>
        <p>${world.summary}</p>
      </div>
      <div class="fact-grid">
        ${Object.entries(world.facts).map(([label, value]) => `
          <div class="fact"><span>${factLabel(label)}</span><strong>${value}</strong></div>
        `).join("")}
      </div>
      ${renderScene(world)}
      <div class="match">
        <h3>생명 가능성 지표</h3>
        <div class="bars">
          ${Object.entries(world.scores).map(([label, value]) => `
            <div class="bar-row">
              <span>${label}</span>
              <div class="bar-track"><div class="bar-fill" style="width:${value}%; background:${barColor(value)}"></div></div>
              <strong>${value}</strong>
            </div>
          `).join("")}
        </div>
      </div>
    </article>
  `).join("");
}

function factLabel(key) {
  return { temp: "온도", atmosphere: "대기", water: "물", energy: "에너지/특징" }[key];
}

function renderScene(world) {
  const isMars = world.scene === "mars";
  return `
    <div class="scene">
      ${isMars ? `
        <div class="layer surface"><div>표면<small>저온·건조·고방사선</small></div></div>
        <div class="layer subsurface"><div>지하<small>얼음/염수 가능성</small></div></div>
      ` : `
        <div class="layer ice"><div>얼음 지각<small>표면은 극저온</small></div></div>
        <div class="layer ocean"><div>지하 바다<small>액체 물 + 고압</small></div></div>
        <div class="layer rock"><div>암석 해저<small>열수구 가능성</small></div></div>
        <div class="vent"></div>
      `}
      <div class="hazard">${renderRays(isMars ? 12 : 4)}</div>
      ${world.microbes.map((m, i) => `
        <div class="microbe ${m.active ? "active" : ""}" title="${m.name}" style="left:${m.x}%; top:${m.y}%; color:${microbeColor(m.id)}; background:${microbeColor(m.id)}"></div>
      `).join("")}
    </div>
  `;
}

function renderRays(count) {
  return Array.from({ length: count }, (_, i) => `<span class="ray" style="left:${8 + i * (84 / Math.max(1, count - 1))}%"></span>`).join("");
}

function microbeColor(id) {
  return {
    deinococcus: "#e46f62",
    tardigrade: "#e9bd5d",
    psychro: "#78aee8",
    shew: "#59d6d6",
    vent: "#83d768",
    methano: "#83d768",
    sulfate: "#b08ae8"
  }[id] || "#59d6d6";
}

function barColor(value) {
  if (value >= 70) return "var(--good)";
  if (value >= 45) return "var(--mid)";
  return "var(--bad)";
}

function renderOrganisms() {
  document.querySelector("#organismMap").innerHTML = organisms.map(([type, examples, mechanism]) => `
    <div class="organism">
      <strong>${type}</strong>
      <span>${examples}</span>
      <span>${mechanism}</span>
    </div>
  `).join("");
}

document.querySelector(".toolbar").addEventListener("click", (event) => {
  const button = event.target.closest("[data-mode]");
  if (!button) return;
  mode = button.dataset.mode;
  document.querySelectorAll(".mode").forEach((item) => item.classList.toggle("active", item === button));
  render();
});

render();
