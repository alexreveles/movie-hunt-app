$(document).ready(function () {
    
  const omdbApiKey = "382c68b3";
  const nyTimesApiKey = "r7DoTIKRHJVeJcAn7wGvTFoc3EDJSEAA";

  let searchMovieInput = document.querySelector("#search-movie");
  let searchMovieButton = document.querySelector("#search-movie-btn");

  let currentMovie = document.querySelector("#currentMovie");

  let movieSearchHistory = document.querySelector(".movie-history-list");

  let clearHistory = document.querySelector("#clear-history");

  let moviesArray = []; 
  let test = localStorage.getItem("movieTitleKey");
  moviesArray.push(test);

    // retrieve data from previous buttons created 
  $('.movie-history-list').on("click", 'button', function(event) {
       currentSelectedMovie = $(this).html();
       getMovieTitle(currentSelectedMovie);
  });
    
  ///add eventListener when user inputs a search
  searchMovieButton.addEventListener("click", function (e) {
    e.preventDefault();
    let searchResult = searchMovieInput.value;

    let movieTitle = document.createElement("p");
    movieTitle.textContent = searchResult;
 
    moviesArray.push(searchResult); 

    let myMovieSearchHistory = document.createElement("button");
    myMovieSearchHistory.textContent = searchResult;
    movieSearchHistory.appendChild(myMovieSearchHistory);
    getMovieTitle(movieTitle.textContent);
    saveMovieTitle(movieTitle.textContent);
    // clear search input
    $('#search-movie').val('')
});

  //retries the movie title based on the search, using omdb api
  let getMovieTitle = function (search) {
    fetch(`https://www.omdbapi.com/?apikey=${omdbApiKey}&t=${search}`)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
       
        if (data.Response === 'True') { ///when the user inputs a valid movie search

        currentMovie.innerHTML = "";

        let myMovieImg = document.createElement("img");
        myMovieImg.id = "div-movie-img";
        myMovieImg.setAttribute("src", `${data.Poster}`);
        currentMovie.appendChild(myMovieImg);

        let myMoviePlot = document.createElement("p");
        myMoviePlot.textContent = `Plot: ${data.Plot}`;
        myMoviePlot.id = "div-movie-plot";
        
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
            
            if (data.results === null) {
             ///this is when the search result has no movie articles available
              let noArticle = document.createElement('p');
              noArticle.textContent = 'No article available based from your search.';
              noArticle.id = "div-no-article";
              currentMovie.appendChild(noArticle);

          } else if (data.results[0]) { ///when the movie search has an article
            let movieReview = document.createElement("a");
            movieReview.textContent = `Movie Review from NY Times:`;
            movieReview.id = "div-movie-review";
            movieReview.setAttribute("href", `${data.results[0].link.url}`);
            currentMovie.appendChild(movieReview);
          }

          });

        }
        else {
          ///when the user inputs an invalid movie search
          currentMovie.innerHTML = '';
          let noResult = document.createElement('h3');
          noResult.textContent = "No results based on your search. Please try again.";
          noResult.id = "div-no-result";
          currentMovie.appendChild(noResult);

        }
      });
      
  };

  ////function to save movie titles to local storage
  let saveMovieTitle = function (search) {
    localStorage.setItem("movieTitleKey", JSON.stringify(moviesArray));
  };

  ///function to load movie titles
  let loadMovieTitle = function () {
    moviesArray = JSON.parse(localStorage.getItem("movieTitleKey")) || [];
  };

  ///function to actually append the saved movie titles to the screen
  let appendMovieHistory = function () {
    for (let count = 0; count < moviesArray.length; count++) {
      let myMovieSearchHistory = document.createElement("button");
      myMovieSearchHistory.textContent = moviesArray[count];
      movieSearchHistory.appendChild(myMovieSearchHistory);
    }

  };

  ///calling these two functions on every page load
  loadMovieTitle();
  appendMovieHistory();

  //function to clear movie history
  let clearMovieHistory = function () {
    localStorage.removeItem("movieTitleKey");
    movieSearchHistory.innerHTML = "";
  };

  ///clear history button whenever it is clicked.
  clearHistory.addEventListener("click", clearMovieHistory);
});
