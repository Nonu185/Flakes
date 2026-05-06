import React from 'react';
import MovieCard from './MovieCard';

const MovieList = ({ title, movies, onMovieSelect, isGrid = false }) => {
  if (!movies || movies.length === 0) return null;

  return (
    <div className="movie-list-container animate-fade-in">
      <h2 className="movie-list-title">{title}</h2>
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
