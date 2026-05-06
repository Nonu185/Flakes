import React, { useState, useEffect } from 'react';
import { Play, Info, Star } from 'lucide-react';

const FeaturedContent = ({ onMovieSelect, activeMenu }) => {
  const [featured, setFeatured] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeatured = async () => {
      setLoading(true);
      try {
        let endpoint = '/api/movies/trending';
        
        // Change endpoint based on active menu
        if (activeMenu === 'Movies') {
          endpoint = '/api/movies/search?q=Top'; // Or a specific movies category
        } else if (activeMenu === 'Series') {
          endpoint = '/api/movies/search?q=The&type=series';
        }
        
        const response = await fetch(endpoint);
        if (!response.ok) throw new Error("API Error");
        const data = await response.json();
        
        if (data && data.Search && data.Search.length > 0) {
          // Pick a random movie from the results
          const pool = data.Search.slice(0, 10);
          const randomIndex = Math.floor(Math.random() * pool.length);
          setFeatured(pool[randomIndex]);
        } else {
          throw new Error("No data");
        }
      } catch (err) {
        console.warn("Featured fetch error, using fallback:", err.message);
        const { mockMovies } = await import('../data.js');
        setFeatured(mockMovies[0]);
      } finally {
        setLoading(false);
      }
    };
    loadFeatured();
  }, [activeMenu]);

  if (loading || !featured) {
    return (
      <div className="featured-content" style={{ background: 'var(--bg-darker)' }}>
        <div className="loader"></div>
      </div>
    );
  }

  const bgImage = featured.Poster !== 'N/A' ? featured.Poster : 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=1200';

  return (
    <div className="featured-content animate-fade-in" style={{ 
      backgroundImage: `url(${bgImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center 20%'
    }}>
      <div className="featured-info">
        <div className="featured-meta">
            <span style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Star size={14} fill="var(--primary)" /> {featured.imdbRating}
            </span>
            <span>{featured.Year}</span>
            <span>{featured.Runtime}</span>
            <span className="glass" style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '12px' }}>{featured.Rated}</span>
        </div>
        
        <h1 className="featured-movie-title">{featured.Title}</h1>
        
        <p className="featured-desc">
          {featured.Plot !== 'N/A' ? featured.Plot : "Experience this cinematic masterpiece only on Flakes. Explore the depth of storytelling and visual excellence."}
        </p>

        <div style={{ display: 'flex', gap: '16px' }}>
            <button className="btn-primary" onClick={() => onMovieSelect(featured)}>
                <Play size={20} fill="white" /> Watch Now
            </button>
            <button className="btn-glass" onClick={() => onMovieSelect(featured)}>
                <Info size={20} /> More Info
            </button>
        </div>
      </div>
    </div>
  );
};

export default FeaturedContent;
