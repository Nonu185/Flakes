import React, { useState, useEffect } from 'react';
import api from './api';
import Navbar from './components/Navbar';
import FeaturedContent from './components/FeaturedContent';
import MovieList from './components/MovieList';
import AuthModal from './components/AuthModal';
import MovieDetailModal from './components/MovieDetailModal';
import './components.css'; 

function App() {
  const [activeMenu, setActiveMenu] = useState('Home');
  const [searchQuery, setSearchQuery] = useState('');
  const [theme, setTheme] = useState('dark');
  
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('flakesUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authView, setAuthView] = useState('login');

  const [movieDataList, setMovieDataList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleOpenAuth = (view) => {
    setAuthView(view);
    setIsAuthOpen(true);
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem('flakesUser', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('flakesUser');
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query) setActiveMenu('Search');
  };

  // Helper to fetch movies using the Vite proxy
  const fetchMovies = async (query, type = '', page = 1) => {
    try {
      const response = await api.get('/movies/search', {
        params: { q: query, type: type || undefined, page }
      });
      
      const data = response.data;
      if (data.Response === "True") {
        const seen = new Set();
        return data.Search.filter(movie => {
          if (seen.has(movie.imdbID)) return false;
          seen.add(movie.imdbID);
          return true;
        });
      }
      return [];
    } catch (err) {
      console.warn(`Fetch error for "${query}":`, err.message);
      return [];
    }
  };

  const [selectedMovie, setSelectedMovie] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      let fetchedLists = [];

      const fetchTrending = async () => {
        try {
          const response = await api.get('/movies/trending');
          const data = response.data;
          return data.Response === "True" ? data.Search : [];
        } catch (err) {
          console.warn("Trending fetch error:", err);
          return [];
        }
      };

      if (activeMenu === 'Home') {
        const homeKeywords = ["Blockbuster", "Action", "Horror", "Adventure", "Sci-Fi", "Comedy"];
        const randomHome = homeKeywords[Math.floor(Math.random() * homeKeywords.length)];
        const [trending, randomList] = await Promise.all([
          fetchTrending(),
          fetchMovies(randomHome)
        ]);
        fetchedLists = [
          { title: "Trending Now", movies: trending, showRefresh: true },
          { title: `${randomHome} Picks`, movies: randomList, isGrid: true }
        ];
      } else if (activeMenu === 'Trends') {
        const [trendingWeek, trendingDay] = await Promise.all([
          fetchTrending(),
          fetchMovies("Top", "movie") 
        ]);
        fetchedLists = [
          { title: "Weekly Trends", movies: trendingWeek, isGrid: true, showRefresh: true },
          { title: "Most Popular", movies: trendingDay, isGrid: true }
        ];
      } else if (activeMenu === 'Movies') {
        const movieKeywords = ["Action", "Comedy", "Thriller", "Horror", "Drama", "Romance", "Animation"];
        const randomM = movieKeywords[Math.floor(Math.random() * movieKeywords.length)];
        const movies = await fetchMovies(randomM, "movie");
        fetchedLists = [
          { title: `${randomM} Movies`, movies: movies, isGrid: true, showRefresh: true }
        ];
      } else if (activeMenu === 'Series') {
        const seriesKeywords = ["Drama", "Mystery", "Crime", "Thriller", "Sci-Fi", "Comedy"];
        const randomS = seriesKeywords[Math.floor(Math.random() * seriesKeywords.length)];
        const series = await fetchMovies(randomS, "series");
        fetchedLists = [
          { title: `${randomS} Shows`, movies: series, isGrid: true, showRefresh: true }
        ];
      } else if (activeMenu === 'Indian') {
        const keywords = ["Bollywood", "Hindi Movies", "Telugu", "Tamil", "Malayalam", "Kannada", "Punjabi", "Marathi", "Tollywood", "Kollywood"];
        const random1 = keywords[Math.floor(Math.random() * keywords.length)];
        const random2 = keywords[Math.floor(Math.random() * keywords.length)];
        
        // Fetch 2 pages to have a larger pool before filtering
        const [p1_l1, p2_l1, p1_l2, p2_l2] = await Promise.all([
          fetchMovies(random1, "", 1),
          fetchMovies(random1, "", 2),
          fetchMovies(random2, "", 1),
          fetchMovies(random2, "", 2)
        ]);

        const list1 = [...p1_l1, ...p2_l1];
        const list2 = [...p1_l2, ...p2_l2];

        // Filter for movies after 2015 and deduplicate
        const filterModern = (movies) => {
          const seen = new Set();
          return movies.filter(m => {
            const year = parseInt(m.Year);
            if (seen.has(m.imdbID)) return false;
            seen.add(m.imdbID);
            return !isNaN(year) && year >= 2015;
          });
        };

        fetchedLists = [
          { title: `${random1} (Modern Hits)`, movies: filterModern(list1), isGrid: true, showRefresh: true },
          { title: `${random2} (New Releases)`, movies: filterModern(list2), isGrid: true }
        ];
      }
 else if (activeMenu === 'Search') {
        if (searchQuery.trim()) {
          const results = await fetchMovies(searchQuery);
          fetchedLists = [
            { title: `Results for "${searchQuery}"`, movies: results, isGrid: true }
          ];
        }
      }
      
      setMovieDataList(fetchedLists);
      setIsLoading(false);
    };

    loadData();
  }, [activeMenu, searchQuery, refreshKey]);

  return (
    <div className="app-container">
      <Navbar 
        activeMenu={activeMenu} 
        setActiveMenu={setActiveMenu} 
        onSearch={handleSearch} 
        user={user}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
        onMovieSelect={setSelectedMovie}
      />
      
      <main className="main-content">
        <FeaturedContent 
          onMovieSelect={setSelectedMovie} 
          activeMenu={activeMenu} 
          refreshKey={refreshKey}
        />
        
        <div className="content-rows animate-fade-in">
          {isLoading ? (
            <div className="loader"></div>
          ) : (
            movieDataList.map((list, index) => (
                <MovieList 
                  key={index} 
                  title={list.title} 
                  movies={list.movies} 
                  onMovieSelect={setSelectedMovie} 
                  isGrid={list.isGrid}
                  showRefresh={list.showRefresh}
                  onRefresh={() => setRefreshKey(prev => prev + 1)}
                />
            ))
          )}
        </div>
      </main>

      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
        initialView={authView}
        onLoginSuccess={handleLoginSuccess}
      />
      
      {selectedMovie && (
        <MovieDetailModal 
          movie={selectedMovie} 
          onClose={() => setSelectedMovie(null)} 
        />
      )}
    </div>
  );
}

export default App;
