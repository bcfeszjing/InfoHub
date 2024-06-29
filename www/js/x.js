document.addEventListener("DOMContentLoaded", function() {
    const logoutButton = document.getElementById('logout');
    
    if (logoutButton) {
        logoutButton.addEventListener('click', (event) => {
            event.preventDefault();
            // Perform any additional logout operations here if needed
            window.location.href = 'index.html';
        });
    }

    const newsContainer = document.getElementById('news-container');
    const readMoreButton = document.getElementById('read-more-button');
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const sidebar = document.getElementById('sidebar');

    const apiKey = '4f59e033ff7946d485e13a36d7e798ec';
    const apiUrl = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`;

    // Toggle sidebar visibility
    sidebarToggle.addEventListener('click', function() {
        sidebar.style.display = sidebar.style.display === 'flex' ? 'none' : 'flex';
    });

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const articles = data.articles.slice(0, 5).filter(article => !isRemoved(article));
            articles.forEach(article => {
                const newsItem = document.createElement('div');
                newsItem.classList.add('news-item');

                const newsLink = document.createElement('a');
                newsLink.href = article.url;
                newsLink.target = '_blank';

                const newsImage = document.createElement('img');
                newsImage.classList.add('news-image');
                newsImage.src = article.urlToImage || 'default-image.jpg'; // Fallback to a default image if no image is provided.
                newsImage.onerror = function() {
                    this.src = 'img/news_en_1920x1080.jpg';
                };

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

    function isRemoved(article) {
        let removed = localStorage.getItem('removed');
        if (removed) {
            removed = JSON.parse(removed);
            return removed.some(rem => rem.url === article.url);
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
            article.savedAt = new Date().toISOString(); // Add savedAt property
            favourites.push(article);
            starIcon.classList.add('active');
            alert('News added to favourites');
        }
        localStorage.setItem('favourites', JSON.stringify(favourites));
    }

    function removeArticle(article) {
        let removed = localStorage.getItem('removed');
        if (removed) {
            removed = JSON.parse(removed);
        } else {
            removed = [];
        }
        if (!isRemoved(article)) {
            removed.push(article);
            alert('News removed from list');
        }
        localStorage.setItem('removed', JSON.stringify(removed));
    }

    // Footer navigation
    document.getElementById('home').addEventListener('click', function() {
        window.location.href = 'home.html';
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
