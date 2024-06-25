document.addEventListener("DOMContentLoaded", function() {
    const newsContainer = document.getElementById('news-container');
    const readMoreButton = document.getElementById('read-more-button');

    const apiKey = 'a3c2d6fa2dec41c9b8051d7063b64019';
    const apiUrl = `https://newsapi.org/v2/everything?q=tesla&from=2024-05-25&sortBy=publishedAt&language=en&apiKey=${apiKey}&pageSize=5`;

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

                newsContent.appendChild(newsTitle);
                newsContent.appendChild(newsDescription);

                newsLink.appendChild(newsImage);
                newsLink.appendChild(newsContent);

                newsItem.appendChild(newsLink);
                newsContainer.appendChild(newsItem);
            });
        })
        .catch(error => console.error('Error fetching the news:', error));

    readMoreButton.addEventListener('click', function() {
        window.location.href = 'news.html';
    });
});
