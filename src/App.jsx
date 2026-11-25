import "./App.css";
import heroImage from "./assets/hero.png";

const movies = [
  {
    id: 1,
    title: "Beyond the Stars",
    genre: "Sci-Fi",
    rating: "8.4",
    artwork: "🌌",
    theme: "space",
  },
  {
    id: 2,
    title: "The Last Kingdom",
    genre: "Fantasy",
    rating: "8.1",
    artwork: "🏰",
    theme: "fantasy",
  },
  {
    id: 3,
    title: "Redline",
    genre: "Action",
    rating: "7.9",
    artwork: "🏎️",
    theme: "action",
  },
  {
    id: 4,
    title: "Wild Earth",
    genre: "Adventure",
    rating: "8.6",
    artwork: "🌿",
    theme: "nature",
  },
  {
    id: 5,
    title: "Midnight",
    genre: "Mystery",
    rating: "7.8",
    artwork: "🌙",
    theme: "mystery",
  },
];

function MovieCard({ movie }) {
  return (
    <article className="movie-card">
      <div className={`movie-poster poster-${movie.theme}`}>
        <span className="poster-artwork" aria-hidden="true">
          {movie.artwork}
        </span>

        <span className="movie-rating">
          ★ {movie.rating}
        </span>
      </div>

      <div className="movie-card-info">
        <h3>{movie.title}</h3>
        <p>{movie.genre}</p>
      </div>
    </article>
  );
}

function App() {
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
          <a className="active" href="/">Home</a>
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
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </section>
    </main>
  );
}

export default App;