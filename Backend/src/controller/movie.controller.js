const axios = require("axios");

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

// Helper to transform TMDB data to the format the frontend expects (OMDb-like)
const transformMovie = (m) => {
  // Explicitly map languages and countries to strings
  const languages = (m.spoken_languages && m.spoken_languages.length > 0) 
    ? m.spoken_languages.map(l => l.english_name || l.name).filter(Boolean).join(", ") 
    : "N/A";
    
  const countries = (m.production_countries && m.production_countries.length > 0)
    ? m.production_countries.map(c => c.name).filter(Boolean).join(", ")
    : "N/A";
  
  return {
    imdbID: m.id.toString(),
    imdb_id: m.imdb_id || "", // Official IMDb ID (e.g. tt1234567)
    Title: m.title || m.name,
    Tagline: m.tagline || "",
    Year: (m.release_date || m.first_air_date || "").substring(0, 4),
    Poster: m.poster_path ? `${IMAGE_BASE_URL}${m.poster_path}` : "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=400",
    Backdrop: m.backdrop_path ? `https://image.tmdb.org/t/p/original${m.backdrop_path}` : null,
    Plot: m.overview || "No synopsis available.",
    imdbRating: m.vote_average ? m.vote_average.toFixed(1) : "N/A",
    Runtime: m.runtime ? `${m.runtime} min` : "N/A",
    Genre: (m.genres && m.genres.length > 0) ? m.genres.map(g => g.name).join(", ") : "N/A",
    Status: m.status || "N/A",
    Budget: (m.budget && m.budget > 0) ? `₹${(m.budget * 83).toLocaleString('en-IN')}` : "Not Disclosed",
    Revenue: (m.revenue && m.revenue > 0) ? `₹${(m.revenue * 83).toLocaleString('en-IN')}` : "Not Disclosed",
    Language: languages,
    Country: countries,
    Actors: "N/A",
    Director: "N/A",
    Rated: m.adult ? "R" : "PG-13",
    Response: "True"
  };
};

async function searchMovies(req, res) {
  try {
    const query = req.query.q;
    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const response = await axios.get(`${TMDB_BASE_URL}/search/movie`, {
      params: {
        api_key: process.env.TMDB_API_KEY,
        query: query,
        language: 'en-US',
        page: 1
      }
    });

    const transformed = {
      Search: response.data.results.map(transformMovie),
      totalResults: response.data.total_results.toString(),
      Response: "True"
    };

    res.json(transformed);
  } catch (error) {
    console.error("TMDB Search Error:", error.response?.data || error.message);
    res.status(500).json({ message: "Error fetching movies from TMDB" });
  }
}

async function getMovieById(req, res) {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/movie/${req.params.id}`, {
      params: {
        api_key: process.env.TMDB_API_KEY,
        language: 'en-US',
        append_to_response: 'credits,videos'
      }
    });

    const data = response.data;
    const transformed = transformMovie(data);
    
    // Extract credits
    if (data.credits) {
      transformed.Actors = data.credits.cast?.slice(0, 10).map(c => c.name).join(", ") || "N/A";
      const director = data.credits.crew?.find(c => c.job === 'Director');
      transformed.Director = director ? director.name : "N/A";
    }

    // Extract production companies
    if (data.production_companies) {
      transformed.Production = data.production_companies.map(pc => pc.name).join(", ");
    }

    // Extract Trailer
    let foundTrailer = false;
    if (data.videos && data.videos.results) {
      const trailer = data.videos.results.find(v => (v.type === 'Trailer' || v.type === 'Teaser' || v.type === 'Featurette') && v.site === 'YouTube');
      if (trailer) {
        transformed.Trailer = `https://www.youtube.com/watch?v=${trailer.key}`;
        transformed.TrailerEmbed = `https://www.youtube.com/embed/${trailer.key}`;
        foundTrailer = true;
      }
    }
    if (!foundTrailer) {
      transformed.TrailerEmbed = `https://vidsrc.to/embed/movie/${data.id}`;
    }

    res.json(transformed);
  } catch (error) {
    console.error("TMDB Detail Error:", error.response?.data || error.message);
    res.status(500).json({ message: "Error fetching movie details" });
  }
}

async function getTrendingMovies(req, res) {
    try {
        const response = await axios.get(`${TMDB_BASE_URL}/trending/movie/week`, {
            params: { api_key: process.env.TMDB_API_KEY }
        });
        res.json({
            Search: response.data.results.map(transformMovie),
            Response: "True"
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching trending movies" });
    }
}

module.exports = { searchMovies, getMovieById, getTrendingMovies };
