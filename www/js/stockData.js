document.addEventListener('DOMContentLoaded', (event) => {
    const params = new URLSearchParams(window.location.search);
    const stockSymbol = params.get('symbol'); // Retrieve stock symbol from URL query parameter
    const finnhubAPIKey = 'cptbq0pr01qnvrr8s8kgcptbq0pr01qnvrr8s8l0';
    const twelveDataAPIKey = '11cb98726630487ca71649c008a44cd8';

    if (!stockSymbol) {
        console.error('Stock symbol not found in URL parameters.');
        return;
    }

    fetch(`https://finnhub.io/api/v1/search?q=${stockSymbol}&token=${finnhubAPIKey}`)
        .then(response => response.json())
        .then(data => {
            if (data.count > 0) {
                const symbol = data.result[0].symbol;
                const description = data.result[0].description;

                fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${finnhubAPIKey}`)
                    .then(response => response.json())
                    .then(quoteData => {
                        displayStockData(symbol, description, quoteData);
                        renderStockChart(symbol, '1D'); // Initial chart render for 1 Day

                        const timePeriodSelect = document.getElementById('time-period');
                        timePeriodSelect.addEventListener('change', () => {
                            const selectedPeriod = timePeriodSelect.value;
                            renderStockChart(symbol, selectedPeriod);
                        });
                    })
                    .catch(error => console.error('Error fetching stock quote data:', error));
            } else {
                console.error('Stock not found in search results.');
            }
        })
        .catch(error => console.error('Error fetching stock data:', error));
});

function displayStockData(symbol, description, data) {
    const stockSymbolDescription = document.getElementById('stock-symbol-description');
    const currentPrice = document.getElementById('current-price');
    const highPrice = document.getElementById('high-price');
    const lowPrice = document.getElementById('low-price');
    const previousClose = document.getElementById('previous-close');

    if (!stockSymbolDescription || !currentPrice || !highPrice || !lowPrice || !previousClose) {
        console.error('One or more elements not found for stock data display.');
        return;
    }

    stockSymbolDescription.textContent = `${symbol} - ${description}`;
    currentPrice.textContent = `$${data.c.toFixed(2)}`;
    highPrice.textContent = `$${data.h.toFixed(2)}`;
    lowPrice.textContent = `$${data.l.toFixed(2)}`;
    previousClose.textContent = `$${data.pc.toFixed(2)}`;
}

function getIntervalAndOutputSize(period) {
    switch (period) {
        case '1D':
            return { interval: '1min', outputsize: 390 }; // 390 minutes in a trading day
        case '1W':
            return { interval: '1day', outputsize: 7 };
        case '1M':
            return { interval: '1day', outputsize: 30 };
        case '1Y':
            return { interval: '1month', outputsize: 12 };
        default:
            return { interval: '1min', outputsize: 390 };
    }
}

function formatLabel(datetime, period) {
    const date = new Date(datetime);
    if (period === '1D') {
        const hours = date.getHours().toString().padStart(2, '0'); // Get hours in 24-hour format
        const minutes = date.getMinutes().toString().padStart(2, '0'); // Get minutes
        return `${hours}:${minutes}`;
    } else if (period === '1W' || period === '1M') {
        return date.toLocaleDateString();
    } else if (period === '1Y') {
        return date.toLocaleDateString([], { year: 'numeric', month: 'short' });
    } else {
        return datetime;
    }
}

function reduceDataPoints(data, targetCount) {
    const dataLength = data.length;
    const targetPoints = Math.min(dataLength, targetCount);

    // Calculate the step size to select data points approximately every 1 hour
    const step = Math.ceil(dataLength / targetPoints);

    // Filter data to select data points spaced approximately every 1 hour
    return data.filter((item, index) => index % step === 0).slice(0, targetPoints);
}

let stockChart; // Declare stockChart globally to keep track of the chart instance

function renderStockChart(symbol, period) {
    const twelveDataAPIKey = '11cb98726630487ca71649c008a44cd8';
    const { interval, outputsize } = getIntervalAndOutputSize(period);
    const url = `https://api.twelvedata.com/time_series?symbol=${symbol}&interval=${interval}&outputsize=${outputsize}&apikey=${twelveDataAPIKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.status === "ok") {
                // Sort data points by datetime to ensure chronological order
                data.values.sort((a, b) => new Date(a.datetime) - new Date(b.datetime));

                let labels = data.values.map(item => formatLabel(item.datetime, period));
                let prices = data.values.map(item => parseFloat(item.close));

                if (period === '1D') {
                    // Reduce data points to around 8 for the 1D period
                    const reducedData = reduceDataPoints(data.values, 8); // Adjusted for 8 data points

                    labels = reducedData.map(item => formatLabel(item.datetime, period));
                    prices = reducedData.map(item => parseFloat(item.close));
                }

                if (stockChart) {
                    stockChart.destroy(); // Destroy the existing chart before creating a new one
                }

                const ctx = document.getElementById('chart').getContext('2d');
                stockChart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: `${symbol} Price`,
                            data: prices,
                            borderColor: '#007BFF',
                            borderWidth: 2,
                            fill: false,
                            pointRadius: 4,
                            pointHoverRadius: 6,
                            tension: 0.4 // Smooth the line curve
                        }]
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            legend: {
                                display: true,
                                position: 'top'
                            },
                            tooltip: {
                                callbacks: {
                                    label: function(context) {
                                        return `$${context.raw.toFixed(2)}`;
                                    }
                                }
                            }
                        },
                        scales: {
                            x: {
                                display: true,
                                title: {
                                    display: true,
                                    text: 'Time'
                                },
                                ticks: {
                                    autoSkip: true,
                                    maxTicksLimit: 10
                                }
                            },
                            y: {
                                display: true,
                                title: {
                                    display: true,
                                    text: 'Price ($)'
                                }
                            }
                        }
                    }
                });
            } else {
                console.error('Error fetching time series data:', data.message);
            }
        })
        .catch(error => console.error('Error fetching time series data:', error));
}
