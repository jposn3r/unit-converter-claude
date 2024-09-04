const API_KEY = 'c0da814d1fed7b22311fb7cb0c56b639';
const DEFAULT_CITY = 'New York';
let currentUnit = localStorage.getItem('temperatureUnit') || 'imperial';
let currentCity = localStorage.getItem('currentCity') || DEFAULT_CITY;

document.addEventListener('DOMContentLoaded', () => {
    const cityInput = document.getElementById('city-input');
    const searchButton = document.getElementById('search-button');
    const unitSwitch = document.getElementById('unit-switch');
    const unitLabel = document.getElementById('unit-label');

    unitSwitch.checked = currentUnit === 'metric';
    unitLabel.textContent = currentUnit === 'metric' ? '°C' : '°F';

    searchButton.addEventListener('click', () => {
        const city = cityInput.value || DEFAULT_CITY;
        currentCity = city;
        localStorage.setItem('currentCity', city);
        fetchWeatherData(city);
    });

    unitSwitch.addEventListener('change', () => {
        currentUnit = unitSwitch.checked ? 'metric' : 'imperial';
        unitLabel.textContent = unitSwitch.checked ? '°C' : '°F';
        localStorage.setItem('temperatureUnit', currentUnit);
        fetchWeatherData(currentCity);
    });

    fetchWeatherData(currentCity);
});

async function fetchWeatherData(city) {
    try {
        const currentWeatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=${currentUnit}`);
        const currentWeatherData = await currentWeatherResponse.json();

        const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=${currentUnit}`);
        const forecastData = await forecastResponse.json();

        updateCurrentWeather(currentWeatherData);
        updateForecast(forecastData);
        
        // Update preview
        if (window.updateWeatherPreview) {
            window.updateWeatherPreview(currentWeatherData);
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}

function updateCurrentWeather(data) {
    const locationName = document.getElementById('location-name');
    const weatherIcon = document.getElementById('weather-icon');
    const temperature = document.getElementById('temperature');
    const description = document.getElementById('description');

    locationName.textContent = `${data.name}, ${data.sys.country}`;
    weatherIcon.innerHTML = getWeatherIcon(data.weather[0].icon);
    temperature.textContent = `${Math.round(data.main.temp)}°${currentUnit === 'imperial' ? 'F' : 'C'}`;
    description.textContent = data.weather[0].description;
}

function updateForecast(data) {
    const forecastContainer = document.getElementById('forecast-container');
    forecastContainer.innerHTML = '';

    for (let i = 0; i < data.list.length; i += 8) {
        const forecastData = data.list[i];
        const forecastDay = document.createElement('div');
        forecastDay.classList.add('forecast-day');

        const date = new Date(forecastData.dt * 1000);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });

        forecastDay.innerHTML = `
            <div>${dayName}</div>
            <div class="forecast-icon">${getWeatherIcon(forecastData.weather[0].icon)}</div>
            <div class="forecast-temp">${Math.round(forecastData.main.temp)}°${currentUnit === 'imperial' ? 'F' : 'C'}</div>
        `;

        forecastContainer.appendChild(forecastDay);
    }
}

function getWeatherIcon(iconCode) {
    const iconMap = {
        '01d': '☀️', '01n': '🌙', '02d': '⛅', '02n': '☁️',
        '03d': '☁️', '03n': '☁️', '04d': '☁️', '04n': '☁️',
        '09d': '🌧️', '09n': '🌧️', '10d': '🌦️', '10n': '🌧️',
        '11d': '⛈️', '11n': '⛈️', '13d': '❄️', '13n': '❄️',
        '50d': '🌫️', '50n': '🌫️'
    };

    return iconMap[iconCode] || '❓';
}