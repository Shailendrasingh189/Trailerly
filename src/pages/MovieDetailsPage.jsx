import { useParams } from "react-router-dom";
import { useSearch } from "../context/search/searchContext";
import { useEffect, useState } from "react";
import Spinner from "../components/UIComponents/Spinner";

const MovieDetailsPage = () => {
  const { movieId } = useParams();
  const [trailerUrl, setTrailerUrl] = useState("");
  const [movieDetails, setMovieDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const { fetchMovieDetails } = useSearch();
  const {
    title,
    status,
    poster_path,
    backdrop_path,
    genres,
    overview,
    release_date,
    production_countries,
    spoken_languages,
    budget,
    adult,
    revenue,
    tagline,
    homepage,
    runtime,
    production_companies,
    vote_average,
  } = movieDetails || {};
  console.log("Movie Details:", movieDetails);

  useEffect(() => {
    const loadMovieDetails = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const movieDetails = await fetchMovieDetails(movieId);
        const details = movieDetails?.data || {};
        setTrailerUrl(movieDetails?.trailerUrl || "");
        setMovieDetails(details);
      } catch (err) {
        console.error("Failed to fetch movie details:", err);
        setError(err.message || "Failed to load movie details");
      } finally {
        setIsLoading(false);
      }
    };

    if (movieId) {
      loadMovieDetails();
    }
  }, [movieId, fetchMovieDetails]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0D0B18]">
        <Spinner/>
        <div className="text-white mt-4">Loading movie details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0D0B18]">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!movieDetails) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0D0B18]">
        <div className="text-white">No movie details found</div>
      </div>
    );
  }

  // Currency short formatting function
  const formatNumberCompact = (amount) => {
    if (amount >= 1_000_000_000) {
      return (
        "$" +
        (amount / 1_000_000_000).toFixed(1).replace(/\.0$/, "") +
        " Billion"
      );
    } else if (amount >= 1_000_000) {
      return (
        "$" + (amount / 1_000_000).toFixed(1).replace(/\.0$/, "") + " Million"
      );
    } else if (amount >= 1_000) {
      return "$" + (amount / 1_000).toFixed(1).replace(/\.0$/, "") + "k";
    } else {
      return amount.toString();
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    if (amount === 0 || !amount) return "$0";
    const formatAmount = formatNumberCompact(amount);
    return (
      formatAmount ||
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(amount)
    );
  };

  // Format runtime from minutes to hours and minutes
  const formatRuntime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}Hr ${mins}min`;
  };

  // Format date to a more readable format
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const formatList = (items, key = "name") => {
    if (!items?.length) return "N/A";
    return items.map((item) => item[key]).join(" • ");
  };

  return (
    <div
      className="bg-[#0D0B18] text-white min-h-screen p-4 md:p-8 lg:p-12 mx-auto md:m-10 space-y-6 rounded-md"
      style={{
        boxShadow:
          "0px 12px 32px 0px #CECEFB05 inset, 0px 0px 100px 0px #AB8BFF4D",
      }}
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between w-full gap-4 lg:gap-0 px-6 md:px-0 pb-2 lg:pb-8 ">
        <div className="flex flex-col gap-2 lg:gap-3 md:pl-0">
          <h1 className="text-3xl sm:text-4xl font-bold leading-10 tracking-tight">
            {title || "Movie Title"}
          </h1>
          <div className="flex items-center gap-2 text-sm md:text-base text-gray-300/50">
            <p>{release_date?.substring(0, 4) || "N/A"}</p>
            <span>•</span>
            <p>{adult ? "R" : "PG-13"}</p>
            <span>•</span>
            <p>{formatRuntime(runtime)}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <div className="flex items-center px-3 py-2 rounded-md bg-white/10 backdrop-blur-sm">
            <img src="/star.svg" alt="rating star" className="w-4 h-4" />
            <span className="text-sm md:text-base font-medium pl-2">
              {vote_average?.toFixed(1) || 0}/10
            </span>
          </div>
          <div className="flex items-center px-3 py-2 rounded-md bg-white/10 backdrop-blur-sm">
            <img src="/trending.svg" alt="rating star" />
            <span className="text-md font-light px-2">
              {Math.round(movieDetails.popularity) || "N/A"}
            </span>
          </div>
        </div>
      </div>

      {/* Poster and Frame */}
      <div className="flex flex-col md:flex-row items-stretch w-full gap-6 px-4 py-1">
        <div className="w-full md:w-1/4">
          <div className="relative aspect-[2/3] rounded-xl overflow-hidden shadow-lg">
            <img
              src={
                poster_path
                  ? `https://image.tmdb.org/t/p/w500/${poster_path}`
                  : "/no-movie.png"
              }
              alt="Poster"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="w-full md:w-3/4 relative aspect-video md:aspect-[16/7] rounded-xl overflow-hidden shadow-lg">
          <img
            src={
              poster_path
                ? `https://image.tmdb.org/t/p/w500/${backdrop_path}`
                : "/no-movie.png"
            }
            alt="Cover"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          <button className="absolute bottom-4 left-6 flex items-center gap-2 bg-white/50 text-black text-sm font-semibold py-2 px-4 rounded-full shadow-lg hover:bg-gray-100 hover:scale-105 transition-all duration-200 group">
            <a
              className={`flex gap-2 ${!trailerUrl ? "cursor-not-allowed" : ""}`}
              href={trailerUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path
                  fillRule="evenodd"
                  d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                  clipRule="evenodd"
                />
              </svg>
              Trailer
            </a>
          </button>
        </div>
      </div>

      {/* Details */}
      <div className="flex flex-col md:flex-row  gap-6 md:gap-8">
        <div className="flex-1 space-y-4">
          <Detail label="Genres" value={<BadgeList items={genres} />} />
          <Detail
            label="Overview"
            value={overview || "No overview available."}
          />
          <Detail label="Release date" value={formatDate(release_date)} />
          <Detail
            label="Countries"
            value={formatList(production_countries, "name") || "N/A"}
          />
          <Detail label="Status" value={status} />
          <Detail
            label="Language"
            value={formatList(spoken_languages, "english_name") || "N/A"}
          />
          <Detail label="Budget" value={formatCurrency(budget)} />
          <Detail label="Revenue" value={formatCurrency(revenue)} />
          <Detail label="Tagline" value={tagline} />
          <Detail
            label="Production Companies"
            value={formatList(production_companies, "name") || "N/A"}
          />
        </div>
        <div className="md:w-48 flex justify-start md:justify-end">
          <a
            href={homepage}
            target="_blank"
            rel="noopener noreferrer"
            className="custom-button"
          >
            Visit Official Site
          </a>
        </div>
      </div>
    </div>
  );
};

const BadgeList = ({ items = [] }) => (
  <div className="flex items-start flex-wrap gap-2">
    {items.map((genre) => (
      <span
        key={genre.id}
        className="inline-block bg-[#1F1B2E] text-white px-4 py-1.5 rounded-md text-xs md:text-sm font-medium"
      >
        {genre.name}
      </span>
    ))}
  </div>
);

const Detail = ({ label, value }) => (
  <div className="flex flex-row gap-4 sm:gap-4">
    <div className="w-16 sm:w-36 sm:flex-shrink-0 text-[#a8b5db] font-medium text-sm sm:text-base">
      {label}
    </div>
    <div className="text-[#D6C7FF] text-sm sm:text-base">{value}</div>
  </div>
);

export default MovieDetailsPage;
