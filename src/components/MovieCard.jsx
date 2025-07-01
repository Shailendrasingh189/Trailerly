import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import { useSearch } from "../context/searchContext.js";

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();
  // const { setSelectedMovie } = useSearch();
  const [isHovered, setIsHovered] = useState(false);

  const {
    id,
    title,
    vote_average,
    poster_path,
    release_date,
    original_language,
  } = movie;

  const handleMovieSelect = (movieId) => {
    // setSelectedMovie(movie);
    navigate(`/movie/${movieId}`);
  };

  return (
    <div
      className={`movie-card cursor-pointer transition-all duration-300 ${
        isHovered ? "scale-105" : " "
      }`}
      onClick={() => handleMovieSelect(id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && handleMovieSelect(id)}
    >
      <div className="relative overflow-hidden rounded-lg shadow-md">
        <img
          src={
            poster_path
              ? `https://image.tmdb.org/t/p/w500/${poster_path}`
              : "/no-movie.png"
          }
          alt={title}
        />
        <div className="mt-4">
          <h3>{title}</h3>

          <div className="content">
            <div className="rating">
              <img src="star.svg" alt="Start Icon" />
              <p>{vote_average ? vote_average.toFixed(1) : "N/A"}</p>
            </div>
            <span>•</span>
            <p className="lang">{original_language}</p>
            <span>•</span>
            <p className="year">
              {release_date ? release_date.split("-")[0] : "N/A"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
