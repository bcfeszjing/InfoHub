document.addEventListener("DOMContentLoaded", function() {
    const newsContainer = document.getElementById('news-container');
    const readMoreButton = document.getElementById('read-more-button');
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const sidebar = document.getElementById('sidebar');

    const apiKey = 'a3c2d6fa2dec41c9b8051d7063b64019';
    const apiUrl = `https://newsapi.org/v2/everything?q=tesla&from=2024-05-25&sortBy=publishedAt&language=en&apiKey=${apiKey}&pageSize=5`;

    // Toggle sidebar visibility
    sidebarToggle.addEventListener('click', function() {
        sidebar.style.display = sidebar.style.display === 'flex' ? 'none' : 'flex';
    });

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const articles = data.articles;
            articles.forEach(article => {
                const newsItem = document.createElement('div');
                newsItem.classList.add('news-item');

                const newsLink = document.createElement('a');
                newsLink.href = article.url;
                newsLink.target = '_blank';

                const newsImage = document.createElement('img');
                newsImage.classList.add('news-image');
                newsImage.src = article.urlToImage || 'default-image.jpg'; // Fallback to a default image if no image is provided.

                const newsContent = document.createElement('div');
                newsContent.classList.add('news-content');

                const newsTitle = document.createElement('div');
                newsTitle.classList.add('news-title');
                newsTitle.textContent = article.title;

                const newsDescription = document.createElement('div');
                newsDescription.classList.add('news-description');
                newsDescription.textContent = article.description;

                const starIcon = document.createElement('span');
                starIcon.classList.add('star-icon');
                starIcon.innerHTML = '★';
                // Check if the article is already in favourites
                if (isFavourite(article)) {
                    starIcon.classList.add('active');
                }
                starIcon.addEventListener('click', function() {
                    toggleFavourite(article, starIcon);
                });

                newsContent.appendChild(newsTitle);
                newsContent.appendChild(newsDescription);

                newsLink.appendChild(newsImage);
                newsLink.appendChild(newsContent);

                newsItem.appendChild(newsLink);
                newsItem.appendChild(starIcon);
                newsContainer.appendChild(newsItem);
            });
        })
        .catch(error => console.error('Error fetching the news:', error));

    readMoreButton.addEventListener('click', function() {
        window.location.href = 'news.html';
    });

    function isFavourite(article) {
        let favourites = localStorage.getItem('favourites');
        if (favourites) {
            favourites = JSON.parse(favourites);
            return favourites.some(fav => fav.url === article.url);
        }
        return false;
    }

    function toggleFavourite(article, starIcon) {
        let favourites = localStorage.getItem('favourites');
        if (favourites) {
            favourites = JSON.parse(favourites);
        } else {
            favourites = [];
        }
        if (isFavourite(article)) {
            favourites = favourites.filter(fav => fav.url !== article.url);
            starIcon.classList.remove('active');
            alert('News removed from favourites');
        } else {
            favourites.push(article);
            starIcon.classList.add('active');
            alert('News added to favourites');
        }
        localStorage.setItem('favourites', JSON.stringify(favourites));
    }

    // Footer navigation
    document.getElementById('home').addEventListener('click', function() {
        window.location.href = 'index.html';
    });
    document.getElementById('news').addEventListener('click', function() {
        window.location.href = 'news.html';
    });
    document.getElementById('weather').addEventListener('click', function() {
        window.location.href = 'weather.html';
    });
    document.getElementById('stock').addEventListener('click', function() {
        window.location.href = 'stock.html';
    });
});
