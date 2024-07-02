async function fetchWeatherByCity(location) {
    const apiKey = '130988698af99807eda4c34a4460f215'; 
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(weatherUrl);
        const data = await response.json();

        if (data.cod !== 200) {
            throw new Error(data.message);
        }

        updateWeatherDisplay(data);

        const lat = data.coord.lat;
        const lon = data.coord.lon;
        await fetchAndDisplayForecast(lat, lon, apiKey);
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}

async function fetchWeatherByGeoLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
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

                await fetchAndDisplayForecast(lat, lon, apiKey);
            } catch (error) {
                console.error('Error fetching weather data:', error);
            }
        }, (error) => {
            console.error('Geolocation error:', error);
        });
    } else {
        alert('Geolocation is not supported by this browser.');
    }
}

function requestPermissions() {
    const permissions = cordova.plugins.permissions;
    const permissionList = [
        permissions.ACCESS_FINE_LOCATION,
        permissions.ACCESS_COARSE_LOCATION
    ];

    permissions.requestPermissions(permissionList, (status) => {
        if (status.hasPermission) {
            console.log('All permissions granted');
            fetchWeatherByGeoLocation();
        } else {
            console.warn('Permissions not granted');
            alert('You need to grant location permissions to fetch weather data.');
        }
    }, (error) => {
        console.error('Permissions request error:', error);
    });
}

function updateWeatherDisplay(data) {
    document.getElementById('city-name').innerText = `${data.name} (${moment().format('YYYY-MM-DD')})`;
    document.getElementById('temperature').innerText = `Temperature: ${data.main.temp} °C`;
    document.getElementById('humidity').innerText = `Humidity: ${data.main.humidity} %`;
    document.getElementById('wind-speed').innerText = `Wind Speed: ${data.wind.speed} m/s`;
    document.getElementById('weather-icon').src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    document.getElementById('weather-description').innerText = data.weather[0].description;
}

async function fetchAndDisplayForecast(lat, lon, apiKey) {
    const forecastUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly,alerts&appid=${apiKey}&units=metric`;

    try {
        const forecastResponse = await fetch(forecastUrl);
        const forecastData = await forecastResponse.json();

        if (forecastData.cod) {
            throw new Error(forecastData.message);
        }

        const labels = forecastData.daily.map(day => moment.unix(day.dt).format('ddd'));
        const temps = forecastData.daily.map(day => day.temp.day);

        const ctx = document.getElementById('forecast-chart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Temperature (°C)',
                    data: temps,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

    } catch (error) {
        console.error('Error fetching forecast data:', error);
    }
}

function navigateTo(page) {
    window.location.href = page;
}

document.addEventListener('DOMContentLoaded', () => {
    if (typeof cordova === 'undefined') {
        fetchWeatherByGeoLocation();
    } else {
        document.addEventListener('deviceready', requestPermissions, false);
    }
});

document.addEventListener('deviceready', () => {
    console.log('Device is ready');
    requestPermissions();
}, false);
