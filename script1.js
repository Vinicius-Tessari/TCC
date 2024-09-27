document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('userInputForm').addEventListener('submit', async function (e) {
        e.preventDefault();

        const userInput = document.getElementById('userInput').value;
        const geminiApiKey = 'AIzaSyABHoVlEi5iWZ5qdmqA_gckmxVvZqgY_DU';
        const tmdbApiKey = '4256e42e9ed60da4dc80338ad34d0062';

        if (!userInput) {
            alert('Por favor, insira uma descrição para o filme.');
            return;
        }

        try {
            const geminiResponse = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=$geminiApiKey', {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + geminiApiKey,
                },
                body: JSON.stringify({
                    model: "gemini-1.5-pro",
                    messages: [
                        { role: "system", content: "Você é um assistente de recomendação de filmes." },
                        { role: "user", content: `O usuário quer um filme com a seguinte descrição: ${userInput}. Sugira um título de filme que corresponda.` }
                    ]
                })
            });

            const geminiData = await geminiResponse.json();

            if (!geminiData.choices || geminiData.choices.length === 0) {
                throw new Error('Nenhuma resposta válida.');
            }

            const suggestedMovieTitle = geminiData.choices[0].message.content.trim();

            const tmdbApiUrl = `https://api.themoviedb.org/3/search/movie?api_key=${tmdbApiKey}&query=${encodeURIComponent(suggestedMovieTitle)}&language=pt-BR`;

            const tmdbResponse = await fetch(tmdbApiUrl);
            const tmdbData = await tmdbResponse.json();

            if (!tmdbData.results || tmdbData.results.length === 0) {
                throw new Error('Nenhum filme encontrado no TMDb.');
            }

            displayMovieInfo(tmdbData.results[0]);

        } catch (error) {
            console.error('Erro:', error);
            alert(`Erro: ${error.message}`);
        }
    });

    function displayMovieInfo(movie) {
        const movieResults = document.getElementById('movieResults');
        movieResults.innerHTML = '';

        if (!movie) {
            movieResults.innerHTML = '<p>Nenhum filme encontrado.</p>';
            return;
        }

        const posterPath = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Image';
        const rating = movie.vote_average ? `Avaliação: ${movie.vote_average.toFixed(1)}` : 'Avaliação não disponível';

        movieResults.innerHTML = `
            <div class="movie">
                <img src="${posterPath}" alt="${movie.title}">
                <h2>${movie.title}</h2>
                <p>${rating}</p>
                <p>${movie.overview || 'Sinopse não disponível.'}</p>
            </div>
        `;
    }
});