$(document).ready(function () {
  const omdbApiKey = "382c68b3";
  const nyTimesApiKey = "r7DoTIKRHJVeJcAn7wGvTFoc3EDJSEAA";

  let searchMovieInput = document.querySelector("#search-movie");
  let searchMovieButton = document.querySelector("#search-movie-btn");

  let currentMovie = document.querySelector("#currentMovie");

  let movieSearchHistory = document.querySelector(".movie-history-list");

  let clearHistory = document.querySelector("#clear-history");

  let myMovieSearchHistory;

  let moviesArray = []; //localStorage.getItem('movieTitleKey') ///[]
  let test = localStorage.getItem("movieTitleKey");
  moviesArray.push(test);

  ///add eventListener when user inputs a search
  searchMovieButton.addEventListener("click", function (e) {
    e.preventDefault();
    let searchResult = searchMovieInput.value;

    let movieTitle = document.createElement("p");
    movieTitle.textContent = searchResult;

    moviesArray.push(searchResult); //movieTitle.textContent
    console.log(moviesArray);

    let myMovieSearchHistory = document.createElement("button");
    myMovieSearchHistory.textContent = searchResult;
    movieSearchHistory.appendChild(myMovieSearchHistory);

    getMovieTitle(movieTitle.textContent);

    saveMovieTitle(movieTitle.textContent);
  });

  //retries the movie title based on the search, using omdb api
  let getMovieTitle = function (search) {
    fetch(`https://www.omdbapi.com/?apikey=${omdbApiKey}&t=${search}`)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        console.log(data);

        currentMovie.innerHTML = "";

        let myMovieImg = document.createElement("img");
        myMovieImg.id = "div-movie-img";
        myMovieImg.setAttribute("src", `${data.Poster}`);
        currentMovie.appendChild(myMovieImg);

        let myMoviePlot = document.createElement("p");
        myMoviePlot.textContent = `Plot: ${data.Plot}`;
        myMoviePlot.id = "div-movie-plot";
        console.log(myMoviePlot.id);
        currentMovie.appendChild(myMoviePlot);

        let myMovieYear = document.createElement("p");
        myMovieYear.textContent = `Year: ${data.Year}`;
        myMovieYear.id = "div-movie-year";
        currentMovie.appendChild(myMovieYear);

        let myMovieRating = document.createElement("p");
        myMovieRating.textContent = `Rating: ${data.Rated}`;
        myMovieRating.id = "div-movie-rating";
        currentMovie.appendChild(myMovieRating);

        let myMovieGenre = document.createElement("p");
        myMovieGenre.textContent = `Genre: ${data.Genre}`;
        myMovieGenre.id = "div-movie-genre";
        currentMovie.appendChild(myMovieGenre);

        ///created another fetch call to display movie review from NY times API

        fetch(
          `https://api.nytimes.com/svc/movies/v2/reviews/search.json?query=${search}&api-key=${nyTimesApiKey}`
        )
          .then(function (response) {
            return response.json();
          })
          .then(function (data) {
            console.log(data); //.results[0].link

            let movieReview = document.createElement("a");
            movieReview.textContent = `Movie Review from NY Times:`;
            movieReview.id = "div-movie-review";
            movieReview.setAttribute("href", `${data.results[0].link.url}`);
            currentMovie.appendChild(movieReview);
          });
      });
  };

  ////function to save movie titles to local storage, to be updated later
  let saveMovieTitle = function (search) {
    localStorage.setItem("movieTitleKey", JSON.stringify(moviesArray));
  };

  let loadMovieTitle = function () {
    moviesArray = JSON.parse(localStorage.getItem("movieTitleKey")) || []; //object.keys

    // return movieTitles
  };

  let appendMovieHistory = function () {
    for (let count = 0; count < moviesArray.length; count++) {
      let myMovieSearchHistory = document.createElement("button");
      myMovieSearchHistory.textContent = moviesArray[count];
      movieSearchHistory.appendChild(myMovieSearchHistory);
    }
    //let myMovieSearchHistory = document.createElement('li')
    //   myMovieSearchHistory.textContent = loadMovieTitle()
    ///  movieSearchHistory.appendChild(myMovieSearchHistory)
  };

  loadMovieTitle();
  appendMovieHistory();

  //let clearMovieHistory = function () {
  //  localStorage.removeItem('movieTitleKey')
  // myMovieSearchHistory.textContent = ''
  //}

  //let movieSearchHistory = document.querySelector(".movie-history-list")
  let clearMovieHistory = function () {
    localStorage.removeItem("movieTitleKey");
    movieSearchHistory.innerHTML = "";
  };

  clearHistory.addEventListener("click", clearMovieHistory);
});
