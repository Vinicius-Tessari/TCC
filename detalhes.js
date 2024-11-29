document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const movieId = new URLSearchParams(window.location.search).get('movieId');
    const favoriteButton = document.getElementById('favoriteButton');
    const apiKey = '4256e42e9ed60da4dc80338ad34d0062';
    const watchProviders = [
        { name: 'Netflix', url: 'https://www.netflix.com' },
        { name: 'Claro TV+', url: 'https://www.clarotvmais.com.br' },
        { name: 'Claro Video', url: 'https://www.clarovideo.com' },
        { name: 'Amazon Prime Video', url: 'https://www.primevideo.com' },
        { name: 'Google Play Movies', url: 'https://play.google.com/store/movies' },
        { name: 'Microsoft Store', url: 'https://www.microsoft.com/store/movies-and-tv' },
        { name: 'Apple TV+', url: 'https://www.apple.com/br/apple-tv-plus/' },
        { name: 'Max', url: 'https://www.max.com'},
        { name: 'Disney Plus', url: 'https://www.disneyplus.com/pt-br'}
    ];
    let movieData = null;   

    if (movieId) {
        fetchMovieDetails(movieId);
        fetchWatchProviders(movieId);
        fetchMovieTrailer(movieId);
        fetchRelatedMovies(movieId);
        fetchMovieCast(movieId);
    }

    function fetchMovieDetails(movieId) {
        const movieDetailsUrl = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=pt-BR`;

        fetch(movieDetailsUrl)
            .then(response => response.json())
            .then(data => {
                movieData = data;
                displayMovieDetails(data);
                updateFavoriteButton(movieId);
            })
            .catch(error => {
                console.error('Erro ao buscar detalhes do filme:', error);
            });
    }

    function formatBrazilianDate(dateString) {
        const [year, month, day] = dateString.split("-");
        return `${day}/${month}/${year}`;
    }
    
    function formatRating(rating) {
        return rating ? `⭐ ${rating.toFixed(1)}` : 'Sem avaliação';
    }

    function displayMovieDetails(movie) {
        document.getElementById('movieTitle').textContent = movie.title;
        document.getElementById('movieOverview').textContent = movie.overview;
        document.getElementById('moviePoster').src = movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : 'https://via.placeholder.com/500x750?text=No+Image';

        document.getElementById('releaseDate').textContent = formatBrazilianDate(movie.release_date);
        document.getElementById('rating').textContent = formatRating(movie.vote_average);
    }

    function fetchWatchProviders(movieId) {
        const watchProvidersUrl = `https://api.themoviedb.org/3/movie/${movieId}/watch/providers?api_key=${apiKey}`;
        
        fetch(watchProvidersUrl)
            .then(response => response.json())
            .then(data => {
                const apiProviders = data.results?.BR?.flatrate || [];
                console.log('Provedores retornados pela API:', apiProviders);
                
                const matchedProviders = matchProviders(apiProviders);
                console.log('Provedores correspondentes:', matchedProviders);
                
                renderWatchProviders(matchedProviders);
            })
            .catch(error => {
                console.error('Erro ao carregar provedores:', error);
                document.getElementById('watchProviders').innerHTML = '<p>Erro ao carregar provedores.</p>';
            });
    }
    
    function matchProviders(apiProviders) {
        return apiProviders
            .map(apiProvider => {
                const matchedProvider = watchProviders.find(provider =>
                    provider.name.toLowerCase() === apiProvider.provider_name.toLowerCase()
                );
    
                if (matchedProvider) {
                    return {
                        name: matchedProvider.name,
                        url: matchedProvider.url
                    };
                }
                return null;
            })
            .filter(provider => provider !== null);
    }
    
    
    function renderWatchProviders(providers) {
        const providerList = document.getElementById('watchProviders');
        providerList.innerHTML = '';
    
        if (!providers || providers.length === 0) {
            providerList.innerHTML = '<p>Sem informações disponíveis.</p>';
            return;
        }
    
        providers.forEach(provider => {
            const button = document.createElement('a');
            button.href = provider.url;
            button.target = '_blank';
            button.textContent = provider.name;
            button.classList.add('provider-button');
            providerList.appendChild(button);
        });
    }

    function fetchMovieTrailer(movieId) {
        const movieTrailerUrl = `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${apiKey}&language=pt-BR`;
    
        fetch(movieTrailerUrl)
            .then(response => response.json())
            .then(data => {
                const trailer = data.results.find(video => video.type === 'Trailer' && video.site === 'YouTube');
                if (trailer) {
                    const trailerButton = document.getElementById('trailerButton');
                    trailerButton.onclick = () => {
                        const modal = document.getElementById('trailerModal');
                        const trailerFrame = document.getElementById('trailerFrame');
                        trailerFrame.src = `https://www.youtube.com/embed/${trailer.key}`;
                        modal.style.display = 'block';
                    };
                } else {
                    document.getElementById('trailerButton').textContent = 'Trailer não disponível';
                }
            })
            .catch(error => {
                console.error('Erro ao buscar o trailer do filme:', error);
            });
    }
    
    document.getElementById('closeModal').onclick = () => {
        const modal = document.getElementById('trailerModal');
        const trailerFrame = document.getElementById('trailerFrame');
        trailerFrame.src = '';
        modal.style.display = 'none';
    };
    
    window.onclick = (event) => {
        const modal = document.getElementById('trailerModal');
        if (event.target === modal) {
            const trailerFrame = document.getElementById('trailerFrame');
            trailerFrame.src = '';
            modal.style.display = 'none';
        }
    };

    function fetchMovieCast(movieId) {
        const castUrl = `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${apiKey}&language=pt-BR`;

        fetch(castUrl)
            .then(response => response.json())
            .then(data => {
                if (data.cast && data.cast.length > 0) {
                    displayMovieCast(data.cast.slice(0, 10));
                } else {
                    document.getElementById('castList').innerHTML = '<p>Elenco não encontrado.</p>';
                }
            })
            .catch(error => {
                console.error('Erro ao buscar elenco:', error);
            });
    }

    function displayMovieCast(cast) {
        const castContainer = document.getElementById('castList');
        castContainer.innerHTML = '';

        cast.forEach(actor => {
            const actorElement = document.createElement('div');
            actorElement.classList.add('cast-member');

            const profileImage = actor.profile_path
                ? `https://image.tmdb.org/t/p/w500${actor.profile_path}`
                : 'https://via.placeholder.com/150x150?text=No+Image';

            actorElement.innerHTML = `
                <img src="${profileImage}" alt="${actor.name}">
                <p>${actor.name}</p>
            `;

            castContainer.appendChild(actorElement);
        });
    }

    function fetchRelatedMovies(movieId) {
        const relatedUrl = `https://api.themoviedb.org/3/movie/${movieId}/similar?api_key=${apiKey}&language=pt-BR&page=1`;

        fetch(relatedUrl)
            .then(response => response.json())
            .then(data => {
                const relatedMoviesContainer = document.getElementById('relatedMovies');
                relatedMoviesContainer.innerHTML = '';

                data.results.slice(0, 5).forEach(movie => {
                    const movieElement = document.createElement('div');
                    movieElement.classList.add('movie');

                    movieElement.innerHTML = `
                        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
                        <h3>${movie.title}</h3>
                        <p>⭐ ${movie.vote_average.toFixed(1)}</p>
                    `;

                    movieElement.addEventListener('click', () => {
                        window.location.href = `detalhes.html?movieId=${movie.id}`;
                    });

                    relatedMoviesContainer.appendChild(movieElement);
                });
            })
            .catch(error => console.error('Erro ao buscar filmes relacionados:', error));
    }

    function updateFavoriteButton(id) {
        const isFavorited = isFavorite(id);
        favoriteButton.textContent = isFavorited ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos';
        favoriteButton.classList.toggle('remove-favorite-btn', isFavorited);
        favoriteButton.classList.toggle('favorite-btn', !isFavorited);
    }

    favoriteButton.addEventListener('click', function () {
        if (!movieData) return;
        const movie = {
            id: movieId,
            title: movieData.title,
            poster: movieData.poster_path
                ? `https://image.tmdb.org/t/p/w500${movieData.poster_path}`
                : 'https://via.placeholder.com/500x750?text=Sem+Imagem'
        };

        if (isFavorite(movieId)) {
            removeFavorite(movieId);
        } else {
            saveFavorite(movie);
        }
        updateFavoriteButton(movieId);
    });

    function isFavorite(id) {
        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        return favorites.some(movie => movie.id === parseInt(id));
    }

    function toggleFavorite() {
        if (!movieData) return;

        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        const index = favorites.findIndex(movie => movie.id === parseInt(movieId));

        if (index === -1) {
            favorites.push({
                id: parseInt(movieId),
                title: movieData.title,
                poster: movieData.poster_path
                    ? `https://image.tmdb.org/t/p/w500${movieData.poster_path}`
                    : 'https://via.placeholder.com/500x750?text=No+Image'
            });
            alert('Filme adicionado aos favoritos!');
        } else {
            favorites.splice(index, 1);
            alert('Filme removido dos favoritos!');
        }

        localStorage.setItem('favorites', JSON.stringify(favorites));
        updateFavoriteButton();
    }

    function updateFavoriteButton() {
        const isFavorited = isFavorite(movieId);
        favoriteButton.textContent = isFavorited ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos';
        favoriteButton.classList.toggle('remove-favorite-btn', isFavorited);
        favoriteButton.classList.toggle('favorite-btn', !isFavorited);
    }

    favoriteButton.addEventListener('click', toggleFavorite);
});
