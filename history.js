const observer = new IntersectionObserver((entires) => {
    entires.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add(`show`);
        } else {
            entry.target.classList.remove(`show`);
        }

    });

});

const hiddenElements = document.querySelectorAll(`.hidden, .hidden2`);
hiddenElements.forEach((el) => observer.observe(el));


const seasonInput = document.querySelector("#seasonSelect");

seasonInput.addEventListener("input", function () {
  const season = Number(seasonInput.value);

  if (season < 1950 || season > 2026) {
    seasonInput.classList.add("invalid-year")
  } else {
    seasonInput.classList.remove("invalid.year")
  }

});

 const seasonImages = {
  1950: [
    "assets/images/years/1950s/image-1.jpg",
    "assets/images/years/1950s/image-2.webp",
    "assets/images/years/1950s/image-3.jpg"
  ],

  1960: [
    "assets/images/years/1960s/image-1.webp",
    "assets/images/years/1960s/image-2.webp",
    "assets/images/years/1960s/image-3.webp"
  ],

  1970: [
    "assets/images/years/1970s/image-1.jpg",
    "assets/images/years/1970s/image-2.jpg",
    "assets/images/years/1970s/image-3.webp"
  ],

  1980: [
    "assets/images/years/1980s/image-1.jpg",
    "assets/images/years/1980s/image-2.jpg",
    "assets/images/years/1980s/image-3.webp"
  ],

  1990: [
    "assets/images/years/1990s/image-1.jpg",
    "assets/images/years/1990s/image-2.jpg",
    "assets/images/years/1990s/image-3.jpg"
  ],

  2000: [
    "assets/images/years/2000s/image-1.jpg",
    "assets/images/years/2000s/image-2.jpg",
    "assets/images/years/2000s/image-3.jpg"
  ],

  2010: [
    "assets/images/years/2010s/image-1.jpg",
    "assets/images/years/2010s/image-2.jpg",
    "assets/images/years/2010s/image3.jpg"
  ],

  2020: [
    "assets/images/years/2020s/image-1.jpg",
    "assets/images/years/2020s/image-2.png",
    "assets/images/years/2020s/image-3.webp"
  ]
};

const countryToFlagCode = {
  "Argentina": "ar",
  "Australia": "au",
  "Austria": "at",
  "Azerbaijan": "az",
  "Bahrain": "bh",
  "Belgium": "be",
  "Brazil": "br",
  "Canada": "ca",
  "China": "cn",
  "France": "fr",
  "Germany": "de",
  "Hungary": "hu",
  "India": "in",
  "Italy": "it",
  "Japan": "jp",
  "Malaysia": "my",
  "Mexico": "mx",
  "Monaco": "mc",
  "Morocco": "ma",
  "Netherlands": "nl",
  "Portugal": "pt",
  "Qatar": "qa",
  "Russia": "ru",
  "Saudi Arabia": "sa",
  "Singapore": "sg",
  "South Africa": "za",
  "South Korea": "kr",
  "Spain": "es",
  "Sweden": "se",
  "Switzerland": "ch",
  "Turkey": "tr",
  "United Arab Emirates": "ae",
  "United Kingdom": "gb",
  "United States": "us",

  "USA": "us",
  "US": "us",
  "U.S.": "us",
  "U.S.A.": "us",
  "America": "us",

  "UK": "gb",
  "Great Britain": "gb",
  "Britain": "gb",
  "England": "gb",

  "UAE": "ae",
  "Abu Dhabi": "ae",

  "Korea": "kr",
  "Republic of Korea": "kr",

  "Türkiye": "tr",
  "Turkiye": "tr",

  "The Netherlands": "nl"
};


document.querySelector("#loadSeasonBtn").addEventListener("click", function () {
  const season = Number(seasonInput.value);

  if (season < 1950 || season > 2026) {
    seasonInput.classList.add("invalid-year");
    return;
    
  }

  seasonInput.classList.remove("invalid-year");
  
  
  Promise.all([
  fetch(`https://api.jolpi.ca/ergast/f1/${season}/driverstandings/`)
    .then((res) => {
      if (!res.ok) {
        throw new Error("Driver standings API failed");
      }

      return res.json();
    }),

  fetch(`https://api.jolpi.ca/ergast/f1/${season}/constructorstandings/`)
    .then((res) => {
      if (!res.ok) {
        throw new Error("Constructor standings API failed");
      }

      return res.json();
    }),

  fetch(`https://api.jolpi.ca/ergast/f1/${season}/races/`)
    .then((res) => {
      if (!res.ok) {
        throw new Error("Race schedule API failed");
      }

      return res.json();
    }),

  fetch(`https://api.jolpi.ca/ergast/f1/${season}/results/1/`)
    .then((res) => {
      if (!res.ok) {
        throw new Error("Race results API failed");
      }

      return res.json();
    })
  ])
  .then(([driverData, constructorData, raceData, resultsData]) => {
    const champion =
      driverData.MRData.StandingsTable.StandingsLists[0].DriverStandings[0];

    const championName =
      `${champion.Driver.givenName} ${champion.Driver.familyName}`;

    const championTeam =
      champion.Constructors[0].name;


    let constructorChamp;
    let constructorName;
    let constructorPoints;

    
    if (constructorData.MRData.StandingsTable.StandingsLists[0] &&
        constructorData.MRData.StandingsTable.StandingsLists[0].ConstructorStandings
    )  {
    
    constructorChamp =
      constructorData.MRData.StandingsTable.StandingsLists[0].ConstructorStandings[0];

    constructorName = constructorChamp.Constructor.name;
    constructorPoints = constructorChamp.points;
    } else {
        constructorName = "Not Awarded";
        constructorPoints = "N/A"
    }

    
    const races = raceData.MRData.RaceTable.Races;
    const previewRaces = races
    const year = raceData.MRData.RaceTable.season;
    const results = raceData.MRData.RaceTable.Results;
    const resultRaces = resultsData.MRData.RaceTable.Races;
    const previewResultRaces = resultRaces

    const seasonStartDate = races[0].date;
    const seasonEndDate = races[races.length - 1].date;
    const raceCount = races.length;


    
    const infoBox = document.querySelector(".info-box");

    infoBox.innerHTML = "";

    previewResultRaces.forEach((race) => {
      const country = race.Circuit.Location.country;
      const flagCode = countryToFlagCode[country] || "un";
      

      const result = race.Results[0];
      const winnerName = `${result.Driver.givenName} ${result.Driver.familyName}`;
      const winnerTeam = result.Constructor.name;
      const winnerTime = result.Time?.time || "-";

      infoBox.innerHTML += `
    <div class="info-row">
      <span>${race.round}</span>

      <span class="grand-prix-cell">
        <span class="fi fi-${flagCode}"></span>
        <span>${race.raceName}</span>
      </span>

      <span>${race.date}</span>
      <span>${winnerName}</span>
      <span>${winnerTeam}</span>
      <span>${winnerTime}</span>
    </div>
  `;

  });

  infoBox.scrollTop = 0;

    const formattedStartDate = new Date(seasonStartDate).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric"
    });

    const formattedEndDate = new Date(seasonEndDate).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric"
    });

    const decade = Math.floor(season / 10) * 10;
    const imagesForDecade = seasonImages[decade];

    const randomIndex = Math.floor(Math.random() * imagesForDecade.length);
    const randomImage = imagesForDecade[randomIndex];

    document.querySelector(".direct-image").src = randomImage;
    document.querySelector(".direct-image").alt = `${season} Formula 1 season image`;


    document.querySelector(".champ").innerHTML =
      `${championName}<br>`;

    document.querySelector(".team-name").textContent =
      championTeam;

    document.querySelector(".constructor-team").innerHTML =
      `${constructorName}<br>`;

    document.querySelector(".points").innerHTML =
    `${constructorPoints} Points`;

    document.querySelector(".race-count").innerHTML =
      `${raceCount}<br>`;

    document.querySelector(".year").textContent =
      year;

    document.querySelector(".card-label").textContent =
      year;

    document.querySelector(".year-header").textContent =
      `${year} FIA Formula One World Championship`;

    document.querySelector(".dates").innerHTML =
      `${formattedStartDate} - ${formattedEndDate}<br>`;

    const constructorText =
        constructorName === "Not Awarded"
        ? "The Constructors' Championship was not awarded that season."
        : `The Constructors' Championship was won by ${constructorName} with ${constructorPoints} points.`;
    
    if (season == "2026") {
      document.querySelector(".season-desc").textContent =
      `The ${season} Formula 1 season has not conceeded! Check back soon for more updates!`
      } else {
        
        document.querySelector(".season-desc").textContent =
        `The ${season} Formula 1 season featured ${raceCount} races, with ${championName} winning the World Drivers' Championship for ${championTeam}. ${constructorText}`;
      }
      
  
  
    document.querySelector(".card-title").textContent =
      `${year}  RACE RESULTS`;


  })
  .catch((error) => {
  console.error(error);
  alert("The F1 season data API is currently unavailable. Showing the default season data instead.");
  });
});


   
