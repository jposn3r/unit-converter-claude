export default class WeatherWidget {
    constructor(container) {
        this.container = container;
        this.API_KEY = 'c0da814d1fed7b22311fb7cb0c56b639';
        this.DEFAULT_CITY = 'New York';
        this.currentUnit = localStorage.getItem('temperatureUnit') || 'imperial';
        this.currentCity = localStorage.getItem('currentCity') || this.DEFAULT_CITY;
    }

    async mount() {
        this.container.innerHTML = `
            <div id="weather-visualizer">
                <h2>Weather Visualizer</h2>
                <div id="location-input">
                    <input type="text" id="city-input" placeholder="Enter city name">
                    <button id="search-button">Search</button>
                </div>
                <div id="unit-toggle">
                    <label class="switch">
                        <input type="checkbox" id="unit-switch">
                        <span class="slider round"></span>
                    </label>
                    <span id="unit-label">°F</span>
                </div>
                <div id="current-weather">
                    <div id="location-name"></div>
                    <div id="weather-icon"></div>
                    <div id="temperature"></div>
                    <div id="description"></div>
                </div>
                <div id="forecast">
                    <h3>5-Day Forecast</h3>
                    <div id="forecast-container"></div>
                </div>
            </div>
        `;

        this.cityInput = this.container.querySelector('#city-input');
        this.searchButton = this.container.querySelector('#search-button');
        this.unitSwitch = this.container.querySelector('#unit-switch');
        this.unitLabel = this.container.querySelector('#unit-label');

        this.unitSwitch.checked = this.currentUnit === 'metric';
        this.unitLabel.textContent = this.currentUnit === 'metric' ? '°C' : '°F';

        this.searchButton.addEventListener('click', () => this.handleSearch());
        this.cityInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                this.handleSearch();
            }
        });
        this.unitSwitch.addEventListener('change', () => this.handleUnitChange());

        await this.fetchWeatherData(this.currentCity);
    }

    async unmount() {
        // Remove event listeners
        this.searchButton.removeEventListener('click', this.handleSearch);
        this.cityInput.removeEventListener('keypress', this.handleSearch);
        this.unitSwitch.removeEventListener('change', this.handleUnitChange);
    }

    handleSearch() {
        const city = this.cityInput.value || this.DEFAULT_CITY;
        this.currentCity = city;
        localStorage.setItem('currentCity', city);
        this.fetchWeatherData(city)
            .then(() => {
                this.cityInput.value = '';
            })
            .catch((error) => {
                console.error('Error in handleSearch:', error);
            });
    }

    handleUnitChange() {
        this.currentUnit = this.unitSwitch.checked ? 'metric' : 'imperial';
        this.unitLabel.textContent = this.unitSwitch.checked ? '°C' : '°F';
        localStorage.setItem('temperatureUnit', this.currentUnit);
        this.fetchWeatherData(this.currentCity);
    }

    async fetchWeatherData(city) {
        try {
            const currentWeatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${this.API_KEY}&units=${this.currentUnit}`);
            const currentWeatherData = await currentWeatherResponse.json();

            const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${this.API_KEY}&units=${this.currentUnit}`);
            const forecastData = await forecastResponse.json();

            this.updateCurrentWeather(currentWeatherData);
            this.updateForecast(forecastData);
        } catch (error) {
            console.error('Error fetching weather data:', error);
        }
    }

    updateCurrentWeather(data) {
        const locationName = this.container.querySelector('#location-name');
        const weatherIcon = this.container.querySelector('#weather-icon');
        const temperature = this.container.querySelector('#temperature');
        const description = this.container.querySelector('#description');

        locationName.textContent = `${data.name}, ${data.sys.country}`;
        weatherIcon.innerHTML = this.getWeatherIcon(data.weather[0].icon);
        temperature.textContent = `${Math.round(data.main.temp)}°${this.currentUnit === 'imperial' ? 'F' : 'C'}`;
        description.textContent = data.weather[0].description;
    }

    updateForecast(data) {
        const forecastContainer = this.container.querySelector('#forecast-container');
        forecastContainer.innerHTML = '';

        for (let i = 0; i < data.list.length; i += 8) {
            const forecastData = data.list[i];
            const forecastDay = document.createElement('div');
            forecastDay.classList.add('forecast-day');

            const date = new Date(forecastData.dt * 1000);
            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });

            forecastDay.innerHTML = `
                <div>${dayName}</div>
                <div class="forecast-icon">${this.getWeatherIcon(forecastData.weather[0].icon)}</div>
                <div class="forecast-temp">${Math.round(forecastData.main.temp)}°${this.currentUnit === 'imperial' ? 'F' : 'C'}</div>
            `;

            forecastContainer.appendChild(forecastDay);
        }
    }

    getWeatherIcon(iconCode) {
        const iconMap = {
            '01d': '☀️', '01n': '🌙', '02d': '⛅', '02n': '☁️',
            '03d': '☁️', '03n': '☁️', '04d': '☁️', '04n': '☁️',
            '09d': '🌧️', '09n': '🌧️', '10d': '🌦️', '10n': '🌧️',
            '11d': '⛈️', '11n': '⛈️', '13d': '❄️', '13n': '❄️',
            '50d': '🌫️', '50n': '🌫️'
        };

        return iconMap[iconCode] || '❓';
    }
}


