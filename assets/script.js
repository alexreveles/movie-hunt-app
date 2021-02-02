$(document).ready(function () {
    const omdbApiKey = '382c68b3' 
    const nyTimesApiKey = 'r7DoTIKRHJVeJcAn7wGvTFoc3EDJSEAA'

    let searchMovieInput = document.querySelector("#search-movie")
    let searchMovieButton = document.querySelector("#search-movie-btn")

    let currentMovie = document.querySelector(".currentMovie")

    ///add eventListener when user inputs a search
    searchMovieButton.addEventListener("click", function (e) {
        e.preventDefault()
        let searchResult = searchMovieInput.value
        
        let movieTitle = document.createElement('p')
        movieTitle.textContent = searchResult
       // currentMovie.appendChild(movieTitle)

        getMovieTitle(movieTitle.textContent)
        saveMovieTitle(movieTitle.textContent)
        

    });

    //retries the movie title based on the search, using omdb api
    let getMovieTitle = function (search) {
        fetch(
            `http://www.omdbapi.com/?apikey=${omdbApiKey}&t=${search}`
        ).then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data)

            currentMovie.innerHTML = ''

            let myMovieImg = document.createElement('img')
            myMovieImg.setAttribute('src', `${data.Poster}`)
            currentMovie.appendChild(myMovieImg)

            let myMoviePlot = document.createElement('p')
            myMoviePlot.textContent = `Plot: ${data.Plot}`
            myMoviePlot.id = 'div-movie-plot'
            console.log(myMoviePlot.id)
            currentMovie.appendChild(myMoviePlot)

            let myMovieYear = document.createElement('p')
            myMovieYear.textContent = `Year: ${data.Year}`
            myMovieYear.id = 'div-movie-year'
            currentMovie.appendChild(myMovieYear)

            let myMovieRating = document.createElement('p')
            myMovieRating.textContent = `Rating: ${data.Rated}`
            myMovieRating.id = 'div-movie-rating'
            currentMovie.appendChild(myMovieRating)

            let myMovieGenre = document.createElement('p')
            myMovieGenre.textContent = `Genre: ${data.Genre}`
            myMovieGenre.id = 'div-movie-genre'
            currentMovie.appendChild(myMovieGenre)

            ///created another fetch call to display movie review from NY times API

            fetch(
                `https://api.nytimes.com/svc/movies/v2/reviews/search.json?query=${search}&api-key=${nyTimesApiKey}`
              )
                .then(function(response) {
                  return response.json();
                })
                .then(function(data) {
                  console.log(data); //.results[0].link
       
                  let movieReview = document.createElement('a');
                  movieReview.textContent = `Movie Review from NY Times: ${data.results[0].link.url}`;
                  movieReview.id = 'div-movie-review';
                  movieReview.setAttribute('href', `${data.results[0].link.url}`);
                  currentMovie.appendChild(movieReview);
                });

            
        })
    }

    ////function to save movie titles to local storage, to be updated later
    let saveMovieTitle = function (search) {
        localStorage.setItem(search, []);
    }
   
})
