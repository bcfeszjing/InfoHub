document.addEventListener('DOMContentLoaded', function() {
    const backButton = document.getElementById('back-button');
    const favouritesContainer = document.getElementById('favourites-container');

    // Function to handle back button click
    backButton.addEventListener('click', function() {
        window.location.href = 'home.html'; // Adjust the URL as needed
    });

    function loadFavourites() {
        const favourites = JSON.parse(localStorage.getItem('favourites')) || [];
        if (favourites.length === 0) {
            favouritesContainer.innerHTML = '<p>No favourites yet.</p>';
            return;
        }

        // Sort favourites by savedAt date
        favourites.sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt));

        favourites.forEach(article => {
            const favouriteItem = document.createElement('a'); // Wrap in anchor tag
            favouriteItem.classList.add('favourite-item');
            favouriteItem.href = article.url; // Set the href to the article URL
            favouriteItem.target = '_blank'; // Open link in new tab

            const dateTimeContainer = document.createElement('div');
            dateTimeContainer.classList.add('date-time');

            const dateText = document.createElement('div');
            dateText.classList.add('date');
            dateText.textContent = moment(article.savedAt).format('YYYY-MM-DD');

            const timeText = document.createElement('div');
            timeText.classList.add('time');
            timeText.textContent = moment(article.savedAt).format('h:mm A');

            const newsContent = document.createElement('div');
            newsContent.classList.add('favourite-content');

            const newsDetails = document.createElement('div');
            newsDetails.classList.add('news-details');

            const newsText = document.createElement('div');
            newsText.classList.add('news-text');

            const favouriteImage = document.createElement('img');
            favouriteImage.classList.add('favourite-image');
            favouriteImage.src = article.urlToImage || 'img/news_en_1920x1080.jpg';
            favouriteImage.onerror = function() {
                this.src = 'img/news_en_1920x1080.jpg';
            };

            const newsTopic = document.createElement('div');
            newsTopic.classList.add('news-topic');
            newsTopic.textContent = article.title;

            const newsDescription = document.createElement('div');
            newsDescription.classList.add('news-description');
            newsDescription.textContent = article.description;

            // Create star icon for unfavouriting
            const starIcon = document.createElement('span');
            starIcon.classList.add('star-icon', 'active');
            starIcon.innerHTML = '★';
            starIcon.addEventListener('click', function(event) {
                event.preventDefault(); // Prevent default link behavior
                removeFavourite(article);
                favouriteItem.remove();
            });

            favouriteItem.appendChild(dateTimeContainer);
            dateTimeContainer.appendChild(dateText);
            dateTimeContainer.appendChild(timeText);
            favouriteItem.appendChild(newsContent);
            newsContent.appendChild(favouriteImage);
            newsContent.appendChild(newsDetails);
            newsDetails.appendChild(newsText);
            newsText.appendChild(newsTopic);
            newsText.appendChild(newsDescription);
            favouriteItem.appendChild(starIcon);
            favouritesContainer.appendChild(favouriteItem);
        });
    }

    function removeFavourite(article) {
        let favourites = JSON.parse(localStorage.getItem('favourites')) || [];
        favourites = favourites.filter(fav => fav.url !== article.url);
        localStorage.setItem('favourites', JSON.stringify(favourites));
        alert('News removed from favourites');
    }

    loadFavourites();
});

