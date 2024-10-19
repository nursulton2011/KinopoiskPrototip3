document.addEventListener("DOMContentLoaded", function() {
    const apiKey = "11709030";
    const searchMovieBtn = document.getElementById("movie-search-button");
    const movieTitleInput = document.getElementById("movie-search-input");
    const movieList = document.getElementById("movie-list");
    const loader = document.getElementById("loader");

    // Функция для отображения тостеров
    function showToast(toastId) {
        const toastElement = document.getElementById(toastId);
        const toast = new bootstrap.Toast(toastElement);
        toast.show();
    }

    function loadMovieData(movieTitle) {
        const apiUrl = `https://www.omdbapi.com/?apikey=${apiKey}&t=${movieTitle}`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                if (data.Response === "True") {
                    document.getElementById("movieModalLabel").textContent = data.Title;

                    document.getElementById("modalMovieDescription").innerHTML = `
                        <strong>Title:</strong> ${data.Title}<br>
                        <strong>Year:</strong> ${data.Year}<br>
                        <strong>Actors:</strong> ${data.Actors}<br>
                        <strong>Plot:</strong> ${data.Plot}
                    `;

                    document.getElementById("modalMovieImage").src = data.Poster;

                    const movieModal = new bootstrap.Modal(document.getElementById('movieModal'));
                    movieModal.show();
                    showToast('successToast'); // Показать тостер успеха
                } else {
                    showToast('errorToast'); // Показать тостер ошибки
                }
            })
            .catch(error => {
                console.error("Ошибка при загрузке данных фильма:", error);
                showToast('errorToast'); // Показать тостер ошибки
            });
    }

    function createMovieCard(movie) {
        const card = document.createElement("div");
        card.classList.add("card");

        card.innerHTML = `
            <img src="${movie.Poster}" class="card-img-top" alt="${movie.Title}">
            <div class="card-body">
                <h5 class="card-title">${movie.Title}</h5>
                <p class="card-text">Год: ${movie.Year}</p>
                <button class="btn btn-primary btn-details" data-movie-title="${movie.Title}">Подробнее</button>
            </div>
        `;

        card.querySelector(".btn-details").addEventListener("click", function() {
            loadMovieData(movie.Title);
        });

        return card;
    }

    searchMovieBtn.addEventListener("click", function() {
        const movieTitle = movieTitleInput.value;
        if (movieTitle) {
            const apiUrl = `https://www.omdbapi.com/?apikey=${apiKey}&s=${movieTitle}`;

            // Показать загрузчик
            loader.style.display = 'block';

            fetch(apiUrl)
                .then(response => response.json())
                .then(data => {
                    // Скрыть загрузчик
                    loader.style.display = 'none';

                    if (data.Response === "True") {
                        movieList.innerHTML = "";
                        data.Search.forEach(movie => {
                            const movieCard = createMovieCard(movie);
                            movieList.appendChild(movieCard);
                        });
                        showToast('successToast'); // Показать тостер успеха
                    } else {
                        movieList.innerHTML = "<p>Фильмы не найдены</p>";
                        showToast('errorToast'); // Показать тостер ошибки
                    }
                })
                .catch(error => {
                    // Скрыть загрузчик
                    loader.style.display = 'none';
                    console.error("Ошибка при загрузке списка фильмов:", error);
                    movieList.innerHTML = "<p>Произошла ошибка при загрузке данных.</p>";
                    showToast('errorToast'); // Показать тостер ошибки
                });
        } else {
            alert("Пожалуйста, введите название фильма.");
        }
    });
});
