import { RefreshCw } from 'lucide-react';
import MovieCard from './MovieCard';

const MovieList = ({ title, movies, onMovieSelect, isGrid = false, showRefresh = false, onRefresh }) => {
  if (!movies || movies.length === 0) return null;

  return (
    <div className="movie-list-container animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h2 className="movie-list-title" style={{ marginBottom: 0 }}>{title}</h2>
        {showRefresh && (
          <button 
            className="btn-glass" 
            onClick={(e) => {
              e.preventDefault();
              onRefresh();
            }}
            style={{ padding: '8px', borderRadius: '50%' }}
            title="Refresh Movies"
          >
            <RefreshCw size={18} className={showRefresh ? "hover-spin" : ""} />
          </button>
        )}
      </div>
      <div className={isGrid ? "content-grid" : "movie-list-wrapper"}>
        {movies.map((movie, index) => (
           <MovieCard 
             key={movie.imdbID || index} 
             movie={movie} 
             onClick={onMovieSelect} 
           />
        ))}
      </div>
      {!isGrid && (
        <div style={{ 
          height: '1px', 
          background: 'var(--glass-border)', 
          marginTop: '48px', 
          width: '100%', 
          opacity: 0.5 
        }} />
      )}
    </div>
  );
};

export default MovieList;
