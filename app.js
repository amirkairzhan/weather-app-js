const notificationElement = document.querySelector('.notification');
const iconElement = document.querySelector('.weather-icon');
const temperatureElement = document.querySelector('.temperature-value p');
const descriptionElement = document.querySelector('.temperature-description p');
const locationElement = document.querySelector('.location p');

const weather = {};

weather.temperature = {
    unit: 'celsius'
}

const KELVIN = 273;
const key = '6a765a8228cccb19d2c0f042f1ff655a';

if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition( setPosition, showError );
} else {
    notificationElement.style.display = 'block';
    notificationElement.innerHTML = `<p>Browser Doesn't Support Geolocation</p>`;
}

function displayWeather() {
    iconElement.innerHTML = `<img src="icons/${weather.iconId}.png" alt="icon">`;
    temperatureElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
    descriptionElement.innerHTML = weather.description;
    locationElement.innerHTML = `${weather.city}, ${weather.country}`;
}

function setPosition(position) {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    getWeather(latitude, longitude);
}

function showError(error) {
    notificationElement.style.display = 'block';
    notificationElement.innerHTML = `<p>${error.message}</p>`;
}

function getWeather(latitude, longitude) {
    let api = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;

    fetch(api)
        .then((response) => {
            let data = response.json();
            return data;
        })
        .then((data) => {
            weather.temperature.value = Math.floor(data.main.temp - KELVIN);
            weather.description = data.weather[0].description;
            weather.iconId = data.weather[0].icon;
            weather.city = data.name;
            weather.country = data.sys.country;
        })
        .then(() => {
            displayWeather();
        })
}

function celsiusToFahrenheit(temperature) {
    return (temperature * 9/5 + 32);
};

temperatureElement.addEventListener('click', function() {
    if (weather.temperature.value === undefined) return;

    if (weather.temperature.unit === 'celsius') {
        let fahrenheit = celsiusToFahrenheit(weather.temperature.value);
        fahrenheit = Math.floor(fahrenheit);

        temperatureElement.innerHTML = `${fahrenheit}°<span>F</span>`
        weather.temperature.unit = 'fahrenheit';
    } else {
        temperatureElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;

        weather.temperature.unit = 'celsius';
    }
});