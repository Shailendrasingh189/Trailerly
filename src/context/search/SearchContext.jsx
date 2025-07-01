import { SearchContext } from "./searchContext.js";
import { useDebounce } from "react-use";
import { updateSearchCount } from "../../appwrite.js";
import { useCallback, useEffect, useState, useMemo } from "react";

const SearchProvider = ({ children }) => {
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [selectedMovie, setSelectedMovie] = useState([]);

  const API_BASE_URL =
    import.meta.env.VITE_MOVIE_API_BASE_URL || "https://api.themoviedb.org/3";
  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

  const API_OPTIONS = useMemo(
    () => ({
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
    }),
    [API_KEY]
  );

  // Debounce the search term to prevent making to many API request by waiting for user to stop typing for 500ms
  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);

  const fetchMovies = useCallback(
    async (query = "") => {
      setIsLoading(true);
      setErrorMessage("");
      try {
        const endpoint = query
          ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
          : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

        const response = await fetch(endpoint, API_OPTIONS);

        if (!response.ok) {
          throw new Error(`Failed to fetch movies`);
        }

        const data = await response.json();

        if (data.Response === "False") {
          setErrorMessage(data.Error || "Failed to fetch movies");
          setMovieList([]);
          return;
        }

        setMovieList(data.results || []);

        if (query && data.results.length > 0) {
          updateSearchCount(query, data.results[0]);
        }
      } catch (error) {
        console.error(`Error fetching movies: ${error}`);
        setErrorMessage("Error fetching movies. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    },
    [API_BASE_URL, API_OPTIONS]
  );

  // Fetch movies trailers video by movie ID
  const fetchMovieTrailers = useCallback(
    async (movieId) => {
      if (!movieId) return;

      try {
        const endpoint = `${API_BASE_URL}/movie/${movieId}/videos?language=en-US`;
        const response = await fetch(endpoint, API_OPTIONS);

        if (!response.ok) {
          throw new Error(`Failed to fetch movie trailers`);
        }

        const data = await response.json();
        const trailers = data.results || [];

        if(!trailers || trailers.length === 0) {
          console.warn("No trailers found for this movie.");
          return null;
        }

        const lastTrailer = trailers[trailers.length - 1];
        const trailerUrl = `https://www.youtube.com/watch?v=${lastTrailer.key}`;

        return trailerUrl;
      } catch (error) {
        console.error(`Error fetching movie trailers: ${error}`);
      }
    },
    [API_BASE_URL, API_OPTIONS]
  );

  // Function to fetch movie details by ID
  const fetchMovieDetails = useCallback(
    async (movieId) => {
      if (!movieId) return;

      setIsLoading(true);
      setErrorMessage("");
      try {
        const endpoint = `${API_BASE_URL}/movie/${movieId}?`;

        const response = await fetch(endpoint, API_OPTIONS);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch movie details");
        }

        // Fetch movie trailers after fetching movie details
        const trailerUrl = await fetchMovieTrailers(movieId);

        const data = await response.json();
        return { data, trailerUrl };
        // return data;
      } catch (error) {
        console.error(`Error fetching movie details: ${error}`);
        setErrorMessage(
          error.message ||
            "Error fetching movie details. Please try again later."
        );
        setSelectedMovie(null);
      } finally {
        setIsLoading(false);
      }
    },
    [API_BASE_URL, API_OPTIONS, fetchMovieTrailers]
  );

  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm, fetchMovies]);

  const value = {
    searchTerm,
    setSearchTerm,
    movieList,
    isLoading,
    errorMessage,
    selectedMovie,
    setSelectedMovie,
    fetchMovieDetails,
  };
  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
};

export default SearchProvider;
