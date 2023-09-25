/**
 * @param data.results.image_url
 */

let parametre = ["genre=horror", "genre=sci-Fi", "genre=drama", "imdb_score_min=9.2"]

window.onload = function () {


    fetchAndExtractImageUrls(parametre[3], "carousel__1 movie_images", "left_best", "right_best");

    fetchAndExtractImageUrls(parametre[0], "carousel__2 movie_images", "left_horror", "right_horror");

    fetchAndExtractImageUrls(parametre[1], "carousel__3 movie_images", "left_sci-fi", "right_sci-fi");

    fetchAndExtractImageUrls(parametre[2], "carousel__4 movie_images", "left_drama", "right_drama");

};


function fetchAndExtractImageUrls(parametre, containerId, gaucheId, droiteId) {
    const imageUrls = [];

    for (let i = 1; i <= 2; i++) {
        fetch(`http://localhost:8000/api/v1/titles/?${parametre}&page=${i}`)
            .then(res => {
                if (res.status >= 400) {
                    throw new Error("Bad response from server");
                }
                return res.json();
            })
            .then(data => {
                if (i === 1) {
                    data.results.forEach(result => {
                        imageUrls.push(result);
                    });
                } else if (i === 2) {
                    for (let j = 0; j < 2; j++) {
                        imageUrls.push(data.results[j]);
                    }
                }

                if (i === 2) {
                    const container = document.getElementById(containerId);
                    container.style.width = (465 * imageUrls.length) + "px";

                    for (let j = 0; j < imageUrls.length; j++) {
                        const div = document.createElement("div");
                        div.className = "photos";
                        div.style.backgroundImage = `url('${imageUrls[j].image_url}')`;
                        container.appendChild(div);
                        fetch(`http://localhost:8000/api/v1/titles/${imageUrls[j].id}`)
                            .then(res => {
                                if (res.status >= 400) {
                                    throw new Error("Bad response from server");
                                }
                                return res.json();
                            })
                            .then(data => {
                                div.setAttribute('data-image_url', data.image_url);
                                div.setAttribute('data-original_title', data.original_title);
                                div.setAttribute('data-genres', data.genres);
                                div.setAttribute('data-date_published', data.date_published);
                                div.setAttribute('data-avg_vote', data.avg_vote);
                                div.setAttribute('data-imdb_score', data.imdb_score);
                                div.setAttribute('data-directors', data.directors);
                                div.setAttribute('data-actors', data.actors);
                                div.setAttribute('data-duration', data.duration);
                                div.setAttribute('data-countries', data.countries);
                                div.setAttribute('data-worldwide_gross_income', data.worldwide_gross_income);
                                div.setAttribute('data-long_description', data.long_description);

                            })
                        hiddeBouton(gaucheId, droiteId, 0);
                    }


                    let position = 0;
                    const step = 465;
                    const containerElement = document.getElementById(containerId);

                    const gauche = document.getElementById(gaucheId);
                    gauche.onclick = function () {
                        if (position < 0) {
                            position += step;
                            containerElement.style.transform = `translateX(${position}px)`;
                            container.style.transition = 'all 0.3s ease';
                            hiddeBouton(gaucheId, droiteId, position);
                        }
                    };

                    const droite = document.getElementById(droiteId);
                    droite.onclick = function () {
                        const maxPosition = -1392;
                        if (position > maxPosition) {
                            position -= step;
                            containerElement.style.transform = `translateX(${position}px)`;
                            container.style.transition = 'all 0.3s ease';
                            hiddeBouton(gaucheId, droiteId, position);
                        }
                    };
                    initAddEventListenerInfosFilms();
                }
            })
            .catch(err => {
                console.error(err);
            });
    }
}




function initAddEventListenerInfosFilms () {
    let images= document.getElementsByClassName("photos")

    for (let i= 0; i < images.length; i++) {
        images[i].addEventListener("click", function () {
            let imageUrl = this.dataset.image_url;
            let title = this.dataset.original_title;
            let long_description = this.dataset.long_description;
            let genres = this.dataset.genres;
            let date_published = this.dataset.date_published;
            let avg_vote = this.dataset.avg_vote;
            let imdb_score = this.dataset.imdb_score;
            let directors = this.dataset.directors;
            let actors = this.dataset.actors;
            let duration = this.dataset.duration;
            let countries = this.dataset.countries;
            let worldwide_gross_income = this.dataset.worldwide_gross_income;


            afficherInfosFilms(imageUrl, title, long_description, genres, date_published, avg_vote, imdb_score,
                directors, actors, duration, countries, worldwide_gross_income)
            })
    }
}

function afficherInfosFilms(imageUrl, title, long_description, genres, date_published, avg_vote, imdb_score, directors,
                            actors, duration, countries, worldwide_gross_income) {
    let popupInfo = document.getElementById("popup-overlay");
    let popupContent = document.querySelector(".popup-content");

    popupContent.innerHTML = `<img src="${imageUrl}" alt="Film" class="box_one"/>`;

    const original_title = document.createElement('div');
    original_title.textContent = title;
    original_title.classList.add('box_two')

    const data_genres = document.createElement('div');
    data_genres.textContent = genres;
    data_genres.classList.add('box_three')

    const data_date_published = document.createElement('div');
    data_date_published.textContent = 'Date: ' + date_published;
    data_date_published.classList.add('box_four')

    const data_avg_vote = document.createElement('div');
    data_avg_vote.textContent = 'Note moyene: ' + avg_vote;
    data_avg_vote.classList.add('box_five')

    const data_imdb_score = document.createElement('div');
    data_imdb_score.textContent = 'Note IMDB: ' + imdb_score;
    data_imdb_score.classList.add('box_six')

    const data_directors = document.createElement('div');
    data_directors.textContent = 'Realisateur(s): ' +  directors;
    data_directors.classList.add('box_seven')

    const data_actors = document.createElement('div');
    data_actors.textContent = 'Acteurs: ' + actors;
    data_actors.classList.add('box_eight')

    const data_duration = document.createElement('div');
    data_duration.textContent = 'Durée: ' + duration + ' min.';
    data_duration.classList.add('box_nine')

    const data_countries = document.createElement('div');
    data_countries.textContent = 'Pays: ' + countries;
    data_countries.classList.add('box_ten')

    const data_worldwide_gross_income = document.createElement('div');
    data_worldwide_gross_income.textContent = 'Résultat au Box Office: ' + worldwide_gross_income;
    data_worldwide_gross_income.classList.add('box_eleven')

    const description = document.createElement('p');
    description.textContent = 'Description: ' + long_description;
    description.classList.add('box_twelve')

    const newButton = document.createElement('button');
    newButton.textContent = 'X';
    newButton.id = 'popup_exit';
    newButton.onclick = afficherInfosFilms;
    newButton.classList.add('mon-bouton');

    const elementsToAdd = [original_title, newButton, data_genres, data_date_published, data_countries, data_avg_vote,
        data_imdb_score, data_duration, data_directors, data_actors, data_worldwide_gross_income,
        description];

    elementsToAdd.forEach(element => {
        popupContent.appendChild(element);
    });



    popupInfo.classList.toggle("open")
    }


/* Fonction pour supprimer les boutons de defilement */
function hiddeBouton(gaucheId, droiteId, position) {
    const gauche = document.getElementById(gaucheId);
    const droite = document.getElementById(droiteId);
    const maxPosition = -1392;

    if (position === 0)
        gauche.style.visibility = 'hidden';
    else
        gauche.style.visibility = 'visible';

    if (position <= maxPosition)
        droite.style.visibility = 'hidden';
    else
        droite.style.visibility = 'visible';
}
