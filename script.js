const phrases = [
  "Live Drivers' Championship prediction market tracking",
  "Real-time Grand Prix schedule updates",
  "Driver and constructor standings",
  "Historical race and season data",
  "Latest race weekend information",
  "Live market movement and odds shifts",
  "Circuit, session, and event details",
  "Recent results and podium finishes",
  "Formula 1 insights in one place",
  "Track the season race by race"
];

const typingText = document.getElementById("typing-text");

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;

const typingSpeed = 60;
const deletingSpeed = 35;
const pauseAfterTyping = 1200;

function typeLoop() {
  const currentPhrase = phrases[phraseIndex];

  if (isDeleting === false) {
    charIndex++;
    typingText.textContent = currentPhrase.substring(0, charIndex);

    if (charIndex < currentPhrase.length) {
      setTimeout(typeLoop, typingSpeed);
    } else {
      isDeleting = true;
      setTimeout(typeLoop, pauseAfterTyping);
    }
  } else {
    charIndex--;
    typingText.textContent = currentPhrase.substring(0, charIndex);

    if (charIndex > 0) {
      setTimeout(typeLoop, deletingSpeed);
    } else {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      setTimeout(typeLoop, typingSpeed);
    }
  }
}

typeLoop();


function updateResults() {
  fetch("https://api.jolpi.ca/ergast/f1/2026/5/results/?format=json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Race Results API failed")
      }

      return response.json();
    })
    .then((data) => {
      const driverOrder = data.MRData.RaceTable.Races[0].Results
        .sort((a, b) => Number(a.positionOrder) - Number(b.positionOrder))
        .map(result => {
          let driverName = " " + result.Driver.givenName + " " + result.Driver.familyName;
        if (result.Driver.givenName === "Andrea Kimi") {
          driverName = " A. Kimi " + result.Driver.familyName;
        }

        return result.position + "." + driverName;
      });

      
      const resultsList = document.querySelector(".left-results-list")
      resultsList.innerHTML = "";

      driverOrder.slice(0, 10).forEach(driver => {
        const row = document.createElement("div");
        row.className = "left-results-row";
        row.innerHTML = `<span>${driver}</span>`;
        resultsList.appendChild(row);
    });
  
  })
  .catch((error) => {
      console.error(error);
      alert("The race results API is currently unavailable.");
   });
}

updateResults();


function dcResults() {
  fetch("https://api.jolpi.ca/ergast/f1/2026/driverstandings/?format=json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Race Results API failed")
      }

      return response.json();
    })

      .then((data) => {
      const standings = data.MRData.StandingsTable.StandingsLists[0].DriverStandings;
      const driverLeaderboard = standings.map(driver => {
      let driverName = `${driver.Driver.givenName} ${driver.Driver.familyName}`;
      
      if (driver.Driver.givenName === "Andrea Kimi") {
        driverName = "A. Kimi " + driver.Driver.familyName;
      }

      return {
      position: driver.position,
      name: driverName,
      points: driver.points
      };
    });
      const rcResults = document.querySelector(".right-results-list")
      rcResults.innerHTML = "";

      driverLeaderboard.slice(0, 10).forEach(driver => {
        const row = document.createElement("div");
        row.className = "right-results-row";

        row.innerHTML =  `
          <span>${driver.position}. ${driver.name}</span>
          <span>${driver.points} pts</span>
        `;

        rcResults.appendChild(row)
      });
    
    })
    .catch((error) => {
      console.error(error);
      alert("The driver standings leaderboard API is currently unavailable.");
    });
}

dcResults();

