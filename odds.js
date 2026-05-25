const KALSHI_BASE = "https://external-api.kalshi.com/trade-api/v2";

const KALSHI_DRIVERS_PAGE = "https://kalshi.com/markets/kxf1/formula-1/kxf1-26";
const KALSHI_CONSTRUCTORS_PAGE = "https://kalshi.com/markets/kxf1constructors/formula-1-constructors/kxf1constructors-26";

const POLY_DRIVERS_PAGE = "https://polymarket.com/event/2026-f1-drivers-champion";
const POLY_CONSTRUCTORS_PAGE = "https://polymarket.com/event/f1-constructors-champion";

const POLY_DRIVERS_URL = "https://gamma-api.polymarket.com/events/slug/2026-f1-drivers-champion";
const POLY_CONSTRUCTORS_URL = "https://gamma-api.polymarket.com/events/slug/f1-constructors-champion";

const teamLogos = {
  "Mercedes AMG Motorsport": "https://media.formula1.com/image/upload/c_lfill,w_48/q_auto/v1740000001/common/f1/2026/mercedes/2026mercedeslogowhite.webp",
  "Mercedes": "https://media.formula1.com/image/upload/c_lfill,w_48/q_auto/v1740000001/common/f1/2026/mercedes/2026mercedeslogowhite.webp",
  "Ferrari": "https://media.formula1.com/image/upload/c_lfill,w_48/q_auto/v1740000001/common/f1/2026/ferrari/2026ferrarilogowhite.webp",
  "McLaren": "https://media.formula1.com/image/upload/c_lfill,w_48/q_auto/v1740000001/common/f1/2026/mclaren/2026mclarenlogowhite.webp",
  "Red Bull Racing": "https://media.formula1.com/image/upload/c_lfill,w_48/q_auto/v1740000001/common/f1/2026/redbullracing/2026redbullracinglogowhite.webp",
  "Alpine": "https://media.formula1.com/image/upload/c_lfill,w_48/q_auto/v1740000001/common/f1/2026/alpine/2026alpinelogowhite.webp",
  "Aston Martin": "https://media.formula1.com/image/upload/c_lfill,w_48/q_auto/v1740000001/common/f1/2026/astonmartin/2026astonmartinlogowhite.webp",
  "Audi": "https://media.formula1.com/image/upload/c_lfill,w_48/q_auto/v1740000001/common/f1/2026/audi/2026audilogowhite.webp",
  "Williams": "https://media.formula1.com/image/upload/c_lfill,w_48/q_auto/v1740000001/common/f1/2026/williams/2026williamslogowhite.webp",
  "Racing Bulls": "https://media.formula1.com/image/upload/c_lfill,w_48/q_auto/v1740000001/common/f1/2026/racingbulls/2026racingbullslogowhite.webp",
  "Cadillac": "https://media.formula1.com/image/upload/c_lfill,w_48/q_auto/v1740000001/common/f1/2026/cadillac/2026cadillaclogowhite.webp",
  "Haas": "https://media.formula1.com/image/upload/c_lfill,w_48/q_auto/v1740000001/common/f1/2026/haasf1team/2026haasf1teamlogowhite.webp"
};

const teamColors = {
  "Mercedes AMG Motorsport": "blue-line",
  "Mercedes": "blue-line",
  "Ferrari": "red-line",
  "McLaren": "orange-line",
  "Red Bull Racing": "blue-line",
  "Alpine": "blue-line",
  "Aston Martin": "teal-line",
  "Audi": "red-line",
  "Williams": "blue-line",
  "Racing Bulls": "blue-line",
  "Cadillac": "red-line",
  "Haas": "red-line"
};

const driverTeams = {
  "Andrea Kimi Antonelli": "Mercedes AMG Motorsport",
  "Kimi Antonelli": "Mercedes AMG Motorsport",
  "George Russell": "Mercedes AMG Motorsport",
  "Lando Norris": "McLaren",
  "Oscar Piastri": "McLaren",
  "Max Verstappen": "Red Bull Racing",
  "Charles Leclerc": "Ferrari",
  "Lewis Hamilton": "Ferrari",
  "Fernando Alonso": "Aston Martin",
  "Lance Stroll": "Aston Martin",
  "Carlos Sainz Jr.": "Williams",
  "Alexander Albon": "Williams",
  "Pierre Gasly": "Alpine",
  "Franco Colapinto": "Alpine",
  "Valtteri Bottas": "Cadillac",
  "Sergio Perez": "Cadillac",
  "Nico Hulkenberg": "Audi",
  "Gabriel Bortoleto": "Audi",
  "Oliver Bearman": "Haas",
  "Esteban Ocon": "Haas",
  "Liam Lawson": "Racing Bulls",
  "Isack Hadjar": "Racing Bulls",
  "Arvid Lindblad": "Racing Bulls"
};

const kalshiBtn = document.getElementById("kalshiBtn");
const polymarketBtn = document.getElementById("polymarketBtn");

function getCleanTeamName(name) {
  if (name === "Mercedes AMG Motorsport") return "Mercedes";
  return name;
}

function getDriverTeamFromKalshi(market) {
  if (!market.subtitle) return "Unknown Team";

  return market.subtitle
    .replace("::", "")
    .trim();
}

function getKalshiPercent(market) {
  if (market.last_price_dollars !== undefined && market.last_price_dollars !== null) {
    return Math.round(Number(market.last_price_dollars) * 100);
  }

  return 0;
}

function getPolyOutcomePrices(market) {
  if (!market.outcomePrices) return [];

  if (Array.isArray(market.outcomePrices)) {
    return market.outcomePrices;
  }

  try {
    return JSON.parse(market.outcomePrices);
  } catch {
    return [];
  }
}

function getPolyPercent(market) {
  const prices = getPolyOutcomePrices(market);
  const yesPrice = prices[0];

  if (yesPrice === undefined || yesPrice === null || yesPrice === "") {
    return 0;
  }

  return Math.round(Number(yesPrice) * 100);
}

function getPolyName(question) {
  return question
    .replace("Will ", "")
    .replace(" be the 2026 F1 Drivers' Champion?", "")
    .replace(" be the 2026 F1 Constructors' Champion?", "")
    .replace(" win the 2026 F1 Constructors Championship?", "")
    .trim();
}

function isRealPolyMarket(name) {
  const blockedNames = [
    "Driver A",
    "Driver B",
    "Driver C",
    "Driver D",
    "Driver E",
    "Driver F",
    "Driver G",
    "Driver H",
    "Driver I",
    "Another Driver",
    "Other"
  ];

  return !blockedNames.includes(name);
}

function cleanKalshiDrivers(markets) {
  return markets
    .map(market => ({
      name: market.yes_sub_title || market.subtitle || market.title,
      team: getDriverTeamFromKalshi(market),
      percent: getKalshiPercent(market),
      ticker: market.ticker
    }))
    .sort((a, b) => b.percent - a.percent);
}

function cleanKalshiConstructors(markets) {
  return markets
    .map(market => ({
      name: market.yes_sub_title || market.subtitle || market.title,
      percent: getKalshiPercent(market),
      ticker: market.ticker
    }))
    .sort((a, b) => b.percent - a.percent);
}

function cleanPolyDrivers(markets) {
  return markets
    .filter(market => market.active && !market.closed)
    .map(market => {
      const name = getPolyName(market.question);

      return {
        name: name,
        team: driverTeams[name] || "Unknown Team",
        percent: getPolyPercent(market),
        ticker: market.slug
      };
    })
    .filter(driver => isRealPolyMarket(driver.name))
    .sort((a, b) => b.percent - a.percent);
}

function cleanPolyConstructors(markets) {
  return markets
    .filter(market => market.active && !market.closed)
    .map(market => {
      const name = getPolyName(market.question);

      return {
        name: name,
        percent: getPolyPercent(market),
        ticker: market.slug
      };
    })
    .filter(team => isRealPolyMarket(team.name))
    .sort((a, b) => b.percent - a.percent);
}

function renderDriverOdds(drivers) {
  const driversList = document.getElementById("driversOddsList");

  if (!driversList) {
    return;
  }

  const topDrivers = drivers.slice(0, 5);

  driversList.innerHTML = topDrivers.map((driver, index) => {
    const lineClass = teamColors[driver.team] || "red-line";

    return `
      <div class="odds-row">
        <div class="rank">${index + 1}</div>

        <div class="driver-info ${lineClass}">
          <strong>${driver.name}</strong>
          <span>${getCleanTeamName(driver.team)}</span>
        </div>

        <div class="mini-graph"></div>

        <div class="percent">${driver.percent}%</div>

        <div class="change neutral">LIVE</div>
      </div>
    `;
  }).join("");
}

function renderConstructorOdds(constructors) {
  const constructorsList = document.getElementById("constructorsOddsList");

  if (!constructorsList) {
    return;
  }

  const topConstructors = constructors.slice(0, 5);

  constructorsList.innerHTML = topConstructors.map((team, index) => {
    const logo = teamLogos[team.name] || "";

    return `
      <div class="odds-row constructor-row">
        <div class="rank">${index + 1}</div>

        <div class="team-info">
          ${logo ? `<img class="team-logo" src="${logo}" alt="${getCleanTeamName(team.name)} logo">` : ""}
          <strong>${getCleanTeamName(team.name)}</strong>
        </div>

        <div class="mini-graph"></div>

        <div class="percent">${team.percent}%</div>

        <div class="change neutral">LIVE</div>
      </div>
    `;
  }).join("");
}

function setSourceLabels(sourceName) {
  const driversLabel = document.getElementById("driversSourceLabel");
  const constructorsLabel = document.getElementById("constructorsSourceLabel");

  if (driversLabel) {
    driversLabel.textContent = `${sourceName} markets aggregated ⓘ`;
  }

  if (constructorsLabel) {
    constructorsLabel.textContent = `${sourceName} markets aggregated ⓘ`;
  }
}

function setActiveSource(source) {
  if (kalshiBtn) {
    kalshiBtn.classList.toggle("active", source === "kalshi");
  }

  if (polymarketBtn) {
    polymarketBtn.classList.toggle("active", source === "polymarket");
  }
}

function updateLiveOddsLinks(source) {
  const liveLinks = document.querySelectorAll(".live-odds-label");

  if (liveLinks.length < 2) {
    return;
  }

  if (source === "kalshi") {
    liveLinks[0].href = KALSHI_DRIVERS_PAGE;
    liveLinks[1].href = KALSHI_CONSTRUCTORS_PAGE;
  }

  if (source === "polymarket") {
    liveLinks[0].href = POLY_DRIVERS_PAGE;
    liveLinks[1].href = POLY_CONSTRUCTORS_PAGE;
  }
}

function showLoadingRows() {
  const driversList = document.getElementById("driversOddsList");
  const constructorsList = document.getElementById("constructorsOddsList");

  const loadingRow = `
    <div class="odds-row">
      <div class="rank">...</div>
      <div class="driver-info red-line">
        <strong>Loading live odds</strong>
        <span>Fetching market data</span>
      </div>
      <div class="mini-graph"></div>
      <div class="percent">--</div>
      <div class="change neutral">WAIT</div>
    </div>
  `;

  if (driversList) driversList.innerHTML = loadingRow;
  if (constructorsList) constructorsList.innerHTML = loadingRow;
}

function showErrorRows(sourceName) {
  const driversList = document.getElementById("driversOddsList");
  const constructorsList = document.getElementById("constructorsOddsList");

  const errorRow = `
    <div class="odds-row">
      <div class="rank">!</div>
      <div class="driver-info red-line">
        <strong>${sourceName} data failed</strong>
        <span>Market data unavailable</span>
      </div>
      <div class="mini-graph"></div>
      <div class="percent">--</div>
      <div class="change neutral">ERR</div>
    </div>
  `;

  if (driversList) driversList.innerHTML = errorRow;
  if (constructorsList) constructorsList.innerHTML = errorRow;
}

async function fetchJson(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Fetch failed: ${response.status}`);
  }

  return response.json();
}

async function updateOdds() {
  const driversUrl = `${KALSHI_BASE}/markets?series_ticker=KXF1&status=open&limit=1000`;
  const constructorsUrl = `${KALSHI_BASE}/markets?series_ticker=KXF1CONSTRUCTORS&status=open&limit=1000`;

  setActiveSource("kalshi");
  setSourceLabels("Kalshi");
  updateLiveOddsLinks("kalshi");
  showLoadingRows();

  try {
    const driversData = await fetchJson(driversUrl);
    const constructorsData = await fetchJson(constructorsUrl);

    const cleanDrivers = cleanKalshiDrivers(driversData.markets || []);
    const cleanConstructors = cleanKalshiConstructors(constructorsData.markets || []);

    renderDriverOdds(cleanDrivers);
    renderConstructorOdds(cleanConstructors);
  } catch (error) {
    console.error("Kalshi fetch failed:", error);
    showErrorRows("Kalshi");
  }
}

async function updatePolymarketOdds() {
  setActiveSource("polymarket");
  setSourceLabels("Polymarket");
  updateLiveOddsLinks("polymarket");
  showLoadingRows();

  try {
    const driversData = await fetchJson(POLY_DRIVERS_URL);
    const constructorsData = await fetchJson(POLY_CONSTRUCTORS_URL);

    const cleanDrivers = cleanPolyDrivers(driversData.markets || []);
    const cleanConstructors = cleanPolyConstructors(constructorsData.markets || []);

    renderDriverOdds(cleanDrivers);
    renderConstructorOdds(cleanConstructors);
  } catch (error) {
    console.error("Polymarket fetch failed:", error);
    showErrorRows("Polymarket");
  }
}

let currentSource = "polymarket";

if (kalshiBtn) {
  kalshiBtn.addEventListener("click", function () {
    currentSource = "kalshi";
    updateOdds();
  });
}

if (polymarketBtn) {
  polymarketBtn.addEventListener("click", function () {
    currentSource = "polymarket";
    updatePolymarketOdds();
  });
}

updatePolymarketOdds();

setInterval(function () {
  if (currentSource === "kalshi") {
    updateOdds();
  } else {
    updatePolymarketOdds();
  }
}, 10000);
