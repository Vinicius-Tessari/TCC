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

        movies.forEach(movie => {
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
            `;

            movieElement.addEventListener('click', () => {
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
            } else {
                alert('Por favor, insira um nome de filme para buscar.');
            }
        });
    }


    
    const genreFilter = document.getElementById('genreFilter');
    const durationFilter = document.getElementById('durationFilter');
    const languageFilter = document.getElementById('languageFilter');
    const yearFilter = document.getElementById('yearFilter');
    const sortOrderFilter = document.getElementById('sortOrderFilter');
    const applyFiltersButton = document.getElementById('applyFiltersButton');

    if (applyFiltersButton) {
        applyFiltersButton.addEventListener('click', function () {
            const genre = genreFilter?.value || '';
            const duration = durationFilter?.value || '';
            const language = languageFilter?.value || '';
            const year = yearFilter?.value || '';
            const sortOrder = sortOrderFilter?.value || '';

            let redirectUrl = `resultados.html?`;

            if (genre) redirectUrl += `genre=${genre}&`;
            if (duration) redirectUrl += `duration=${duration}&`;
            if (language) redirectUrl += `language=${language}&`;
            if (year) redirectUrl += `year=${year}&`;
            if (sortOrder) redirectUrl += `sortOrder=${sortOrder}&`;

            redirectUrl = redirectUrl.replace(/[&?]$/, '');
            window.location.href = redirectUrl;
        });
    }
});document.addEventListener('DOMContentLoaded', function () {
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

        movies.forEach(movie => {
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
            `;

            movieElement.addEventListener('click', () => {
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
            } else {
                alert('Por favor, insira um nome de filme para buscar.');
            }
        });
    }


    
    const genreFilter = document.getElementById('genreFilter');
    const durationFilter = document.getElementById('durationFilter');
    const languageFilter = document.getElementById('languageFilter');
    const yearFilter = document.getElementById('yearFilter');
    const sortOrderFilter = document.getElementById('sortOrderFilter');
    const applyFiltersButton = document.getElementById('applyFiltersButton');

    if (applyFiltersButton) {
        applyFiltersButton.addEventListener('click', function () {
            const genre = genreFilter?.value || '';
            const duration = durationFilter?.value || '';
            const language = languageFilter?.value || '';
            const year = yearFilter?.value || '';
            const sortOrder = sortOrderFilter?.value || '';

            let redirectUrl = `resultados.html?`;

            if (genre) redirectUrl += `genre=${genre}&`;
            if (duration) redirectUrl += `duration=${duration}&`;
            if (language) redirectUrl += `language=${language}&`;
            if (year) redirectUrl += `year=${year}&`;
            if (sortOrder) redirectUrl += `sortOrder=${sortOrder}&`;

            redirectUrl = redirectUrl.replace(/[&?]$/, '');
            window.location.href = redirectUrl;
        });
    }
});
