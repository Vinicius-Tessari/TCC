document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const movieId = urlParams.get('movieId'); 

    const apiKey = '4256e42e9ed60da4dc80338ad34d0062'; 

    if (movieId) {
        fetchMovieDetails(movieId);
        fetchWatchProviders(movieId);
        fetchMovieTrailer(movieId); 
    }

    
    function fetchMovieDetails(movieId) {
        const movieDetailsUrl = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=pt-BR`;

        fetch(movieDetailsUrl)
            .then(response => response.json())
            .then(data => {
                displayMovieDetails(data);
            })
            .catch(error => {
                console.error('Erro ao buscar detalhes do filme:', error);
            });
    }

    
    function displayMovieDetails(movie) {
        document.getElementById('movieTitle').textContent = movie.title;
        document.getElementById('movieOverview').textContent = movie.overview;
        document.getElementById('moviePoster').src = movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : 'https://via.placeholder.com/500x750?text=No+Image';
    
    

        
        document.getElementById('releaseDate').textContent = `Data de lançamento: ${movie.release_date}`;
        document.getElementById('rating').textContent = `Avaliação: ${movie.vote_average}`;
    }

    

    
    function fetchWatchProviders(movieId) {
        const watchProvidersUrl = `https://api.themoviedb.org/3/movie/${movieId}/watch/providers?api_key=${apiKey}`;

        fetch(watchProvidersUrl)
            .then(response => response.json())
            .then(data => {
                const providers = data.results && data.results.BR ? data.results.BR : null; 
                if (providers) {
                    displayWatchProviders(providers);
                } else {
                    document.getElementById('watchProviders').textContent = 'Nenhuma informação disponível sobre onde assistir.';
                }
            })
            .catch(error => {
                console.error('Erro ao buscar provedores de streaming:', error);
            });
    }

    
    function displayWatchProviders(providers) {
        const watchProvidersContainer = document.getElementById('watchProviders');
        watchProvidersContainer.innerHTML = ''; 
        if (providers.flatrate) {
            watchProvidersContainer.innerHTML += '<h3>Disponível em streaming:</h3>';
            providers.flatrate.forEach(provider => {
                watchProvidersContainer.innerHTML += `<p>${provider.provider_name}</p>`;
            });
        }
        if (providers.rent) {
            watchProvidersContainer.innerHTML += '<h3>Disponível para aluguel:</h3>';
            providers.rent.forEach(provider => {
                watchProvidersContainer.innerHTML += `<p>${provider.provider_name}</p>`;
            });
        }
        if (providers.buy) {
            watchProvidersContainer.innerHTML += '<h3>Disponível para compra:</h3>';
            providers.buy.forEach(provider => {
                watchProvidersContainer.innerHTML += `<p>${provider.provider_name}</p>`;
            });
        }

        if (!providers.flatrate && !providers.rent && !providers.buy) {
            watchProvidersContainer.textContent = 'Nenhuma informação disponível sobre onde assistir.';
        }
    }

    
    function fetchMovieTrailer(movieId) {
        const movieTrailerUrl = `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${apiKey}&language=pt-BR`;

        fetch(movieTrailerUrl)
            .then(response => response.json())
            .then(data => {
                const trailer = data.results.find(video => video.type === 'Trailer' && video.site === 'YouTube');
                if (trailer) {
                    document.getElementById('movieTrailer').src = `https://www.youtube.com/embed/${trailer.key}`;
                } else {
                    document.getElementById('trailerContainer').innerHTML = '<p>Trailer não disponível.</p>';
                }
            })
            .catch(error => {
                console.error('Erro ao buscar o trailer do filme:', error);
            });
    }

     
     function updateMovieDetails(movieId) {
        const apiKey = '4256e42e9ed60da4dc80338ad34d0062';  
        const movieDetailsUrl = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=pt-BR`;

        fetch(movieDetailsUrl)
            .then(response => response.json())
            .then(data => {
                
                document.getElementById('movieTitle').textContent = data.title;
                document.getElementById('releaseDate').textContent = `Data de lançamento: ${data.release_date}`;
                document.getElementById('rating').textContent = `Avaliação: ${data.vote_average}`;
                document.getElementById('movieOverview').textContent = data.overview;
                document.getElementById('moviePoster').src = `https://image.tmdb.org/t/p/w500${data.poster_path}`;

                
                document.getElementById('castList').innerHTML = '';

                console.log('ID do filme atualizado:', movieId);

                
                fetchMovieCast(movieId);
            })
            .catch(error => {
                console.error('Erro ao buscar detalhes do filme:', error);
            });
    }

    
    function fetchMovieCast(movieId) {
        const apiKey = '4256e42e9ed60da4dc80338ad34d0062';  
        const castUrl = `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${apiKey}&language=pt-BR`;

        fetch(castUrl)
            .then(response => response.json())
            .then(data => {
                console.log('Elenco retornado:', data.cast); 
                if (data.cast && data.cast.length > 0) {
                    displayMovieCast(data.cast);
                } else {
                    console.warn('Nenhum ator encontrado no elenco.');
                    document.getElementById('castList').innerHTML = '<li>Nenhum ator encontrado.</li>';
                }
            })
            .catch(error => {
                console.error('Erro ao buscar elenco:', error);
            });
    }

    
    function displayMovieCast(cast) {
        const castList = document.getElementById('castList');
        
        
        castList.innerHTML = '';

        
        if (cast.length === 0) {
            castList.innerHTML = '<li>Nenhum ator disponível.</li>';
            return;
        }

        
        cast.slice(0, 10).forEach(actor => {
            console.log('Ator encontrado:', actor.name); 

            const castItem = document.createElement('li');
            
            const actorImage = actor.profile_path 
                ? `https://image.tmdb.org/t/p/w500${actor.profile_path}` 
                : 'https://via.placeholder.com/50x50?text=No+Image'; 

            castItem.innerHTML = `
                <img src="${actorImage}" alt="${actor.name}">
                <span>${actor.name}</span>
            `;

            castList.appendChild(castItem);
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

    
    const movieIdf = new URLSearchParams(window.location.search).get('movieIdf') || 385103;
    updateMovieDetails(movieId); 
});
