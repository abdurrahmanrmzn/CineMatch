import { Link, useParams } from "react-router-dom";
import SiteHeader from "../components/SiteHeader";
import useMovieDetails from "../hooks/useMovieDetails";

function MovieDetailsPage() {
  const { movieId } = useParams();
  const { movie, loading, error } = useMovieDetails(movieId);

  if (loading) {
    return (
      <main className="home-page">
        <SiteHeader />
        <p className="details-message">Loading movie details…</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="home-page">
        <SiteHeader />
        <p className="details-message" role="alert">
          Could not load movie details: {error}
        </p>
        <Link className="back-link" to="/">
          ← Back to movies
        </Link>
      </main>
    );
  }

  if (!movie) {
    return (
      <main className="home-page">
        <SiteHeader />
        <p className="details-message">Movie not found.</p>
        <Link className="back-link" to="/">
          ← Back to movies
        </Link>
      </main>
    );
  }

  return (
    <main className="home-page">
      <SiteHeader />

      <section className="movie-details">
        <div className="details-poster">
          {movie.poster_path ? (
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={`${movie.title} poster`}
            />
          ) : (
            <span className="poster-fallback">Poster unavailable</span>
          )}
        </div>

        <div className="details-content">
          <p className="eyebrow">MOVIE DETAILS</p>
          <h1>{movie.title}</h1>

          <p className="details-meta">
            ★ {movie.vote_average?.toFixed(1) ?? "N/A"}
            {" · "}
            {movie.release_date || "Release date unavailable"}
            {" · "}
            {movie.runtime ? `${movie.runtime} min` : "Runtime unavailable"}
          </p>

          <div className="details-genres">
            {movie.genres?.map((genre) => (
              <span key={genre.id}>{genre.name}</span>
            ))}
          </div>

          <h2>Synopsis</h2>
          <p className="details-overview">
            {movie.overview || "No synopsis is available for this movie."}
          </p>

          <Link className="primary-button" to={`/booking/${movie.id}`}>
            Choose a showtime <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      <Link className="back-link" to="/">
        ← Back to movies
      </Link>
    </main>
  );
}

export default MovieDetailsPage;