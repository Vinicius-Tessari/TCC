document.addEventListener('DOMContentLoaded', function () {
    const apiKey = '4256e42e9ed60da4dc80338ad34d0062';
    const trendingUrl = `https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}&language=pt-BR`;
    const cinemaUrl = `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=pt-BR&region=BR`;
    const streamingUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=pt-BR&with_watch_providers=8&watch_region=BR&sort_by=popularity.desc`;
    const upcomingUrl = `https://api.themoviedb.org/3/movie/upcoming?api_key=${apiKey}&language=pt-BR&region=BR`;

   
    fetchMovies(trendingUrl, 'trendingMoviesContainer');
    fetchMovies(cinemaUrl, 'cinemaMoviesContainer');
    fetchMovies(streamingUrl, 'streamingMoviesContainer');
    fetchMovies(upcomingUrl, 'upcomingMoviesContainer');

    
    function fetchMovies(apiUrl, containerId) {
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                displayMovies(data.results.slice(0, 5), containerId); 
            })
            .catch(error => {
                console.error(`Erro ao carregar filmes para ${containerId}:`, error);
                const container = document.getElementById(containerId);
                container.innerHTML = '<p>Erro ao carregar filmes.</p>';
            });
    }
    
    function displayMovies(movies, containerId) {
        const container = document.getElementById(containerId);
        container.innerHTML = '';
    
        if (!movies || movies.length === 0) {
            container.innerHTML = '<p>Nenhum filme encontrado.</p>';
            return;
        }
    
        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    
        movies.forEach(movie => {
            const isFavorite = favorites.some(fav => fav.id === movie.id);
            const movieElement = document.createElement('div');
            movieElement.classList.add('movie-card');
    
            const posterPath = movie.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : 'https://via.placeholder.com/500x750?text=No+Image';
    
            const rating = movie.vote_average
                ? `⭐ ${movie.vote_average.toFixed(1)}`
                : 'Sem avaliação';
    
            movieElement.innerHTML = `
                <img src="${posterPath}" alt="${movie.title}" class="movie-poster">
                <h3 class="movie-title">${movie.title}</h3>
                <p class="movie-rating">${rating}</p>
                <button class="${isFavorite ? 'remove-favorite-btn' : 'favorite-btn'}" 
                    data-id="${movie.id}" 
                    data-title="${movie.title}" 
                    data-poster="${posterPath}">
                    ${isFavorite ? 'Remover dos Favoritos' : 'Favoritar'}
                </button>
            `;
    
            const button = movieElement.querySelector('button');
            button.addEventListener('click', () => {
                if (isFavorite) {
                    removeFavorite(movie.id);
                } else {
                    const movieData = {
                        id: movie.id,
                        title: movie.title,
                        poster: posterPath,
                    };
                    saveFavorite(movieData);
                }
                displayMovies(movies, containerId);
            });
    
            movieElement.addEventListener('click', (event) => {
                if (event.target.tagName === 'BUTTON') return;
                window.location.href = `detalhes.html?movieId=${movie.id}`;
            });
    
            container.appendChild(movieElement);
        });    
    }
    
    const searchForm = document.getElementById('searchForm');
    const searchInput = document.getElementById('searchInput');

    if (searchForm && searchInput) {
        searchForm.addEventListener('submit', function (e) {
            e.preventDefault(); 

            const query = searchInput.value.trim();
            if (query) {
                
                window.location.href = `pesquisa.html?search=${encodeURIComponent(query)}`;
            } 
        });
    }
 
    const genreFilter = document.getElementById('genreFilter');
    const durationFilter = document.getElementById('durationFilter');
    const languageFilter = document.getElementById('languageFilter');
    const yearFilter = document.getElementById('yearFilter');
    const sortOrderFilter = document.getElementById('sortOrderFilter');
    const applyFiltersButton = document.getElementById('applyFiltersButton');
    const ageFilter = document.getElementById('ageFilter');

    if (applyFiltersButton) {
        applyFiltersButton.addEventListener('click', function () {
            const genre = genreFilter?.value || '';
            const duration = durationFilter?.value || '';
            const language = languageFilter?.value || '';
            const year = yearFilter?.value || '';
            const sortOrder = sortOrderFilter?.value || '';
            const age = ageFilter?.value || '';
        
            let redirectUrl = `resultados.html?`;
        
            if (genre) redirectUrl += `genre=${genre}&`;
            if (duration) redirectUrl += `duration=${duration}&`;
            if (language) redirectUrl += `language=${language}&`;
            if (age) redirectUrl += `certification_country=US&certification=${age}&`;
            if (year) redirectUrl += `year=${year}&`;
            if (sortOrder) redirectUrl += `sortOrder=${sortOrder}&`;

            redirectUrl = redirectUrl.replace(/[&?]$/, '');
            
            console.log("URL de redirecionamento gerada:", redirectUrl);
            window.location.href = redirectUrl;
        });
    }

     function fetchMovieTrailer(id) {
        const trailerUrl = `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${apiKey}&language=pt-BR`;
        fetch(trailerUrl)
            .then(response => response.json())
            .then(data => {
                const trailer = data.results.find(video => video.type === 'Trailer' && video.site === 'YouTube');
                if (trailer) {
                    movieTrailer.src = `https://www.youtube.com/embed/${trailer.key}`;
                    showTrailerButton.style.display = 'block';
                } else {
                    movieTrailer.parentElement.innerHTML = '<p>Trailer não disponível.</p>';
                }
            })
            .catch(error => console.error('Erro ao carregar trailer:', error));
    }

    if (showTrailerButton) {
        showTrailerButton.addEventListener('click', () => {
            trailerSection.style.display = 'block';
            showTrailerButton.style.display = 'none';
        });
    }
});

function toggleSearch() {
    const searchBar = document.querySelector('.navbar-search');
    const searchButton = document.querySelector('.search-icon-button');
    
    searchBar.classList.toggle('active');
    
    if (searchBar.classList.contains('active')) {
        searchButton.style.display = 'none';
    } else {
        searchButton.style.display = 'inline-block';
    }
}

function renderMovies(movies) {
    const movieContainer = document.getElementById("movie-container");
  
    movies.forEach((movie) => {
      const movieCard = `
        <div class="movie-card">
          <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
          <h3>${movie.title}</h3>
          <button class="favorite-btn" data-id="${movie.id}" data-title="${movie.title}" data-poster="https://image.tmdb.org/t/p/w500${movie.poster_path}">
            Favoritar
          </button>
        </div>
      `;
      movieContainer.innerHTML += movieCard;
    });
  
    setupFavoriteButtons();
}
  
function setupFavoriteButtons() {
    document.querySelectorAll(".favorite-btn").forEach(button => {
      button.addEventListener("click", (event) => {
        const id = button.getAttribute("data-id");
        const title = button.getAttribute("data-title");
        const poster = button.getAttribute("data-poster");
  
        const movie = { id, title, poster };
        saveFavorite(movie);
      });
    });
}

function saveFavorite(movie) {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const alreadyFavorite = favorites.some(fav => fav.id === movie.id);

    if (alreadyFavorite) {
        console.warn('Este filme já está nos favoritos!');
        return;
    }

    favorites.push(movie);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    alert('Filme adicionado aos favoritos!');
}

function loadFavorites() {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const favoritesList = document.getElementById('favorites-list');
    favoritesList.innerHTML = '';

    if (favorites.length === 0) {
        favoritesList.innerHTML = '<p>Você ainda não tem filmes favoritos.</p>';
        return;
    }

    favorites.forEach(movie => {
        const movieCard = `
            <div class="favorite-movie">
                <img src="${movie.poster}" alt="${movie.title}">
                <p>${movie.title}</p>
                <button class="remove-favorite-btn" data-id="${movie.id}">Remover</button>
            </div>
        `;
        favoritesList.innerHTML += movieCard;
    });

    document.querySelectorAll('.remove-favorite-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            const id = button.getAttribute('data-id');
            removeFavorite(parseInt(id));
        });
    });
}

function removeFavorite(movieId) {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const updatedFavorites = favorites.filter(movie => movie.id !== parseInt(movieId));

    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    alert('Filme removido dos favoritos!');
}
  
  document.addEventListener('DOMContentLoaded', () => {
    loadFavorites();
});

document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('favoritos.html')) {
        loadFavoritesPage();
    }
});

function loadFavoritesPage() {
    const favoritesList = document.getElementById('favorites-list');
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favoritesList.innerHTML = '';

    if (favorites.length === 0) {
        favoritesList.innerHTML = '<p>Você ainda não tem filmes favoritos.</p>';
        return;
    }

    favorites.forEach(movie => {
        const movieElement = document.createElement('div');
        movieElement.classList.add('movie-card');
        movieElement.innerHTML = `
            <img src="${movie.poster}" alt="${movie.title}" class="movie-poster">
            <h3 class="movie-title">${movie.title}</h3>
            <button class="remove-favorite-btn" data-id="${movie.id}">Remover</button>
        `;

        movieElement.addEventListener('click', (event) => {
            if (!event.target.classList.contains('remove-favorite-btn')) {
                window.location.href = `detalhes.html?movieId=${movie.id}`;
            }
        });

        movieElement.querySelector('.remove-favorite-btn').addEventListener('click', (event) => {
            event.stopPropagation();
            removeFavorite(movie.id);
            loadFavoritesPage();
        });

        favoritesList.appendChild(movieElement);
    });
}

document.addEventListener('DOMContentLoaded', loadFavoritesPage);
