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
  const fetchMovies = async (query, type = '') => {
    try {
      const response = await api.get('/movies/search', {
        params: { q: query, type: type || undefined }
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
        const [trending, action, horror] = await Promise.all([
          fetchTrending(),
          fetchMovies("Action"),
          fetchMovies("Conjuring")
        ]);
        fetchedLists = [
          { title: "Trending Now", movies: trending },
          { title: "Action Hits", movies: action },
          { title: "Horror Nights", movies: horror }
        ];
      } else if (activeMenu === 'Trends') {
        const [trendingWeek, trendingDay] = await Promise.all([
          fetchTrending(),
          fetchMovies("Top", "movie") 
        ]);
        fetchedLists = [
          { title: "Weekly Trends", movies: trendingWeek, isGrid: true },
          { title: "Most Popular", movies: trendingDay, isGrid: true }
        ];
      } else if (activeMenu === 'Movies') {
        const [scifi, comedy] = await Promise.all([
          fetchMovies("Space", "movie"),
          fetchMovies("Funny", "movie")
        ]);
        fetchedLists = [
          { title: "Sci-Fi Universe", movies: scifi, isGrid: true },
          { title: "Comedy Central", movies: comedy, isGrid: true }
        ];
      } else if (activeMenu === 'Series') {
        const [drama, mystery] = await Promise.all([
          fetchMovies("Drama", "series"),
          fetchMovies("Mystery", "series")
        ]);
        fetchedLists = [
          { title: "Drama Series", movies: drama, isGrid: true },
          { title: "Mystery & Thriller", movies: mystery, isGrid: true }
        ];
      } else if (activeMenu === 'Search') {
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
  }, [activeMenu, searchQuery]);

  return (
    <div className="app-container">
      <Navbar 
        activeMenu={activeMenu} 
        setActiveMenu={setActiveMenu} 
        onSearch={handleSearch} 
        user={user}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
      />
      
      <main className="main-content">
        <FeaturedContent 
          onMovieSelect={setSelectedMovie} 
          activeMenu={activeMenu} 
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
