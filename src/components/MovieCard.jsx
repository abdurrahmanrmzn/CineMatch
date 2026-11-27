import { Link } from "react-router-dom";

function MovieCard({ movie }) {
  return (
   <Link to={`/movies/${movie.id}`} className="movie-card">
      <div className="movie-poster">
        {movie.posterPath ? (
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.posterPath}`}
            alt={`${movie.title} poster`}
            loading="lazy"
          />
        ) : (
          <span className="poster-fallback">Poster unavailable</span>
        )}

        <span className="movie-rating">★ {movie.rating}</span>
      </div>

      <div className="movie-card-info">
        <h3>{movie.title}</h3>
        <p>{movie.genre}</p>
      </div>
    </Link>
  );
}

export default MovieCard;