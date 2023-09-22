let pageNumber;
let totalPages = 0;
let currentState = "desc";
let favMovies = [];

const movieListSection = document.querySelector("#movie-list");
const nextBtn = document.querySelector("#next");
const prevBtn = document.querySelector("#prev");
const pageNumberContainer = document.querySelector("#page-no");
const ratingToggle = document.querySelector("#rating-toggle");
const movieControles = document.querySelector("#pagination");
const allMoviesButton = document.querySelector("#allMovies");
const favMoviesButton = document.querySelector("#favMovies");

allMoviesButton.addEventListener('click', ()=>{
    init();
});

favMoviesButton.addEventListener('click', ()=>{
    showMovies(1, "desc", favMovies);
});

const SORT_ASC = "popularity.asc";
const SORT_DESC = "popularity.desc";

const SORT_ASC_TEXT = "Sort by rating descending";
const SORT_DESC_TEXT = "Sort by rating ascending";

function addNavigationButton(){
    nextBtn.addEventListener('click', ()=>{
        if(pageNumber < totalPages){
            pageNumber++;
            localStorage.setItem("pageNumber", pageNumber);
            showMovies(pageNumber);
        }
    });
    
    prevBtn.addEventListener('click', ()=>{
        if(pageNumber > 1){
            pageNumber--;
            localStorage.setItem("pageNumber", pageNumber);
            showMovies(pageNumber);
        }
    });
}

function addPopularityButton () {
    ratingToggle.addEventListener('click', (e)=> {
        currentState = currentState === "desc" ? "asc" : "desc";
        showMovies(pageNumber, currentState);
        e.target.innerText = currentState === "desc" ? SORT_DESC_TEXT : SORT_ASC_TEXT;
    });
}

function handleHeartClick(e, movie){
    e.target.classList.toggle("fa-regular");
    e.target.classList.toggle("fa-solid");
    e.target.classList.toggle("heart-red");

    if(e.target.classList.contains("fa-solid")){
        favMovies.push(movie);
    }
    else{
        favMovies = favMovies.filter((currentMovie)=>{
            return currentMovie.id !== movie.id;
        });
    }
    localStorage.setItem("favMovies", JSON.stringify(favMovies));
}

async function showMovies(pageNumber=1, sort_by="desc", customMovieArray = null) {
    movieListSection.innerText = "";
    let movieList;
    if(!customMovieArray){
        movieControles.classList.remove("hidden");
        const options = {
            method: 'GET',
            headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4YWU0MWUzMGEzNzI1OGNlODU1YTE2MWU5N2NmZGI5MCIsInN1YiI6IjY0ZWEwZDc0NDU4MTk5MDBlMzUzMDlhYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.8lsG8dtqk1PTdiKJkyvmH2MKvlJ2_OMOv1pESn8LIR4'
            }
        };
        
        let response;

        response = await fetch(
            `https://api.themoviedb.org/3/discover/movie?language=en-US&page=${pageNumber}&sort_by=${
                sort_by==="asc" ? SORT_ASC : SORT_DESC
            }`, 
            options
        );
        
        const json = await response.json();
        totalPages = json.total_pages;
        movieList = json.results;
    }
    else{
        movieList = customMovieArray;
        movieControles.classList.add("hidden");
    }
    
    //console.dir(json);

    for(let movie of movieList){
        //movie detail section 
        const movieTitle = document.createElement("h2");
        movieTitle.innerText = movie.title;

        const rating = document.createElement("p");
        rating.innerText = movie.vote_average;

        const movieDetails = document.createElement("section");
        movieDetails.appendChild(movieTitle);
        movieDetails.appendChild(rating);
        movieDetails.classList.add("movie-details");
        //banner
        let banner = document.createElement("img");
        banner.src=`https://image.tmdb.org/t/p/original/${movie.backdrop_path}`;
        banner.classList.add("movie-poster");
        //footer
        const date = document.createElement("p");
        date.innerText = `Date: ${movie.release_date}`;

        const heart = document.createElement("i");
        heart.classList.add("fa-regular", "fa-heart", "like");

        if(favMovies.find((currentMovie) => {
            return currentMovie.id === movie.id;
        }))
        {
            heart.classList.toggle("fa-regular");
            heart.classList.toggle("fa-solid");
            heart.classList.toggle("heart-red");
        }

        heart.addEventListener('click', (e)=>{
            handleHeartClick(e, movie);
        });

        const footer = document.createElement("footer");
        footer.appendChild(date);
        footer.appendChild(heart);
        //parent
        const movieElement = document.createElement("article");
        movieElement.classList.add("movie");
        movieElement.appendChild(banner);
        movieElement.appendChild(movieDetails);
        movieElement.appendChild(footer);

        movieListSection.appendChild(movieElement);
        pageNumberContainer.innerText = pageNumber;
    }
}

async function init(){
    pageNumber = localStorage.getItem("pageNumber") ? Number.parseInt(localStorage.getItem("pageNumber")) : 1;
    favMovies = localStorage.getItem("favMovies") ? JSON.parse(localStorage.getItem("favMovies")) : [];
    await showMovies(pageNumber);
    addNavigationButton();
    addPopularityButton();
}

init();