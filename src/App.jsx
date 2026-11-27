import "./App.css";
import { Link, Route, Routes, useParams } from "react-router-dom";
import { useState } from "react";
import heroImage from "./assets/hero.png";
import useNowPlayingMovies from "./hooks/useNowPlayingMovies";
import useMovieDetails from "./hooks/useMovieDetails";

function SiteHeader() {
  return (
    <header className="site-header">
      <Link className="brand" to="/">
        <span className="brand-icon">▶</span>
        <span>
          Cine<span className="brand-accent">Match</span>
        </span>
      </Link>

      <nav className="main-nav" aria-label="Main navigation">
        <Link className="active" to="/">
          Home
        </Link>
        <Link to="/#movies">Movies</Link>
        <Link to="/#bookings">My Bookings</Link>
      </nav>

      <button className="login-button" type="button">
        Login
      </button>
    </header>
  );
}

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
      <Link className="back-link" to="/">← Back to movies</Link>
    </main>
  );
}

if (!movie) {
  return (
    <main className="home-page">
      <SiteHeader />
      <p className="details-message">Movie not found.</p>
      <Link className="back-link" to="/">← Back to movies</Link>
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

      <Link className="back-link" to="/">← Back to movies</Link>
    </main>
  );
}

function BookingPage() {
  const { movieId } = useParams();
  const { movie, loading, error } = useMovieDetails(movieId);

  const [selectedShowtime, setSelectedShowtime] = useState("");
  const [selectedSeats, setSelectedSeats] = useState([]);

  const seatRows = ["A", "B", "C", "D", "E"];
  const seatsPerRow = 8;

  // Mock occupied seats for the demo
  const occupiedSeats = ["A3", "B6", "D2", "D7"];

  const getSeatPrice = (row) => {
    if (row === "A" || row === "B") return 1200;
    if (row === "C" || row === "D") return 900;
    return 700;
  };

  const toggleSeat = (seatId) => {
    setSelectedSeats((currentSeats) =>
      currentSeats.includes(seatId)
        ? currentSeats.filter((seat) => seat !== seatId)
        : [...currentSeats, seatId]
    );
  };

  const totalPrice = selectedSeats.reduce((total, seatId) => {
    return total + getSeatPrice(seatId[0]);
  }, 0);

  const showtimes = ["10:30 AM", "2:30 PM", "6:30 PM"];

  if (loading) {
    return (
      <>
        <SiteHeader />
        <main className="booking-page">
          <p className="booking-status">Loading movie details...</p>
        </main>
      </>
    );
  }

  if (error || !movie) {
    return (
      <>
        <SiteHeader />
        <main className="booking-page">
          <p className="booking-status">
            We couldn’t load this movie. Please return to the movie list and try again.
          </p>
        </main>
      </>
    );
  }

  return (
    <>
      <SiteHeader />

      <main className="booking-page">
        <section className="booking-intro">
          <p className="booking-eyebrow">YOUR MOVIE NIGHT STARTS HERE</p>
          <h1>Book your seats</h1>
          <p className="booking-subtitle">
            Choose a showtime at CineMatch Cinema. Your seat selection comes next.
          </p>
        </section>

        <section className="booking-layout">
          <div className="booking-movie-card">
            {movie.poster_path ? (
              <img
                className="booking-poster"
                src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
                alt={`${movie.title} poster`}
              />
            ) : (
              <div className="booking-poster booking-poster-placeholder">
                Poster unavailable
              </div>
            )}

            <div className="booking-movie-info">
              <p className="booking-card-label">NOW BOOKING</p>
              <h2>{movie.title}</h2>
              <p>
                {movie.release_date
                  ? new Date(movie.release_date).getFullYear()
                  : "Release year unavailable"}
                {movie.runtime ? ` · ${movie.runtime} min` : ""}
              </p>
            </div>
          </div>

          <div className="booking-options">
            <section className="booking-venue">
              <div className="booking-venue-icon" aria-hidden="true">
                <span>CM</span>
              </div>

              <div>
                <p className="booking-card-label">YOUR CINEMA</p>
                <h2>CineMatch Cinema</h2>
                <p>One cinema. Your next movie night.</p>
              </div>
            </section>

            <section className="booking-showtimes">
              {selectedShowtime && (
                <section className="booking-seats">
                  <div className="booking-section-heading">
                    <div>
                      <p className="booking-card-label">STEP 02</p>
                      <h2>Choose your seats</h2>
                    </div>
                    <span className="booking-step">
                      {selectedSeats.length} selected
                    </span>
                  </div>

                  <div className="booking-screen">
                    SCREEN
                  </div>

                  <div className="booking-seat-map">
                    {seatRows.map((row) => (
                      <div className="booking-seat-row" key={row}>
                        <span className="booking-row-label">{row}</span>

                        <div className="booking-seat-row-buttons">
                          {Array.from({ length: seatsPerRow }, (_, index) => {
                            const seatNumber = index + 1;
                            const seatId = `${row}${seatNumber}`;
                            const isOccupied = occupiedSeats.includes(seatId);
                            const isSelected = selectedSeats.includes(seatId);

                            return (
                              <button
                                key={seatId}
                                type="button"
                                className={`booking-seat ${
                                  isOccupied ? "occupied" : ""
                                } ${isSelected ? "selected" : ""}`}
                                disabled={isOccupied}
                                aria-label={`Seat ${seatId}${
                                  isOccupied ? ", occupied" : ""
                                }`}
                                aria-pressed={isSelected}
                                onClick={() => toggleSeat(seatId)}
                              >
                                {seatNumber}
                              </button>
                            );
                          })}
                        </div>

                        <span className="booking-row-label">{row}</span>
                      </div>
                    ))}
                  </div>

                  <div className="booking-seat-legend">
                    <span><i className="legend-seat available" /> Available</span>
                    <span><i className="legend-seat selected" /> Selected</span>
                    <span><i className="legend-seat occupied" /> Occupied</span>
                  </div>

                  <div className="booking-total-panel">
                    <div>
                      <p className="booking-card-label">YOUR SELECTION</p>
                      <strong>
                        {selectedSeats.length === 0
                          ? "No seats selected"
                          : selectedSeats.join(", ")}
                      </strong>
                      <p>
                        {selectedSeats.length}{" "}
                        {selectedSeats.length === 1 ? "ticket" : "tickets"}
                      </p>
                    </div>

                    <div className="booking-total-price">
                      <span>Total</span>
                      <strong>LKR {totalPrice.toLocaleString("en-LK")}</strong>
                    </div>
                  </div>
                </section>
              )}
              <div className="booking-section-heading">
                <div>
                  <p className="booking-card-label">PICK YOUR SESSION</p>
                  <h2>Choose a showtime</h2>
                </div>
                <span className="booking-step">01 / 02</span>
              </div>

              <div className="booking-time-options">
                {showtimes.map((showtime) => (
                  <button
                    key={showtime}
                    type="button"
                    className={`booking-time-option ${
                      selectedShowtime === showtime ? "selected" : ""
                    }`}
                    aria-pressed={selectedShowtime === showtime}
                    onClick={() => setSelectedShowtime(showtime)}
                  >
                    <span>{showtime}</span>
                    <small>Standard session</small>
                  </button>
                ))}
              </div>

              <div className="booking-selection-panel" aria-live="polite">
                {selectedShowtime ? (
                  <>
                    <div>
                      <p className="booking-card-label">YOUR SESSION</p>
                      <strong>{selectedShowtime}</strong>
                      <p>{movie.title} · CineMatch Cinema</p>
                    </div>
                    <span className="booking-selection-check" aria-hidden="true">
                      ✓
                    </span>
                  </>
                ) : (
                  <p>
                    <span aria-hidden="true">◷</span>
                    Select a showtime to prepare your seat selection.
                  </p>
                )}
              </div>

              <p className="booking-demo-note">
                Sample showtimes for the project demo; real cinema schedules are not connected.
              </p>
            </section>
          </div>
        </section>
      </main>
    </>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/movies/:movieId" element={<MovieDetailsPage />} />
      <Route path="/booking/:movieId" element={<BookingPage />} />
    </Routes>
  );
}

export default App;