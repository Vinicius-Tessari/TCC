document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const genre = urlParams.get('genre');
    const duration = urlParams.get('duration');
    const language = urlParams.get('language');
    const year = urlParams.get('year');
    const sortOrder = urlParams.get('sortOrder'); 

    const apiKey = '4256e42e9ed60da4dc80338ad34d0062';
    let apiUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=pt-BR`;

    
    if (genre) {
        apiUrl += `&with_genres=${genre}`;
    }
    if (duration) {
        switch (duration) {
            case 'short':
                apiUrl += `&with_runtime.lte=90`;
                break;
            case 'medium':
                apiUrl += `&with_runtime.gte=90&with_runtime.lte=120`;
                break;
            case 'long':
                apiUrl += `&with_runtime.gte=120`;
                break;
        }
    }
    if (language) {
        apiUrl += `&with_original_language=${language}`;
    }
    if (year) {
        apiUrl += `&primary_release_year=${year}`;
    }
    if (sortOrder) {
        apiUrl += `&sort_by=${sortOrder}`;
    }

    
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            displayMovies(data.results);
        })
        .catch(error => {
            console.error('Erro ao buscar filmes:', error);
            document.getElementById('movieResults').innerHTML = '<p>Erro ao carregar os resultados. Tente novamente mais tarde.</p>';
        });

    
    function displayMovies(movies) {
        const resultsContainer = document.getElementById('movieResults');
        resultsContainer.innerHTML = ''; 

        if (!movies.length) {
            resultsContainer.innerHTML = '<p>Nenhum filme encontrado com os filtros aplicados.</p>';
            return;
        }

        movies.forEach(movie => {
            const movieElement = document.createElement('div');
            movieElement.classList.add('movie-card');

            const posterPath = movie.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : 'https://via.placeholder.com/500x750?text=No+Image';

            const rating = movie.vote_average
                ? `⭐ ${movie.vote_average.toFixed(1)}`
                : 'Sem avaliação';

            const overview = movie.overview
                ? movie.overview
                : 'Sinopse não disponível.';

            movieElement.innerHTML = `
                <img src="${posterPath}" alt="${movie.title}" class="movie-poster">
                <h3 class="movie-title">${movie.title}</h3>
                <p class="movie-rating">${rating}</p>
                <p class="movie-overview">${overview}</p>
            `;

            
            movieElement.addEventListener('click', () => {
                window.location.href = `detalhes.html?movieId=${movie.id}`;
            });

            resultsContainer.appendChild(movieElement);
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
            } else {
                alert('Por favor, insira um nome de filme para buscar.');
            }
        });
    }
});
