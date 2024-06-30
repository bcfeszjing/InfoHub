// Function to fetch weather using geolocation
async function fetchWeatherByGeoLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const apiKey = '130988698af99807eda4c34a4460f215'; // Replace with your OpenWeatherMap API key
            const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

            try {
                const response = await fetch(weatherUrl);
                const data = await response.json();

                if (data.cod !== 200) {
                    throw new Error(data.message);
                }

                updateWeatherDisplay(data); // Update weather details on the page

                await fetchAndDisplayForecast(lat, lon, apiKey); // Fetch and display forecast
            } catch (error) {
                console.error('Error fetching weather data:', error);
                // Handle error gracefully if needed
            }
        });
    } else {
        alert('Geolocation is not supported by this browser.');
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
