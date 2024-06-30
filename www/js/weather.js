// Function to initialize or reset the hourly weather chart
function initializeHourlyChart() {
    const ctxHourly = document.getElementById('hourly-weather-chart').getContext('2d');

    // Ensure the chart instance is properly destroyed before reinitializing
    if (window.hourlyChart) {
        window.hourlyChart.destroy();
    }

    // Initialize the chart with empty data
    window.hourlyChart = new Chart(ctxHourly, {
        type: 'line',
        data: {
            labels: Array(12).fill('').map((_, index) => {
                const now = moment();
                return now.add(index, 'hours').format('HH:mm');
            }),
            datasets: [{
                label: 'Temperature (°C)',
                data: Array(12).fill(null),
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                fill: true,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                pointBackgroundColor: 'rgba(75, 192, 192, 1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(75, 192, 192, 1)'
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: '#5372F0'
                    }
                },
                x: {
                    ticks: {
                        color: '#5372F0'
                    }
                }
            },
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        color: '#5372F0'
                    }
                },
                tooltip: {
                    enabled: true,
                    backgroundColor: 'rgba(75, 192, 192, 0.8)',
                    titleColor: '#fff',
                    bodyColor: '#fff'
                }
            },
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

// Updated initializeWeatherDisplay function
function initializeWeatherDisplay() {
    document.getElementById('weather-city-name').innerText = 'Unknown';
    document.getElementById('weather-temperature').innerText = 'Temperature: N/A';
    document.getElementById('weather-humidity').innerText = 'Humidity: N/A';
    document.getElementById('weather-wind-speed').innerText = 'Wind Speed: N/A';
    document.getElementById('weather-icon').src = "https://openweathermap.org/img/wn/10d@2x.png";
    document.getElementById('weather-description').innerText = 'Scattered Clouds';

    // Initialize average temperature display
    document.getElementById('average-temperature').innerText = 'Average Temperature: N/A';

    // Initialize or reset the hourly weather chart
    initializeHourlyChart();

    // Attempt to use current location to fetch weather
    useCurrentLocation();
}

// Function to update weather details on the page
function updateWeatherDisplay(data) {
    document.getElementById('weather-city-name').innerText = `${data.name} (${moment().format('YYYY-MM-DD')})`;
    document.getElementById('weather-temperature').innerText = `Temperature: ${data.main.temp} °C`;
    document.getElementById('weather-humidity').innerText = `Humidity: ${data.main.humidity} %`;
    document.getElementById('weather-wind-speed').innerText = `Wind Speed: ${data.wind.speed} m/s`;
    document.getElementById('weather-icon').src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    document.getElementById('weather-description').innerText = data.weather[0].description;
}

// Function to fetch weather by city name
async function fetchWeather() {
    const location = document.getElementById('weather-location').value;
    const apiKey = '773d4858eb5e78a865629a9cb22d2c8d'; // New OpenWeatherMap API key
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(weatherUrl);
        const data = await response.json();

        if (data.cod !== 200) {
            throw new Error(data.message);
        }

        updateWeatherDisplay(data); // Update weather details on the page

        const lat = data.coord.lat;
        const lon = data.coord.lon;
        await fetchAndDisplayDailyForecast(lat, lon, apiKey); // Fetch and display daily forecast
        await fetchAndDisplayHourlyWeather(lat, lon, apiKey); // Fetch and display hourly weather
    } catch (error) {
        console.error('Error fetching weather data:', error);
        initializeWeatherDisplay(); // Initialize weather display with unknown data on error
    }
}

// Function to fetch weather using geolocation
async function useCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const apiKey = '773d4858eb5e78a865629a9cb22d2c8d'; // New OpenWeatherMap API key
            const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

            try {
                const response = await fetch(weatherUrl);
                const data = await response.json();

                if (data.cod !== 200) {
                    throw new Error(data.message);
                }

                updateWeatherDisplay(data); // Update weather details on the page

                await fetchAndDisplayDailyForecast(lat, lon, apiKey); // Fetch and display daily forecast
                await fetchAndDisplayHourlyWeather(lat, lon, apiKey); // Fetch and display hourly weather
            } catch (error) {
                console.error('Error fetching weather data:', error);
                initializeWeatherDisplay(); // Initialize weather display with unknown data on error
            }
        });
    } else {
        alert('Geolocation is not supported by this browser.');
    }
}

// Function to calculate average temperature from hourly data
function calculateAverageTemperature(hourlyData) {
    const temps = hourlyData.map(hour => hour.main.temp);
    const sum = temps.reduce((total, temp) => total + temp, 0);
    const average = sum / temps.length;
    return average.toFixed(2); // Return average temperature rounded to 2 decimal places
}

// Function to fetch and display hourly weather
async function fetchAndDisplayHourlyWeather(lat, lon, apiKey) {
    const hourlyUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&cnt=12`;

    try {
        const hourlyResponse = await fetch(hourlyUrl);
        const hourlyData = await hourlyResponse.json();

        if (hourlyData.cod !== '200') {
            throw new Error(hourlyData.message || 'Failed to fetch hourly weather data');
        }

        // Extract labels (timestamps) and temperature data for the next 12 hours
        const labels = [];
        const temps = [];

        hourlyData.list.slice(0, 12).forEach(hour => {
            const timestamp = hour.dt; // Unix timestamp of the hour
            labels.push(moment.unix(timestamp).format('HH:mm')); // Format timestamp to HH:mm
            temps.push(hour.main.temp); // Temperature in Celsius
        });

        const ctx = document.getElementById('hourly-weather-chart').getContext('2d');

        // Check if the chart instance exists, destroy it before reinitializing
        if (window.hourlyChart) {
            window.hourlyChart.destroy();
        }

        // Create a new chart instance
        window.hourlyChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Temperature (°C)',
                    data: temps,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 2,
                    fill: true,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    pointBackgroundColor: 'rgba(75, 192, 192, 1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(75, 192, 192, 1)'
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: '#5372F0'
                        }
                    },
                    x: {
                        ticks: {
                            color: '#5372F0'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: true,
                        labels: {
                            color: '#5372F0'
                        }
                    },
                    tooltip: {
                        enabled: true,
                        backgroundColor: 'rgba(75, 192, 192, 0.8)',
                        titleColor: '#fff',
                        bodyColor: '#fff'
                    }
                },
                responsive: true,
                maintainAspectRatio: false
            }
        });

        // Calculate and display average temperature
        const averageTemp = calculateAverageTemperature(hourlyData.list.slice(0, 12));
        document.getElementById('average-temperature').innerHTML = `<p>Average Temperature: ${averageTemp} °C</p>`;

    } catch (error) {
        console.error('Error fetching hourly weather data:', error);
        // Handle errors, e.g., display a message or log them
    }
}

// Function to calculate average temperature from hourly data
function calculateAverageTemperature(hourlyData) {
    const temps = hourlyData.map(hour => hour.main.temp);
    const sum = temps.reduce((total, temp) => total + temp, 0);
    const average = sum / temps.length;
    return average.toFixed(2); // Return average temperature rounded to 2 decimal places
}

// Function to fetch and display 5-day forecast with 3-hour interval
async function fetchAndDisplayDailyForecast(lat, lon, apiKey) {
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(forecastUrl);
        const data = await response.json();

        if (data.cod && data.cod !== '200') {
            throw new Error(data.message || 'Failed to fetch daily forecast data');
        }

        // Extracting the first 5 days (including today) from the list of forecasts
        const forecasts = data.list.slice(1, 6); // Start from index 1 to skip today

        // Get today's date in YYYY-MM-DD format
        const todayDate = moment().format('YYYY-MM-DD');

        // Display forecast data for the next 5 days starting from tomorrow
        for (let i = 0; i < forecasts.length; i++) {
            const dayData = forecasts[i];
            const dayDate = moment(todayDate).add(i + 1, 'days').format('YYYY-MM-DD'); // Increment date for each forecast frame starting from tomorrow
            const dayName = moment(dayDate).format('dddd');
            const temp = dayData.main.temp;
            const windSpeed = dayData.wind.speed;
            const humidity = dayData.main.humidity;
            const icon = `https://openweathermap.org/img/wn/${dayData.weather[0].icon}.png`;
            const description = dayData.weather[0].description;

            // Update forecast frame with forecast data
            document.getElementById(`forecast-frame-${i + 1}`).innerHTML =
                `<div class="forecast-details">
                    <h3>${dayName}, ${moment(dayDate).format('MMMM D, YYYY')}</h3>
                    <p>Temperature: ${temp} °C</p>
                    <p>Wind Speed: ${windSpeed} m/s</p>
                    <p>Humidity: ${humidity} %</p>
                    <img src="${icon}" alt="weather-icon">
                    <p>Description: ${description}</p>
                </div>`;
        }

    } catch (error) {
        console.error('Error fetching daily forecast data:', error);
    }
}


function scrollForecast(direction) {
    const container = document.querySelector('.forecast-frame-container');
    const frameWidth = container.querySelector('.forecast-frame').clientWidth;
    if (direction === 'left') {
        container.scrollLeft -= frameWidth + 15; // Adding gap value to ensure smooth scrolling
    } else if (direction === 'right') {
        container.scrollLeft += frameWidth + 15; // Adding gap value to ensure smooth scrolling
    }
}

// Footer navigation
document.getElementById('home').addEventListener('click', function() {
    navigateTo('home');
});

document.getElementById('news').addEventListener('click', function() {
    navigateTo('news');
});

document.getElementById('weather').addEventListener('click', function() {
    navigateTo('weather');
});

document.getElementById('stock').addEventListener('click', function() {
    navigateTo('stock');
});

// Function to navigate to different pages
function navigateTo(pageId) {
    let page;
    switch (pageId) {
        case 'home':
            page = 'home.html';
            break;
        case 'news':
            page = 'news.html';
            break;
        case 'weather':
            page = 'weather.html';
            initializeWeatherDisplay(); // Initialize weather display on weather page load
            break;
        case 'stock':
            page = 'stock.html';
            break;
        default:
            page = 'home.html'; // Default to home page if pageId is unknown
            break;
    }
    
    // Navigate to the selected page
    window.location.href = page;
}

if (window.location.pathname.includes('weather.html')) {
    initializeWeatherDisplay();
}