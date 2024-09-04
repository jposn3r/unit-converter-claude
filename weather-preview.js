const PREVIEW_API_KEY = 'c0da814d1fed7b22311fb7cb0c56b639';
const PREVIEW_DEFAULT_CITY = 'New York';

document.addEventListener('DOMContentLoaded', () => {
    const weatherPreview = document.getElementById('weather-preview');
    if (weatherPreview) {
        fetchWeatherPreview(PREVIEW_DEFAULT_CITY);
    }
});

async function fetchWeatherPreview(city) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${PREVIEW_API_KEY}&units=imperial`);
        const data = await response.json();
        
        updateWeatherPreview(data);
    } catch (error) {
        console.error('Error fetching weather preview:', error);
    }
}

function updateWeatherPreview(data) {
    const weatherPreview = document.getElementById('weather-preview');
    weatherPreview.innerHTML = `
        <div class="preview-icon">${getWeatherIcon(data.weather[0].icon)}</div>
        <div class="preview-temp">${Math.round(data.main.temp)}°C</div>
        <div class="preview-city">${data.name}</div>
    `;
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