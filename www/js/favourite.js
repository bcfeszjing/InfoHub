document.addEventListener('DOMContentLoaded', function() {
    const backButton = document.getElementById('back-button');
    const favouritesContainer = document.getElementById('favourites-container');

    backButton.addEventListener('click', function() {
        window.location.href = 'index.html';
    });

    function loadFavourites() {
        const favourites = JSON.parse(localStorage.getItem('favourites')) || [];
        if (favourites.length === 0) {
            favouritesContainer.innerHTML = '<p>No favourites yet.</p>';
            return;
        }

        const groupedFavourites = favourites.reduce((acc, article) => {
            const date = moment(article.savedAt).format('YYYY-MM-DD');
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push(article);
            return acc;
        }, {});

        const sortedDates = Object.keys(groupedFavourites).sort((a, b) => moment(b).diff(moment(a)));

        sortedDates.forEach(date => {
            const dateHeader = document.createElement('div');
            dateHeader.classList.add('date-header');
            dateHeader.textContent = moment(date).calendar(null, {
                sameDay: '[Today]',
                nextDay: '[Tomorrow]',
                nextWeek: 'dddd',
                lastDay: '[Yesterday]',
                lastWeek: '[Last] dddd',
                sameElse: 'DD/MM/YYYY'
            });

            favouritesContainer.appendChild(dateHeader);

            groupedFavourites[date].forEach(article => {
                const favouriteItem = document.createElement('div');
                favouriteItem.classList.add('favourite-item');

                const favouriteLink = document.createElement('a');
                favouriteLink.href = article.url;
                favouriteLink.target = '_blank';

                const favouriteImage = document.createElement('img');
                favouriteImage.classList.add('favourite-image');
                favouriteImage.src = article.urlToImage || '../img/defaultImage.png';
                favouriteImage.onerror = function() {
                    this.src = '../img/defaultImage.png';
                };

                const favouriteContent = document.createElement('div');
                favouriteContent.classList.add('favourite-content');

                const favouriteTitle = document.createElement('div');
                favouriteTitle.classList.add('favourite-title');
                favouriteTitle.textContent = article.title;

                const favouriteDescription = document.createElement('div');
                favouriteDescription.classList.add('favourite-description');
                favouriteDescription.textContent = article.description;

                favouriteContent.appendChild(favouriteTitle);
                favouriteContent.appendChild(favouriteDescription);

                favouriteLink.appendChild(favouriteImage);
                favouriteLink.appendChild(favouriteContent);

                favouriteItem.appendChild(favouriteLink);
                favouritesContainer.appendChild(favouriteItem);
            });
        });
    }

    loadFavourites();
});
