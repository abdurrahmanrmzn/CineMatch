
import { useState } from "react";
import heroImage from "../assets/hero.png";
import useNowPlayingMovies from "../hooks/useNowPlayingMovies";
import SiteHeader from "../components/SiteHeader";
import MovieCard from "../components/MovieCard";

function HomePage() {
  const { movies, loading, error } = useNowPlayingMovies();
  const [showAllMovies, setShowAllMovies] = useState(false);
  const visibleMovies = showAllMovies ? movies : movies.slice(0, 5);

  return (
    <main className="home-page">
      <SiteHeader />

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
            visibleMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))
            }

          {!loading && !error && movies.length === 0 && (
            <p>No movies found.</p>
          )}
        </div>

        {!loading && !error && movies.length > 5 && (
          <button
            className="movies-toggle"
            type="button"
            onClick={() => setShowAllMovies((current) => !current)}
          >
            {showAllMovies ? "View less ↑" : "View all movies ↓"}
          </button>
        )}
      </section>
    </main>
  );
}
export default HomePage;