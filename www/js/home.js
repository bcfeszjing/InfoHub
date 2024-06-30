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

    let apiKey = 'a3c2d6fa2dec41c9b8051d7063b64019'; // Initial API key
    const apiUrl = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`;
    const articlesToShow = 5;

    // Toggle sidebar visibility
    sidebarToggle.addEventListener('click', function() {
        sidebar.style.display = sidebar.style.display === 'flex' ? 'none' : 'flex';
    });

    fetchNews(apiUrl);

    readMoreButton.addEventListener('click', function() {
        window.location.href = 'news.html';
    });

    function fetchNews(url, count = articlesToShow) {
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                let validArticles = data.articles.filter(article => {
                    return article.title !== "[Removed]" && article.description !== "[Removed]";
                });

                if (validArticles.length < count) {
                    fetchAdditionalNews(count - validArticles.length);
                } else {
                    displayArticles(validArticles.slice(0, count));
                }
            })
            .catch(error => {
                console.error('Error fetching the news:', error);
                // Handle error, possibly fetch a new API key
                fetchNewApiKey();
            });
    }

    function fetchAdditionalNews(count) {
        const newApiUrl = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}&pageSize=${count}`;
        fetch(newApiUrl)
            .then(response => response.json())
            .then(data => {
                let validArticles = data.articles.filter(article => {
                    return article.title !== "[Removed]" && article.description !== "[Removed]";
                });

                displayArticles(validArticles);
            })
            .catch(error => {
                console.error('Error fetching additional news:', error);
            });
    }

    function displayArticles(articles) {
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
            newsTitle.textContent = article.title === "[Removed]" ? "[Removed]" : article.title;

            const newsDescription = document.createElement('div');
            newsDescription.classList.add('news-description');
            newsDescription.textContent = article.description === "[Removed]" ? "[Removed]" : article.description;

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
    }

    function fetchNewApiKey() {
        // Simulate fetching a new API key, replace with your actual logic
        // In this example, we simply switch to the other API key if available
        apiKey = apiKey === 'a3c2d6fa2dec41c9b8051d7063b64019' ? '2a3d2eefe97c4b41adb7f2c96a076572' : 'a3c2d6fa2dec41c9b8051d7063b64019';
        const newApiUrl = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`;
        fetchNews(newApiUrl); // Fetch news using the new API key
    }

    function isFavourite(article) {
        let favourites = localStorage.getItem('favourites');
        if (favourites) {
            favourites = JSON.parse(favourites);
            return favourites.some(fav => fav.url === article.url);
        }
        return false;
    }

    function isRemoved(article) {
        return article.title === "[Removed]" || article.description === "[Removed]";
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
