"use client";
import { useState, useEffect } from "react";
import "./style.css"
import Movie from "@/components/movies/movie";
const API_KEY = "62ba84da719c3812b6d078e3f7c2e4f1";

export default function MovieDetail({ params }) {
  
  const [movieId, setMovieId] = useState(null);
  const [movie, setMovie] = useState(null);
  const [trailer, setTrailer] = useState(null);
  const [cast, setCast] = useState([]);
  const [relatedMovies, setRelatedMovies] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTrailerModalOpen, setIsTrailerModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function resolveParams() {
      const resolvedParams = await params;
      setMovieId(resolvedParams.movieId);
    }
    resolveParams();
  }, [params]);

  useEffect(() => {
    if (movieId) {
      fetchMovieDetail();
      fetchMovieTrailer();
      fetchMovieCast();
      fetchRelatedMovies();
    }
  }, [movieId]);

  const fetchMovieDetail = async () => {
    setIsLoading(true);
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}`
    );
    const data = await response.json();
    setMovie(data);
    setIsLoading(false);
  };

  const fetchMovieTrailer = async () => {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${API_KEY}`
    );
    const data = await response.json();
    const trailer = data.results.find((video) => video.type === "Trailer");
    setTrailer(trailer);
  };

  const fetchMovieCast = async () => {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${API_KEY}`
    );
    const data = await response.json();
    setCast(data.cast);
  };

  const fetchRelatedMovies = async () => {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}/similar?api_key=${API_KEY}`
    );
    const data = await response.json();
    setRelatedMovies(data.results);
  };

  const nextSlide = () => {
    if (currentSlide < relatedMovies.length - 1) {
      setCurrentSlide((prev) => prev + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1);
    }
  };

  const playNow = () => {
    if (trailer) {
      setIsTrailerModalOpen(true);
    }
  };

  const closeTrailerModal = () => {
    setIsTrailerModalOpen(false);
  };

  useEffect(() => {
    const sliderInterval = setInterval(() => {
      const castContainer = document.querySelector(".cast-members");
      if (castContainer) {
        castContainer.scrollLeft += 1; 
        if (
          castContainer.scrollLeft + castContainer.offsetWidth >=
          castContainer.scrollWidth
        ) {
          castContainer.scrollLeft = 0; 
        }
      }
    }, 50); 

    return () => clearInterval(sliderInterval);
  }, [cast]);

  return (
    <div className="movie-detail-container">
      {movie && movie.backdrop_path ? (
        <img
          className="background-image"
          src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
          alt={movie.title}
        />
      ) : (
        <div className="no-image">No Background Image Available</div>
      )}

      <div className="movie-content">
        <div className="left-section">
          {isLoading ? (
            <div>Loading movie details...</div>
          ) : movie ? (
            <>
              <h2 className="movie-title">{movie.title}</h2>
              <div className="movie-info">
                <span>⭐ {movie.vote_average}</span>
                <span>{movie.runtime} min</span>
                <span>{movie.release_date}</span>
              </div>
              <p className="movie-overview">{movie.overview}</p>
              <div className="buttons">
                <button onClick={playNow}>Play Now</button>
              </div>
            </>
          ) : (
            <div>Error loading movie details</div>
          )}
        </div>

        <div className="right-section">
          <div className="related-movies-section">
            <h3>Related Movies</h3>
            <div className="related-movies-slider">
              <div
                className="related-movies-wrapper"
                style={{
                  transform: `translateX(-${currentSlide * 200}px)`,
                }}
              >
                {relatedMovies.length > 0 ? (
                  relatedMovies.map((relatedMovie) => (
                    <div
                      key={relatedMovie.id}
                      className="related-movie-card"
                      onClick={() => setMovieId(relatedMovie.id)}
                      style={{ cursor: "pointer" }}
                    >
                      <img
                        src={`https://image.tmdb.org/t/p/w200${relatedMovie.poster_path}`}
                        alt={relatedMovie.title}
                      />
                      <p>{relatedMovie.title}</p>
                    </div>
                  ))
                ) : (
                  <div>No related movies available</div>
                )}
              </div>
              <div className="slider-buttons">
                <button onClick={prevSlide}>❮</button>
                <button onClick={nextSlide}>❯</button>
              </div>
            </div>
          </div>

          <div className="cast-section">
            <h3>Cast</h3>
            <div className="cast-members">
              {cast.map((member) => (
                <div key={member.id} className="cast-member">
                  <img
                    src={`https://image.tmdb.org/t/p/w200${member.profile_path}`}
                    alt={member.name}
                  />
                  <span>{member.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {isTrailerModalOpen && trailer && (
        <div className="trailer-modal">
          <div className="trailer-modal-content">
            <button className="close-button" onClick={closeTrailerModal}>
              &times;
            </button>
            <iframe
              width="100%"
              height="400px"
              src={`https://www.youtube.com/embed/${trailer.key}`}
              frameBorder="0"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="Trailer"
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
}