const PREVIEW_API_KEY = 'c0da814d1fed7b22311fb7cb0c56b639';
const PREVIEW_DEFAULT_CITY = 'New York';
let previewUnit = localStorage.getItem('temperatureUnit') || 'imperial';
let previewCity = localStorage.getItem('currentCity') || PREVIEW_DEFAULT_CITY;

document.addEventListener('DOMContentLoaded', () => {
    const weatherPreview = document.getElementById('weather-preview');
    if (weatherPreview) {
        fetchWeatherPreview(previewCity);
    }
});

async function fetchWeatherPreview(city) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${PREVIEW_API_KEY}&units=${previewUnit}`);
        const data = await response.json();
        
        updateWeatherPreview(data);
    } catch (error) {
        console.error('Error fetching weather preview:', error);
    }
}

function updateWeatherPreview(data) {
    const weatherPreview = document.getElementById('weather-preview');
    if (weatherPreview) {
        weatherPreview.innerHTML = `
            <div class="preview-location">${data.name}, ${data.sys.country}</div>
            <div class="preview-icon">${getWeatherIcon(data.weather[0].icon)}</div>
            <div class="preview-temp">${Math.round(data.main.temp)}°${previewUnit === 'imperial' ? 'F' : 'C'}</div>
        `;
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

// Make updateWeatherPreview available globally
window.updateWeatherPreview = updateWeatherPreview;