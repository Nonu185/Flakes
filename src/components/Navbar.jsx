import React, { useState, useEffect } from 'react';
import api from '../api';
import { Home, Film, Tv, TrendingUp, Search, User, LogOut, Bell, Loader2, Globe } from 'lucide-react';

const Navbar = ({ activeMenu, setActiveMenu, onSearch, user, onOpenAuth, onLogout, onMovieSelect }) => {
  const [searchInput, setSearchInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (searchInput.trim().length > 0) {
        setIsSearching(true);
        try {
          const response = await api.get('/movies/search', { params: { q: searchInput } });
          if (response.data.Response === "True") {
            setSuggestions(response.data.Search.slice(0, 6));
            setShowSuggestions(true);
          } else {
            setSuggestions([]);
          }
        } catch (err) {
          console.warn("Suggestion fetch error:", err);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [searchInput]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearch(searchInput);
      setShowSuggestions(false);
    }
  };

  const handleSelectSuggestion = (movie) => {
    onMovieSelect(movie);
    setSearchInput('');
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const menuItems = [
    { name: 'Home', icon: <Home size={20} /> },
    { name: 'Movies', icon: <Film size={20} /> },
    { name: 'Series', icon: <Tv size={20} /> },
    { name: 'Indian', icon: <Globe size={20} /> },
    { name: 'Trends', icon: <TrendingUp size={20} /> },
  ];

  return (
    <nav className="navbar">
      <div className="logo-container">
        <h1 className="logo text-gradient" onClick={() => setActiveMenu('Home')}>flakes</h1>
      </div>

      <div className="search-section">
        <form onSubmit={handleSearchSubmit} style={{ position: 'relative', marginBottom: '32px' }}>
          <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
          <input 
            type="text" 
            placeholder="Search..." 
            className="modal-input" 
            style={{ paddingLeft: '40px', marginBottom: 0 }}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          />
          {isSearching && <Loader2 className="animate-spin" size={16} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)' }} />}
          
          {showSuggestions && suggestions.length > 0 && (
            <div className="search-suggestions glass animate-fade-in">
              {suggestions.map((movie) => (
                <div key={movie.imdbID} className="suggestion-item" onClick={() => handleSelectSuggestion(movie)}>
                  <img src={movie.Poster} alt={movie.Title} className="suggestion-img" />
                  <div className="suggestion-info">
                    <span className="suggestion-title">{movie.Title}</span>
                    <span className="suggestion-year">{movie.Year}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </form>
      </div>
      
      <ul className="menu-list">
        {menuItems.map(item => (
          <li 
            key={item.name}
            className={`menu-list-item ${activeMenu === item.name ? 'active' : ''}`}
            onClick={() => {
              setActiveMenu(item.name);
              setSearchInput('');
            }}
          >
            {item.icon}
            <span>{item.name}</span>
          </li>
        ))}
      </ul>

      <div className="sidebar-footer">
        <div className="profile-section">
          {user ? (
            <div className="user-profile">
               <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div className="glass profile-avatar" onClick={onLogout}>
                  <User size={20} />
                </div>
                <span className="user-name">{user.username}</span>
              </div>
            </div>
          ) : (
            <div className="auth-buttons">
              <button className="btn-primary" onClick={() => onOpenAuth('login')}>
                Login
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
