// Function to fetch weather using geolocation
async function fetchWeatherByGeoLocation() {
    const permissionStatus = localStorage.getItem('geoPermission');

    if (permissionStatus === 'granted') {
        getPositionAndFetchWeather();
    } else {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    localStorage.setItem('geoPermission', 'granted');
                    fetchWeatherData(position);
                },
                (error) => {
                    handleGeolocationError(error);
                    localStorage.setItem('geoPermission', 'denied');
                }
            );
        } else {
            alert('Geolocation is not supported by this browser.');
        }
    }
}

async function getPositionAndFetchWeather() {
    navigator.geolocation.getCurrentPosition(async (position) => {
        fetchWeatherData(position);
    });
}

async function fetchWeatherData(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    const apiKey = '130988698af99807eda4c34a4460f215';
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(weatherUrl);
        const data = await response.json();

        if (data.cod !== 200) {
            throw new Error(data.message);
        }

        updateWeatherDisplay(data);

    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}

// Function to handle geolocation errors
function handleGeolocationError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            alert('Location access is required for this application to work correctly. Please enable location access.');
            break;
        case error.POSITION_UNAVAILABLE:
            alert('Location information is unavailable.');
            break;
        case error.TIMEOUT:
            alert('The request to get user location timed out.');
            break;
        case error.UNKNOWN_ERROR:
            alert('An unknown error occurred.');
            break;
    }
}

// Function to update weather details on the page
function updateWeatherDisplay(data) {
    document.getElementById('city-name').innerText = `${data.name} (${moment().format('YYYY-MM-DD')})`;
    document.getElementById('temperature').innerText = `Temperature: ${data.main.temp} °C`;
    document.getElementById('humidity').innerText = `Humidity: ${data.main.humidity} %`;
    document.getElementById('wind-speed').innerText = `Wind Speed: ${data.wind.speed} m/s`;
    document.getElementById('weather-icon').src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    document.getElementById('weather-description').innerText = data.weather[0].description;
}

// Function to navigate between pages
function navigateTo(page) {
    window.location.href = page;
}

// Auto fetch weather on page load for index.html
document.addEventListener('DOMContentLoaded', () => {
    fetchWeatherByGeoLocation(); // Fetch weather using geolocation on page load
});
