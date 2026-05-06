import React, { useState } from 'react';
import { Home, Film, Tv, TrendingUp, Search, User, LogOut, Bell } from 'lucide-react';

const Navbar = ({ activeMenu, setActiveMenu, onSearch, user, onOpenAuth, onLogout }) => {
  const [searchInput, setSearchInput] = useState('');

  const menuItems = [
    { name: 'Home', icon: <Home size={20} /> },
    { name: 'Movies', icon: <Film size={20} /> },
    { name: 'Series', icon: <Tv size={20} /> },
    { name: 'Trends', icon: <TrendingUp size={20} /> },
  ];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearch(searchInput);
    }
  };

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
          />
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
