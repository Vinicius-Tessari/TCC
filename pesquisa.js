document.addEventListener('DOMContentLoaded', function () {
    const apiKey = '4256e42e9ed60da4dc80338ad34d0062';
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('search');

    if (searchQuery) {
        const apiUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=pt-BR&query=${encodeURIComponent(searchQuery)}`;
        fetchMovies(apiUrl, 'movieResults');
    }


    function fetchMovies(apiUrl, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = '<p>Carregando...</p>';

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                if (data.results && data.results.length > 0) {
                    displayMovies(data.results, container);
                } else {
                    container.innerHTML = '<p>Nenhum filme encontrado.</p>';
                }
            })
            .catch(error => {
                console.error('Erro ao buscar filmes:', error);
                container.innerHTML = '<p>Erro ao carregar os filmes.</p>';
            });
    }


    function displayMovies(movies, container) {
        container.innerHTML = '';

        movies.forEach(movie => {
            const movieElement = document.createElement('div');
            movieElement.classList.add('movie-card');

            const posterPath = movie.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : 'https://via.placeholder.com/500x750?text=Sem+Imagem';

            const rating = movie.vote_average
                ? `⭐ ${movie.vote_average.toFixed(1)}`
                : 'Sem avaliação';

            const synopsis = movie.overview
                ? movie.overview
                : 'Sinopse não disponível.';

            movieElement.innerHTML = `
                <img src="${posterPath}" alt="${movie.title}" class="movie-poster">
                <h3 class="movie-title">${movie.title}</h3>
                <p class="movie-rating">${rating}</p>
                <p class="movie-synopsis">${synopsis}</p>
            `;

            movieElement.addEventListener('click', () => {
                window.location.href = `detalhes.html?movieId=${movie.id}`;
            });

            container.appendChild(movieElement);
        });
    }
});
