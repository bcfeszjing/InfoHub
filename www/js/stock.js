document.addEventListener('DOMContentLoaded', (event) => {
    loadTrendingStocks();
    loadFinancialNews();
});

const stockAPIKey = 'cptbq0pr01qnvrr8s8kgcptbq0pr01qnvrr8s8l0';
const newsAPIKey = '70c4ae411d994ea9b73cdb8fa8043eb5';

// Array of colors for stock symbols
const colors = ['#FF5733', '#33FF57', '#3357FF', '#F333FF', '#FF33A1', '#FF8C33', '#33FFF4', '#33FF8C', '#FFC133', '#8C33FF'];

function searchStock() {
    const query = document.getElementById('stock-search').value.trim();
    if (!query) {
        alert('Please enter a stock symbol');
        return;
    }

    fetch(`https://finnhub.io/api/v1/search?q=${query}&token=${stockAPIKey}`)
        .then(response => response.json())
        .then(data => {
            const results = data.result;
            if (results && results.length > 0) {
                const result = results[0];
                // Redirect to stockData.html with query parameters or using sessionStorage
                window.location.href = `stockData.html?symbol=${result.symbol}`;
            } else {
                alert('Stock symbol not found');
            }
        })
        .catch(error => console.error('Error:', error));
}

function loadTrendingStocks() {
    const trendingSymbols = ['IBM', 'AAPL', 'MSFT', 'GOOGL', 'AMZN']; // Top 5 trending stocks initially
    const trendingList = document.getElementById('trending-list');

    if (!trendingList) {
        console.error('Element with id "trending-list" not found.');
        return;
    }

    trendingList.innerHTML = '';

    trendingSymbols.forEach((symbol, index) => {
        fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${stockAPIKey}`)
            .then(response => response.json())
            .then(data => {
                const latestPrice = data.c; // 'c' is the current price in Finnhub.io response
                const priceChange = data.d; // 'd' is the price change
                const priceChangeColor = priceChange >= 0 ? 'green' : 'red'; // Color based on positive or negative change
                const listItem = document.createElement('li');
                listItem.innerHTML = `
                    <a href="stockData.html?symbol=${symbol}" class="stock-symbol" style="background-color:${colors[index % colors.length]}">${symbol}</a>
                    <span class="stock-change ${priceChange >= 0 ? 'positive-change' : 'negative-change'}">${priceChange >= 0 ? '+' : ''}${priceChange.toFixed(2)}</span>
                    <span class="stock-price">$${latestPrice.toFixed(2)}</span>
                `;
                trendingList.appendChild(listItem);
            })
            .catch(error => console.error('Error:', error));
    });
}

function expandTrending() {
    const trendingSymbols = ['META', 'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'NFLX', 'NVDA', 'BABA', 'JPM']; // Expanded to 10 trending stocks
    const trendingList = document.getElementById('trending-list');

    if (!trendingList) {
        console.error('Element with id "trending-list" not found.');
        return;
    }

    trendingList.innerHTML = '';

    trendingSymbols.forEach((symbol, index) => {
        fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${stockAPIKey}`)
            .then(response => response.json())
            .then(data => {
                const latestPrice = data.c; // 'c' is the current price in Finnhub.io response
                const priceChange = data.d; // 'd' is the price change
                const priceChangeColor = priceChange >= 0 ? 'green' : 'red'; // Color based on positive or negative change
                const listItem = document.createElement('li');
                listItem.innerHTML = `
                    <a href="stockData.html?symbol=${symbol}" class="stock-symbol" style="background-color:${colors[index % colors.length]}">${symbol}</a>
                    <span class="stock-change ${priceChange >= 0 ? 'positive-change' : 'negative-change'}">${priceChange >= 0 ? '+' : ''}${priceChange.toFixed(2)}</span>
                    <span class="stock-price">$${latestPrice.toFixed(2)}</span>
                `;
                trendingList.appendChild(listItem);
            })
            .catch(error => console.error('Error:', error));
    });
}

function loadFinancialNews() {
    fetch(`https://newsapi.org/v2/everything?q=finance&apiKey=${newsAPIKey}`)
        .then(response => response.json())
        .then(data => {
            const newsList = document.getElementById('news-list');
            if (!newsList) {
                console.error('Element with id "news-list" not found.');
                return;
            }

            newsList.innerHTML = '';

            data.articles.slice(0, 5).forEach(article => {
                const listItem = document.createElement('li');
                listItem.classList.add('news-item');
                listItem.innerHTML = `
                    <div class="news-image" style="background-image: url('${article.urlToImage}')"></div>
                    <div class="news-content">
                        <h3 class="news-title"><a href="${article.url}" target="_blank">${article.title}</a></h3>
                        <p class="news-description">${article.description}</p>
                        <p class="news-source">Source: ${article.source.name}</p>
                    </div>
                `;
                newsList.appendChild(listItem);
            });
        })
        .catch(error => console.error('Error:', error));
}
