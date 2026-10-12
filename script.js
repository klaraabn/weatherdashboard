// Open-Meteo endpoints 
const GEO_URL = "https://geocoding-api.open-meteo.com/v1/search";
const WEATHER_URL = "https://api.open-meteo.com/v1/forecast";

// Default location for Mansourieh 
const MANSOURIEH = { name: "Mansourieh", country: "Lebanon", latitude: 33.866, longitude: 35.583 };

// Weather condition codes mapping
const WEATHER_CODES = {
  0: { icon: "☀️", text: "Clear sky" },
  1: { icon: "🌤️", text: "Mainly clear" },
  2: { icon: "⛅", text: "Partly cloudy" },
  3: { icon: "☁️", text: "Overcast" },
  45: { icon: "🌫️", text: "Foggy" },
  61: { icon: "🌧️", text: "Light rain" },
  63: { icon: "🌧️", text: "Rain" },
  71: { icon: "❄️", text: "Snow" },
  95: { icon: "⛈️", text: "Thunderstorm" }
};

const form = document.querySelector("#search-form");
const input = document.querySelector("#city-input");
const loadingEl = document.querySelector("#loading");
const errorEl = document.querySelector("#error-message");
const resultsEl = document.querySelector("#results");

const placeEl = document.querySelector("#place");
const dateEl = document.querySelector("#date");
const iconEl = document.querySelector("#icon");
const tempEl = document.querySelector("#temp");
const conditionsEl = document.querySelector("#conditions");
const feelsEl = document.querySelector("#feels");
const humidityEl = document.querySelector("#humidity");
const windEl = document.querySelector("#wind");
const forecastEl = document.querySelector("#forecast");

async function fetchJSON(url) {
  try {
    const response = await fetch(url);
    
    // Explicitly handle non-200 responses
    if (!response.ok) {
      throw new Error(`Server error: status ${response.status}`);
    }
    
    return await response.json();
  } catch (err) {
    // Re-throw so caller try/catch block catches it
    throw err;
  }
}

// Find coordinates 
async function findCity(cityName) {
  if (cityName.toLowerCase().includes("mansourieh")) {
    return MANSOURIEH;
  }

  try {
    const data = await fetchJSON(`${GEO_URL}?name=${encodeURIComponent(cityName)}&count=1`);
    
    if (!data.results || data.results.length === 0) {
      throw new Error("City not found");
    }
    
    return data.results[0];
  } catch (err) {
    throw err;
  }
}

// Main fetch function 
async function loadWeather(cityName) {
  // Show loading indicator, hide results & errors
  loadingEl.hidden = false;
  errorEl.hidden = true;
  resultsEl.hidden = true;

  try {
    const loc = await findCity(cityName);
    
    const weatherUrl = `${WEATHER_URL}?latitude=${loc.latitude}&longitude=${loc.longitude}&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`;
    const weatherData = await fetchJSON(weatherUrl);

    // Update screen with weather details
    renderWeather(loc, weatherData);
  } catch (err) {
    // Handle error messages cleanly 
    errorEl.textContent = err.message === "City not found" 
      ? `Could not find city "${cityName}". Please check spelling.` 
      : "Failed to load weather data. Please check your internet connection.";
    errorEl.hidden = false;
  } finally {
    // hide loading spinner when finished
    loadingEl.hidden = true;
  }
}


function renderWeather(loc, data) {
  const current = data.current;
  const daily = data.daily;
  const info = WEATHER_CODES[current.weather_code] || { icon: "🌡️", text: "Unknown" };

  placeEl.textContent = `${loc.name}, ${loc.country || "Lebanon"}`;
  dateEl.textContent = new Date().toDateString();
  iconEl.textContent = info.icon;
  tempEl.textContent = `${Math.round(current.temperature_2m)}°C`;
  conditionsEl.textContent = info.text;
  feelsEl.textContent = `${Math.round(current.apparent_temperature)}°C`;
  humidityEl.textContent = `${current.relative_humidity_2m}%`;
  windEl.textContent = `${Math.round(current.wind_speed_10m)} km/h`;


  forecastEl.innerHTML = "";
  for (let i = 0; i < 3; i++) {
    const dayName = new Date(daily.time[i]).toLocaleDateString("en-US", { weekday: "short" });
    const dayInfo = WEATHER_CODES[daily.weather_code[i]] || { icon: "🌡️" };
    
    const card = document.createElement("div");
    card.className = "forecast-card";
    card.innerHTML = `
      <p><strong>${dayName}</strong></p>
      <p>${dayInfo.icon}</p>
      <p>${Math.round(daily.temperature_2m_max[i])}° / ${Math.round(daily.temperature_2m_min[i])}°</p>
    `;
    forecastEl.appendChild(card);
  }

  resultsEl.hidden = false;
}


form.addEventListener("submit", (e) => {
  e.preventDefault();
  const city = input.value.trim();
  if (city) {
    loadWeather(city);
  }
});

document.querySelector("#mansourieh-btn").addEventListener("click", () => {
  input.value = "Mansourieh";
  loadWeather("Mansourieh");
});

// Initial load on page startup
input.value = "Mansourieh";
loadWeather("Mansourieh");