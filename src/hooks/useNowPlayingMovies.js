import { useEffect, useState } from "react";

const genreNames = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Sci-Fi",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western",
};

export default function useNowPlayingMovies() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    let isActive = true;

    async function fetchMovies() {
      try {
        const response = await fetch(
          "https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1",
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
              accept: "application/json",
            },
            signal: controller.signal,
          }
        );

        if (!response.ok) {
          throw new Error(`TMDB request failed (${response.status})`);
        }

        const data = await response.json();

        if (isActive) {
          setMovies(
            data.results.map((movie) => ({
              id: movie.id,
              title: movie.title,
              rating: movie.vote_average.toFixed(1),
              genre: genreNames[movie.genre_ids[0]] || "Movie",
              posterPath: movie.poster_path,
            }))
          );
          setError("");
        }
      } catch (err) {
        if (isActive && err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    }

    fetchMovies();

    return () => {
      isActive = false;
      controller.abort();
    };
  }, []);

  return { movies, loading, error };
}