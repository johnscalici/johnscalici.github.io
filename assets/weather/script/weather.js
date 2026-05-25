  fetch("assets/weather/icons/wind.svg")
  .then(response => response.text())
  .then(svg => {
    document.querySelector(".windy-icon-slot").innerHTML = svg;
  });

  fetch("assets/weather/icons/rain_drops.svg")
  .then(response => response.text())
  .then(svg => {
    document.querySelector(".rain-icon-slot").innerHTML = svg;
  });


  function getWeatherDisplay(weatherCode, precipitation) {
  if (precipitation > 0.02) {
    return {
      icon: "rainy",
      condition: "Rain"
    };
  }

  if (weatherCode === 0) {
    return {
      icon: "sunny",
      condition: "Clear"
    };
  }

  if (weatherCode === 1) {
    return {
      icon: "sunny",
      condition: "Mostly Clear"
    };
  }

  if (weatherCode === 2) {
    return {
      icon: "partly-cloudy",
      condition: "Partly Cloudy"
    };
  }

  if (weatherCode === 3) {
    return {
      icon: "cloudy",
      condition: "Cloudy"
    };
  }

  if ([45, 48].includes(weatherCode)) {
    return {
      icon: "cloudy",
      condition: "Fog"
    };
  }

  if ([51, 53, 55].includes(weatherCode)) {
    return {
      icon: "cloudy",
      condition: "Drizzle"
    };
  }

  if ([61, 63, 65, 80, 81, 82].includes(weatherCode)) {
    return {
      icon: "rainy",
      condition: "Rain"
    };
  }

  if ([95, 96, 99].includes(weatherCode)) {
    return {
      icon: "storm",
      condition: "Storm"
    };
  }

  return {
    icon: "cloudy",
    condition: "Cloudy"
  };
}



 /* const weatherURL = "https://archive-api.open-meteo.com/v1/archive?latitude=25.95806&longitude=-80.23889&start_date=2026-05-03&end_date=2026-05-03&hourly=temperature_2m,precipitation,wind_speed_10m,wind_direction_10m,weather_code&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch&timezone=America%2FNew_York";

  fetch(weatherURL)
  .then(response => response.json())
  .then(data => {
    const raceHour = "2026-05-03T13:00";
    const time = data.hourly.time;
    const index = time.indexOf(raceHour)

    const temp = data.hourly.temperature_2m[index];
    const precipitation = data.hourly.precipitation[index];
    const wind = data.hourly.wind_speed_10m[index];
    const weatherCode = data.hourly.weather_code[index];
    const weatherDisplay = getWeatherDisplay(weatherCode, precipitation);

    document.querySelector(".weather-temp").textContent = `${Math.round(temp)}°F`;
    document.querySelector(".weather-condition").textContent = weatherDisplay.condition;
    document.querySelector(".weather-wind").textContent = `${Math.round(wind)} mph`;
    document.querySelector(".weather-rain").textContent = `${precipitation} in`;
    document.querySelector(".weather-time-value").textContent = "1:00 PM";

    const path = (`assets/weather/icons/${weatherDisplay.icon}.svg`);
    
    fetch(path)
    .then(response => response.text())
    .then(svg => {
    document.querySelector(".weather-icon-slot").innerHTML = svg;
    });

  });

*/

// Canadian GP — Circuit Gilles-Villeneuve
// Source - Honda Racing’s 2026 Canadian GP race report

document.querySelector(".weather-temp").textContent = "54°F";
document.querySelector(".weather-condition").textContent = "Light Rain";
document.querySelector(".weather-wind").textContent = "Track 63°F";
document.querySelector(".weather-rain").textContent = "Damp";
document.querySelector(".weather-time-value").textContent = "4:00 PM";


fetch("assets/weather/icons/rainy.svg")
  .then(response => response.text())
  .then(svg => {
    document.querySelector(".weather-icon-slot").innerHTML = svg;
  });


fetch("assets/weather/icons/windy.svg")
  .then(response => response.text())
  .then(svg => {
    document.querySelector(".windy-icon-slot").innerHTML = svg;
  });


fetch("assets/weather/icons/rain_drops.svg")
  .then(response => response.text())
  .then(svg => {
    document.querySelector(".rain-icon-slot").innerHTML = svg;
  });
