const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const weatherInfo = document.getElementById('weather-info');
const errorMsg = document.getElementById('error-msg');

// Map WMO weather codes to readable text
function getWeatherDescription(code) {
  const weatherCodes = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Fog',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    71: 'Slight snow',
    73: 'Moderate snow',
    75: 'Heavy snow',
    80: 'Rain showers',
    95: 'Thunderstorm'
  };
  return weatherCodes[code] || 'Cloudy';
}

async function checkWeather(city) {
  try {
    // 1. Get latitude & longitude from city name
    const geoUrl = `https://open-meteo.com{encodeURIComponent(city)}&count=1&language=en&format=json`;
    const geoResponse = await fetch(geoUrl);
    const geoData = await geoResponse.json();

    if (!geoData.results || geoData.results.length === 0) {
      throw new Error('City not found');
    }

    const { latitude, longitude, name, country } = geoData.results[0];

    // 2. Fetch current weather using coordinates
    const weatherUrl = `https://open-meteo.com{latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m`;
    const weatherResponse = await fetch(weatherUrl);
    const weatherData = await weatherResponse.json();

    const current = weatherData.current;

    // 3. Update the UI
    document.getElementById('city-name').textContent = `${name}, ${country}`;
    document.getElementById('temperature').textContent = `${Math.round(current.temperature_2m)}°C`;
    document.getElementById('condition').textContent = getWeatherDescription(current.weather_code);
    document.getElementById('humidity').textContent = `${current.relative_humidity_2m}%`;
    document.getElementById('wind').textContent = `${current.wind_speed_10m} km/h`;

    errorMsg.style.display = 'none';
    weatherInfo.style.display = 'block';
  } catch (error) {
    weatherInfo.style.display = 'none';
    errorMsg.style.display = 'block';
  }
}

// Event listeners for button click and "Enter" key
searchBtn.addEventListener('click', () => {
  const city = cityInput.value.trim();
  if (city) checkWeather(city);
});

cityInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    const city = cityInput.value.trim();
    if (city) checkWeather(city);
  }
});
