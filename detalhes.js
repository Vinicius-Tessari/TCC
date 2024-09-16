// Função para capturar parâmetros da URL
function getParameterByName(name) {
    const url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

// Função para criar estrelas com base na avaliação
function createStarRating(voteAverage) {
    const starRatingContainer = document.createElement('div');
    starRatingContainer.classList.add('star-rating');

    const starCount = Math.round(voteAverage / 2); // Converte a avaliação de 10 para uma escala de 5 estrelas

    for (let i = 1; i <= 5; i++) {
        const star = document.createElement('span');
        star.classList.add('star');
        if (i <= starCount) {
            star.textContent = '★'; // Estrela cheia
            star.classList.add('filled');
        } else {
            star.textContent = '☆'; // Estrela vazia
        }
        starRatingContainer.appendChild(star);
    }

    return starRatingContainer;
}

// Captura o movieId da URL
const movieId = getParameterByName('movieId');

if (movieId) {
    const apiKey = '4256e42e9ed60da4dc80338ad34d0062';  // Substitua pela sua chave de API TMDb
    const movieDetailsUrl = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=pt-BR`;
    const movieCreditsUrl = `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${apiKey}&language=pt-BR`;
    const movieVideosUrl = `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${apiKey}&language=pt-BR`;

    // Busca os detalhes do filme
    fetch(movieDetailsUrl)
        .then(response => response.json())
        .then(movie => {
            console.log(movie);  // Exibe os dados recebidos no console para depuração

            // Verifica se o título está disponível, senão define como "Título não disponível"
            if (movie.title) {
                document.getElementById('movieTitle').textContent = movie.title;
            } else {
                document.getElementById('movieTitle').textContent = 'Título não disponível';
            }

            document.getElementById('movieOverview').textContent = movie.overview || 'Sinopse não disponível.';
            document.getElementById('movieReleaseDate').textContent = `Data de Lançamento: ${movie.release_date || 'Desconhecida'}`;
            document.getElementById('movieRating').textContent = `Avaliação: ${movie.vote_average ? movie.vote_average.toFixed(1) : 'Não disponível'}`;

            // Define o pôster ou uma imagem alternativa
            const posterUrl = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Image';
            document.getElementById('moviePoster').src = posterUrl;

            // Define o fundo da seção hero com o `backdrop_path` ou `poster_path`
            const heroSection = document.getElementById('movieHero');
            const imageUrl = movie.backdrop_path ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}` : posterUrl;
            heroSection.style.backgroundImage = `url(${imageUrl})`;
        })
        

    // Busca o elenco do filme
    fetch(movieCreditsUrl)
        .then(response => response.json())
        .then(credits => {
            const castList = credits.cast.slice(0, 10);  // Limita a exibição aos 10 principais atores
            const castNames = castList.map(actor => `${actor.name} (${actor.character})`).join(', ');
            const castContainer = document.getElementById('movieCast');
            castContainer.textContent = `Elenco: ${castNames}`;  // Exibe os nomes separados por vírgulas
        })
        .catch(error => {
            console.error('Erro ao buscar elenco do filme:', error);
            document.getElementById('movieCast').textContent = 'Erro ao carregar elenco.';
        });

    // Busca o trailer do filme
    fetch(movieVideosUrl)
        .then(response => response.json())
        .then(videos => {
            const youtubeTrailer = videos.results.find(video => video.site === 'YouTube' && video.type === 'Trailer');
            if (youtubeTrailer) {
                const trailerUrl = `https://www.youtube.com/embed/${youtubeTrailer.key}`;
                document.getElementById('movieTrailer').innerHTML = `<iframe width="560" height="315" src="${trailerUrl}" frameborder="0" allowfullscreen></iframe>`;
            } else {
                document.getElementById('movieTrailer').innerHTML = '<p>Trailer não disponível.</p>';
            }
        })
        .catch(error => {
            console.error('Erro ao buscar trailer do filme:', error);
            document.getElementById('movieTrailer').textContent = 'Erro ao carregar o trailer.';
        });
} else {
    document.getElementById('movieTitle').textContent = 'Filme não encontrado.';
}