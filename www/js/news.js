document.addEventListener("DOMContentLoaded", function() {
    const newsContainer = document.getElementById('news-container');
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const sidebar = document.getElementById('sidebar');
    const apiKey = 'a3c2d6fa2dec41c9b8051d7063b64019';
    let page = 1;
    const pageSize = 20;

    // Toggle sidebar visibility
    sidebarToggle.addEventListener('click', function() {
        sidebar.style.display = sidebar.style.display === 'flex' ? 'none' : 'flex';
    });

    function fetchNews(page) {
        const apiUrl = `https://newsapi.org/v2/everything?q=tesla&from=2024-05-25&sortBy=publishedAt&language=en&apiKey=${apiKey}&pageSize=${pageSize}&page=${page}`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                const articles = data.articles;
                articles.forEach(article => {
                    if (article.title && article.title !== "Removed" && article.description && article.description !== "Removed") {
                        const newsItem = document.createElement('div');
                        newsItem.classList.add('news-item');

                        const newsLink = document.createElement('a');
                        newsLink.href = article.url;
                        newsLink.target = '_blank';

                        const newsImage = document.createElement('img');
                        newsImage.classList.add('news-image');
                        newsImage.src = article.urlToImage || 'default-image.jpg';
                        newsImage.onerror = function() {
                            this.src = 'default-image.jpg';
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
                    }
                });
            })
            .catch(error => console.error('Error fetching the news:', error));
    }

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

    function handleScroll() {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
            page++;
            fetchNews(page);
        }
    }

    window.addEventListener('scroll', handleScroll);

    fetchNews(page);

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
