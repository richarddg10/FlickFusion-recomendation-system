import { NavBar } from '../../components'
import { useEffect, useState } from 'react';
import { APIMovies, APIGenres } from '../../api'
import Select from 'react-select';
import './Home.css'

export function Home() {

  const [genres, setGenres] = useState([])
  const [movies, setMovies] = useState([])
  const [selectedGenre, setSelectedGenre] = useState(null)
  const [selectedReleaseYear, setSelectedReleaseYear] = useState(null)
  const [selectedLanguage, setSelectedLanguage] = useState(null)
  const [filteredMovies, setFilteredMovies] = useState([])
  const [recommendedMovies, setRecommendedMovies] = useState([])
  const [selectedMovie, setSelectedMovie] = useState(null)

  useEffect(() => {
    async function fetchData() {
      const genresData = await APIGenres()
      setGenres(genresData)
      const moviesData = await APIMovies()
      setMovies(moviesData)
    }
    fetchData()
  }, [])

  useEffect(() => {
    filterMovies()
  }, [selectedGenre, selectedReleaseYear, selectedLanguage])

  useEffect(() => {
    console.log(recommendedMovies) // Imprime los datos recomendados
  }, [recommendedMovies])

  const genreOptions = genres.map(genre => ({ value: genre.id, label: genre.name }))

  const dateOptions = [...new Set(movies.map(movie => movie.release_date.slice(0, 4)))].map(year => ({ value: year, label: year })).sort((a, b) => b.value - a.value)

  const languajeOptions = [...new Set(movies.map(movie => movie.original_language))].map(language => ({ value: language, label: language }))

  const handleGenreChange = (selectedGenreValue) => {
    setSelectedGenre(selectedGenreValue)
  }

  const handleReleaseYearChange = (selectedReleaseYearValue) => {
    setSelectedReleaseYear(selectedReleaseYearValue)
  }

  const handleLanguageChange = (selectedLanguageValue) => {
    setSelectedLanguage(selectedLanguageValue)
  }

  const filterMovies = () => {
    let filteredMovies = movies

    if (selectedGenre) {
      filteredMovies = filteredMovies.filter(movie => movie.genre_ids.includes(selectedGenre.value))
    }

    if (selectedReleaseYear) {
      filteredMovies = filteredMovies.filter(movie => movie.release_date.slice(0, 4) === selectedReleaseYear.value)
    }

    if (selectedLanguage) {
      filteredMovies = filteredMovies.filter(movie => movie.original_language === selectedLanguage.value)
    }

    setFilteredMovies(filteredMovies)
  }

  const moviesByGenre = genres.reduce((acc, genre) => {
    acc[genre.id] = movies.filter(movie => movie.genre_ids.includes(genre.id))
    return acc
  }, {})

  const handleMovieLike = async (likedMovie) => {
    const response = await fetch('http://localhost:5000/recommendations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ liked_movie: likedMovie })
    })

    if (response.ok) {
      const data = await response.json()
      console.log(data) // Verifica datos recibidos del servidor
      setRecommendedMovies(data.recommended_movies)
    } else {
      console.error('Error al obtener recomendaciones')
    }
  }

  const handleMovieSelect = async (selectedMovie) => {
    const response = await fetch('http://localhost:5000/recommendations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ selected_movie: selectedMovie })
    })

    if (response.ok) {
      const data = await response.json()
      console.log(data) // Verifica datos recibidos del servidor
      setRecommendedMovies(data.recommended_movies)
    } else {
      console.error('Error al obtener recomendaciones')
    }
    setSelectedMovie(selectedMovie)
  }

  const handleBackClick = () => {
      setSelectedMovie(null)
  }

  return (
    <>
      <body className='home'>

        <NavBar onClick={handleBackClick} />

        {selectedMovie ? (
          <div className="fullscreen-movie">
            <img
              className="fullscreen-movie-poster"
              src={`https://image.tmdb.org/t/p/w500${selectedMovie.backdrop_path}`}
              alt="Movie Poster"
            />
            <div className="movie-overlay">
              <button className="back-btn" onClick={handleBackClick}>X</button>
              <div className='movie-description'>
                <h1>{selectedMovie.title}</h1>
                <p>{selectedMovie.overview}</p>
                <div className='extra-info'>
                  <h2>Languaje: <span>{selectedMovie.original_language}</span></h2>
                  <h2>Vote average: <span>{selectedMovie.vote_average}</span></h2>
                  <h2>Release date: <span>{selectedMovie.release_date}</span></h2>
                </div>
              </div>
              <div className="buttons-container">
                <button className="watch-now-btn"><img src="/play-icon.png" alt="play" /> Watch Now</button>
                <button className='like-btn' onClick={() => handleMovieLike(movie)}>
                  <img src='/like-icone.png' />
                </button>
              </div>
            </div>
            <div className='similar-section'>
              <h1 className='similar-title'>Similar</h1>
              <div className='movies-section'>
                {recommendedMovies.map((movie) => (
                  <div className='movie-container' key={movie.id}>
                    <div className='votes-container'>
                      <img src='/star-icon.png' />
                      <h1>{movie.vote_average}</h1>
                    </div>
                    <img
                      className='movie-poster'
                      src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`}
                      alt="movie-poster"
                      onClick={() => handleMovieSelect(movie)}
                    />
                    <div className='movie-info'>
                      <h1 className='movie-title'>
                        {movie.title}
                        <span className='movie-date'>{movie.release_date}</span>
                      </h1>
                      <button className='like-btn' onClick={() => handleMovieLike(movie)}>
                        <img src='/like-icone.png' />
                      </button>
                    </div>
                  </div>    
                ))}
              </div>
            </div>
          </div>
        ) : (

          <div className='home-bg'>
            <h1 className='home-title'>Don’t you know <span className='span-home-title'>what to see?...</span></h1>

            <div className='filters-section'>
              <Select className="genre-filter"
                options={genreOptions}
                value={selectedGenre}
                onChange={handleGenreChange}
                placeholder="Genre"
              />
              <Select className="date-filter"
                options={dateOptions}
                value={selectedReleaseYear}
                onChange={handleReleaseYearChange}
                placeholder="Release date"
              />
              <Select className="languaje-filter"
                options={languajeOptions}
                value={selectedLanguage}
                onChange={handleLanguageChange}
                placeholder="Languaje"
              />
            </div>

            <h1 className='for-you-title'>For you</h1>
            {!recommendedMovies || recommendedMovies.length === 0 ? (
              <div className='for-you-instruction'>
                <p>You haven't mentioned what movies you like yet!. Like the movies that catch your attention and we will create suggestions for you.</p>
              </div>
            ): null}
            {recommendedMovies || recommendedMovies.length != 0 ? (
              <div className='movies-section'>
                {recommendedMovies.map((movie) => (
                    <div className='movie-container' key={movie.id}>
                      <div className='votes-container'>
                        <img src='/star-icon.png' />
                        <h1>{movie.vote_average}</h1>
                      </div>
                      <img
                        className='movie-poster'
                        src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`}
                        alt="movie-poster"
                        onClick={() => handleMovieSelect(movie)}
                      />
                      <div className='movie-info'>
                        <h1 className='movie-title'>
                          {movie.title}
                          <span className='movie-date'>{movie.release_date}</span>
                        </h1>
                        <button className='like-btn' onClick={() => handleMovieLike(movie)}>
                          <img src='/like-icone.png' />
                        </button>
                      </div>
                    </div>    
                ))}
              </div>
            ): null}

            {(!selectedGenre && !selectedReleaseYear && !selectedLanguage) && genres.map((genre) => (
              <>
                <h1 className='genre-title' key={genre.id}>{genre.name}</h1>
                <div className='movies-section'>
                  {moviesByGenre[genre.id]?.map((movie) => (
                    <>
                      <div className='movie-container' key={movie.id}>
                        <div className='votes-container'>
                          <img src='/star-icon.png' />
                          <h1>{movie.vote_average}</h1>
                        </div>
                        <img
                          className='movie-poster'
                          src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`}
                          alt="movie-poster"
                          onClick={() => handleMovieSelect(movie)}
                        />
                        <div className='movie-info'>
                          <h1 className='movie-title'>
                            {movie.title}
                            <span className='movie-date'>{movie.release_date}</span>
                          </h1>
                          <button className='like-btn' onClick={() => handleMovieLike(movie)}>
                            <img src='/like-icone.png' />
                          </button>
                        </div>
                      </div>
                    </>
                  ))}
                </div>
              </>
            ))}

            {filteredMovies && filteredMovies.length > 0 ? (
              <h1 className='genre-title'>Filtered movies</h1>
            ): null}

            {filteredMovies || filteredMovies.length > 0 ? (
              <>
                <div className='filtered-movies-section'>
                  {filteredMovies && filteredMovies.map((movie) => (
                    <div className='movie-container' key={movie.id}>
                      <div className='votes-container'>
                        <img src='/star-icon.png' />
                        <h1>{movie.vote_average}</h1>
                      </div>
                      <img
                        className='movie-poster'
                        src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`}
                        alt="movie-poster"
                        onClick={() => handleMovieSelect(movie)}
                      />
                      <div className='movie-info'>
                        <h1 className='movie-title'>
                          {movie.title}
                          <span className='movie-date'>{movie.release_date}</span>
                        </h1>
                        <button className='like-btn' onClick={() => handleMovieLike(movie)}>
                          <img src='/like-icone.png' />
                        </button>
                      </div>
                    </div>    
                  ))}
                </div>
              </>
            ): null}

          </div>
        )}
      </body>
    </>
  )
}