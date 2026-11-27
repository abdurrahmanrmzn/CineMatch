import { Link } from "react-router-dom";

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
      </nav>
    </header>
  );
}

export default SiteHeader;