import React from 'react';
import { Star, Play, Plus } from 'lucide-react';

const MovieCard = ({ movie, onClick }) => {
  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onClick) onClick(movie);
  };

  const rating = movie.imdbRating && movie.imdbRating !== "N/A" ? movie.imdbRating : null;

  return (
    <div className="movie-list-item" onClick={handleClick}>
      <img 
        className="movie-list-item-img" 
        src={movie.Poster && movie.Poster !== "N/A" ? movie.Poster : 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=400'} 
        alt={movie.Title} 
        loading="lazy"
        draggable={false}
      />
      
      <div className="movie-list-item-info">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
                <div className="glass" style={{ width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Play size={14} fill="white" />
                </div>
                <div className="glass" style={{ width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Plus size={14} />
                </div>
            </div>
        </div>
        <h3 className="movie-list-item-title">{movie.Title}</h3>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
          {movie.Year} · {movie.Type}
        </p>
      </div>
    </div>
  );
};

export default MovieCard;
