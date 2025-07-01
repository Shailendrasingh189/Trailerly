import Search from "../components/Search";
import Spinner from "../components/UIComponents/Spinner";
import MovieCard from "../components/MovieCard";
import { getTrendingMovies } from "../appwrite";
import { useEffect, useState } from "react";
import { useSearch } from "../context/search/searchContext.js";

const HomePage = () => {
  const { searchTerm, setSearchTerm, isLoading, errorMessage, movieList } =
    useSearch();
  const [trendingMovies, setTrendingMovies] = useState([]);

  useEffect(() => {
    loadTrendingMovies();
  }, []);

  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies();
      setTrendingMovies(movies);
    } catch (error) {
      console.error(`Error fetching trending movies: ${error}`);
    }
  };
  return (
    <main>
      <div className="pattern">
        <div className="wrapper">
          <header className="wrapper">
            <img src="./hero.png" alt="Hero Banner" />
            <h1 className="mx-auto text-center">
              Find <span className="text-gradient">Movies</span> You'll Enjoy
              Without the Hassle
            </h1>
            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          </header>

          {trendingMovies.length > 0 && (
            <section className="trending">
              <h2>Trending Movies</h2>

              <ul>
                {trendingMovies.map((movie, index) => (
                  <li key={movie.$id}>
                    <p>{index + 1}</p>
                    <a href={`/movie/${movie.movie_id}`}>
                      <img src={movie.poster_url} alt={movie.title} />
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="all-movies">
            <h2>All Movies</h2>

            {isLoading ? (
              <Spinner />
            ) : errorMessage ? (
              <p className="text-red-500">{errorMessage}</p>
            ) : (
              <ul className="">
                {movieList.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </main>
  );
};

export default HomePage;
