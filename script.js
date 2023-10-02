/**
 * @param data.results.image_url
 */

mainFunction()

function mainFunction () {
    window.onload = function () {

    let settings = ["imdb_score_min=1", "genre=horror", "genre=sci-Fi", "genre=drama"]


        fetchAndExtractImageUrls(settings[0], "carousel__1 movie_images", "left_best",
            "right_best");

        fetchAndExtractImageUrls(settings[1], "carousel__2 movie_images", "left_horror",
            "right_horror");

        fetchAndExtractImageUrls(settings[2], "carousel__3 movie_images", "left_sci-fi",
            "right_sci-fi");

        fetchAndExtractImageUrls(settings[3], "carousel__4 movie_images", "left_drama",
            "right_drama");

        getBestMovie("imdb_score_min=1")

    };
}


/* ALL THIS SECTION IS USED TO RETRIEVE INFORMATION ONLY FOR THE BEST MOVIE */


/* This function is used to fetch basic information and particulary the id of the movie */
function getBestMovie(settings) {
    let bestMovieInfos = [];

    fetch(`http://localhost:8000/api/v1/titles/?${settings}&page_size=1&sort_by=-imdb_score`)
        .then(res => {
            if (res.status >= 400) {
                throw new Error("Bad response from server");
            }
            return res.json();
        })
        .then(data => {
            data.results.forEach(result => {
                bestMovieInfos.push(result);

                getAllInfosBestMovie(bestMovieInfos)
            });
        })
}

/* We use this function with the id to fetch all the information of the movie */
function getAllInfosBestMovie (bestMovieInfos) {
    let allBestMovieInfos = [];

    bestMovieInfos.forEach(movieInfo => {
        const id = movieInfo.id

        fetch(`http://localhost:8000/api/v1/titles/${id}`)
                .then(res => {
                    if (res.status >= 400) {
                        throw new Error("Bad response from server");
                    }
                    return res.json();
                })
                .then(data => {
                    allBestMovieInfos.push(data);

                    addInfosBestMovie(allBestMovieInfos)
                })
    })
}

/* This function append the needed infos in the HTML */
function addInfosBestMovie(allBestMovieInfos) {
    const the_best_movie = document.getElementById("the_best_movie");

    allBestMovieInfos.forEach(movieInfo => {
        const title = movieInfo.title;
        const imageUrl = movieInfo.image_url;
        const resume = movieInfo.long_description;

        let data_title = document.createElement('div');
        data_title.textContent = title;
        data_title.classList.add('box_thirteen')

        let data_image = document.createElement('img');
        data_image.src = imageUrl;
        data_image.classList.add('box_fourteen')

        let data_long_description = document.createElement('div');
        data_long_description.textContent = resume;
        data_long_description.classList.add('box_fifteen')

        the_best_movie.appendChild(data_title)
        the_best_movie.appendChild(data_image)
        the_best_movie.appendChild(data_long_description)

    })
}


/* ALL THIS SECTION IS USED TO RETRIEVE INFORMATION BY GENDERS AND CREATE THE 4 CAROUSELS */

/* This function is used to fetch basic information and particulary the id of the movie */
function fetchAndExtractImageUrls(settings, containerId, leftId, rightId) {
    let imageUrls = [];

        fetch(`http://localhost:8000/api/v1/titles/?${settings}&page_size=7&sort_by=-imdb_score`)
            .then(res => {
                if (res.status >= 400) {
                    throw new Error("Bad response from server");
                }
                return res.json();
            })
            .then(data => {
                data.results.forEach(result => {
                    imageUrls.push(result);

                });

                createCarousel(containerId, imageUrls, leftId, rightId);

                hideBoutton(leftId, rightId, 0);

                initAddEventListenerInfosFilms();
            })
            .catch(err => {
                console.error(err);
            });
}

/* This function is used to set each images at the right places with some basic information */
function createCarousel (containerId, imageUrls, leftId, rightId) {
    const container = document.getElementById(containerId);
    container.style.width = (465 * imageUrls.length) + "px";

    for (let i = 0; i < imageUrls.length; i++) {
        const div = document.createElement("div");
        div.setAttribute('id', imageUrls[i].id);
        div.className = "photos";
        div.style.backgroundImage = `url('${imageUrls[i].image_url}')`;
        container.appendChild(div);
    }
    buttonManagement(containerId, leftId, rightId, container)
}

/* This function is used to create the concept of carousel */
function buttonManagement(containerId, leftId, rightId, container) {
    let position = 0;
    const step = 465;
    const containerElement = document.getElementById(containerId);

    const gauche = document.getElementById(leftId);
    gauche.onclick = function () {
        if (position < 0) {
            position += step;
            containerElement.style.transform = `translateX(${position}px)`;
            container.style.transition = 'all 0.3s ease';
            hideBoutton(leftId, rightId, position);
        }
    };

    const droite = document.getElementById(rightId);
    droite.onclick = function () {
        const maxPosition = -1392;
        if (position > maxPosition) {
            position -= step;
            containerElement.style.transform = `translateX(${position}px)`;
            container.style.transition = 'all 0.3s ease';
            hideBoutton(leftId, rightId, position);
        }
    };
}

/* Function that implement the infoprmation in the attribute of the clicked photo */
function addInfosMovies(image, data) {
    image.setAttribute('data-image_url', data.image_url);
    image.setAttribute('data-original_title', data.original_title);
    image.setAttribute('data-genres', data.genres);
    image.setAttribute('data-date_published', data.date_published);
    image.setAttribute('data-avg_vote', data.avg_vote);
    image.setAttribute('data-imdb_score', data.imdb_score);
    image.setAttribute('data-directors', data.directors);
    image.setAttribute('data-actors', data.actors);
    image.setAttribute('data-duration', data.duration);
    image.setAttribute('data-countries', data.countries);
    image.setAttribute('data-worldwide_gross_income', data.worldwide_gross_income);
    image.setAttribute('data-long_description', data.long_description);
}

function initAddEventListenerInfosFilms() {
    const images = document.getElementsByClassName("photos");

    for (let i = 0; i < images.length; i++) {
        images[i].addEventListener("click", function () {
            const id = this.getAttribute('id');

            fetch(`http://localhost:8000/api/v1/titles/${id}`)
                .then(res => {
                    if (res.status >= 400) {
                        throw new Error("Bad response from server");
                    }
                    return res.json();
                })
                .then(data => {
                    addInfosMovies(this, data);
                    afficherInfosFilms(data)
                })
                .catch(err => {
                    console.error(err);
                });
        });
    }
}

function afficherInfosFilms(data) {

    let popupInfo = document.getElementById("popup-overlay");
    let popupContent = document.querySelector(".popup-content");

    popupContent.innerHTML = '';

    let data_image_url = document.createElement('img')
    data_image_url.src = data.image_url
    data_image_url.classList.add('box_one')

    let data_original_title = document.createElement('div');
    data_original_title.textContent = data.original_title;
    data_original_title.classList.add('box_two')

    let data_genres = document.createElement('div');
    data_genres.textContent = data.genres;
    data_genres.classList.add('box_three')

    let data_date_published = document.createElement('div');
    data_date_published.textContent = 'Date: ' + data.date_published;
    data_date_published.classList.add('box_four')

    let data_avg_vote = document.createElement('div');
    data_avg_vote.textContent = 'Note moyene: ' + data.avg_vote;
    data_avg_vote.classList.add('box_five')

    let data_imdb_score = document.createElement('div');
    data_imdb_score.textContent = 'Note IMDB: ' + data.imdb_score;
    data_imdb_score.classList.add('box_six')

    let data_directors = document.createElement('div');
    data_directors.textContent = 'Realisateur(s): ' + data.directors;
    data_directors.classList.add('box_seven')

    let data_actors = document.createElement('div');
    data_actors.textContent = 'Acteurs: ' + data.actors;
    data_actors.classList.add('box_eight')

    let data_duration = document.createElement('div');
    data_duration.textContent = 'Durée: ' + data.duration + ' min.';
    data_duration.classList.add('box_nine')

    let data_countries = document.createElement('div');
    data_countries.textContent = 'Pays: ' + data.countries;
    data_countries.classList.add('box_ten')

    let data_worldwide_gross_income = document.createElement('div');
    if (data_worldwide_gross_income === 'null') {
        data_worldwide_gross_income.textContent = 'Résultat au Box Office: ' + data.worldwide_gross_income;
    } else {
        data_worldwide_gross_income.textContent = 'Résultat au Box Office: ' + data.worldwide_gross_income + ' $';
    }
    data_worldwide_gross_income.classList.add('box_eleven')

    let description = document.createElement('p');
    description.textContent = 'Description: ' + data.long_description;
    description.classList.add('box_twelve')

    let exitButton = document.createElement('button');
    exitButton.textContent = 'X';
    exitButton.id = 'popup_exit';
    exitButton.onclick = function () {
        popupInfo.classList.remove("open")
    }
    exitButton.classList.add('mon-bouton');

    popupInfo.classList.add("open")

    let elementsToAddMovie = [data_image_url, data_original_title, exitButton, data_genres, data_date_published,
        data_countries, data_avg_vote, data_imdb_score, data_duration, data_directors, data_actors,
        data_worldwide_gross_income, description];

    elementsToAddMovie.forEach(element => {
        popupContent.appendChild(element);
    });
}

/* Function to remove buttons when they reach their goal  */
function hideBoutton(leftId, rightId, position) {
    const left = document.getElementById(leftId);
    const right = document.getElementById(rightId);
    const maxPosition = -1392;

    if (position === 0)
        left.style.visibility = 'hidden';
    else
        left.style.visibility = 'visible';

    if (position <= maxPosition)
        right.style.visibility = 'hidden';
    else
        right.style.visibility = 'visible';
}
