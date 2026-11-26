import "./App.css";
import { Link, Route, Routes, useParams } from "react-router-dom";
import heroImage from "./assets/hero.png";
import useNowPlayingMovies from "./hooks/useNowPlayingMovies";
import useMovieDetails from "./hooks/useMovieDetails";

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

function HomePage() {
  const { movies, loading, error } = useNowPlayingMovies();

  return (
    <main className="home-page">
      <header className="site-header">
        <a className="brand" href="/">
          <span className="brand-icon">▶</span>
          <span>
            Cine<span className="brand-accent">Match</span>
          </span>
        </a>

        <nav className="main-nav" aria-label="Main navigation">
          <a className="active" href="/">
            Home
          </a>
          <a href="#movies">Movies</a>
          <a href="#bookings">My Bookings</a>
        </nav>

        <button className="login-button" type="button">
          Login
        </button>
      </header>

      <section
        className="hero"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="hero-content">
          <p className="eyebrow">YOUR NEXT MOVIE NIGHT</p>

          <h1>
            Great movies.
            <br />
            Unforgettable moments.
          </h1>

          <p className="hero-description">
            Find your next favourite film and book the perfect seats.
          </p>

          <a className="primary-button" href="#movies">
            Explore Movies <span aria-hidden="true">→</span>
          </a>
        </div>
      </section>

      <section className="movies-section" id="movies">
        <div className="section-heading">
          <div>
            <p className="eyebrow">NOW SHOWING</p>
            <h2>Find your next favourite movie.</h2>
          </div>

          <a href="#movies" className="view-all-link">
            View all <span aria-hidden="true">→</span>
          </a>
        </div>

        <div className="movie-grid">
          {loading &&
            Array.from({ length: 5 }, (_, index) => (
              <div className="movie-skeleton" key={index} aria-hidden="true">
                <div className="skeleton-poster" />
                <div className="skeleton-line" />
                <div className="skeleton-line skeleton-line-short" />
              </div>
            ))}

          {error && (
            <p role="alert">Could not load movies: {error}</p>
          )}

          {!loading &&
            !error &&
            movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}

          {!loading && !error && movies.length === 0 && (
            <p>No movies found.</p>
          )}
        </div>
      </section>
    </main>
  );
}

function MovieDetailsPage() {
  const { movieId } = useParams();
  const { movie, loading, error } = useMovieDetails(movieId);

  if (loading) {
    return (
      <main className="home-page">
        <p className="details-message">Loading movie details…</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="home-page">
        <p className="details-message" role="alert">
          Could not load movie details: {error}
        </p>
        <Link className="back-link" to="/">← Back to movies</Link>
      </main>
    );
  }

  if (!movie) {
    return (
      <main className="home-page">
        <p className="details-message">Movie not found.</p>
        <Link className="back-link" to="/">← Back to movies</Link>
      </main>
    );
  }

  return (
    <main className="home-page">
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

      <Link className="back-link" to="/">← Back to movies</Link>
    </main>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/movies/:movieId" element={<MovieDetailsPage />} />
    </Routes>
  );
}

export default App;