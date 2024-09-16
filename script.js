document.getElementById('searchForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const movieName = document.getElementById('movieName').value;
    const genreId = document.getElementById('genreSelect').value;
    const apiKey = '4256e42e9ed60da4dc80338ad34d0062';  // Substitua pela sua chave de API TMDb
    let apiUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=pt-BR`;

    // Se o nome do filme for fornecido, use a busca por texto
    if (movieName) {
        apiUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(movieName)}&language=pt-BR`;
    } else if (genreId) {  // Se um gênero for selecionado, use a busca por gênero
        apiUrl += `&with_genres=${genreId}`;
    }

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            displayMovies(data.results);
        })
        .catch(error => {
            console.error('Erro ao buscar filmes:', error);
        });
});

function displayMovies(movies) {
    const movieResults = document.getElementById('movieResults');
    movieResults.innerHTML = '';  // Limpa resultados antigos

    if (!movies.length) {
        movieResults.innerHTML = '<p>Nenhum filme encontrado.</p>';
        return;
    }

    movies.forEach(movie => {
        const movieElement = document.createElement('div');
        movieElement.classList.add('movie');

        const posterPath = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Image';
        const rating = movie.vote_average ? `Avaliação: ${movie.vote_average.toFixed(1)}` : 'Avaliação não disponível';

        movieElement.innerHTML = `
            <img src="${posterPath}" alt="${movie.title}">
            <h2>${movie.title}</h2>
            <p>${rating}</p>
            <p>${movie.overview || 'Sinopse não disponível.'}</p>
        `;

        // Adiciona evento de clique para redirecionar à página de detalhes do filme
        movieElement.addEventListener('click', () => {
            window.location.href = `detalhes.html?movieId=${movie.id}`;  // Redireciona para uma página de detalhes com o ID do filme na URL
        });

        movieResults.appendChild(movieElement);
    });
}