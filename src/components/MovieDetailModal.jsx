import React, { useState, useEffect } from 'react';
import api from '../api';
import { X, Star, Clock, Calendar, Film, Globe, Award, Play } from 'lucide-react';

const MovieDetailModal = ({ movie, onClose }) => {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPlayer, setShowPlayer] = useState(false);

  useEffect(() => {
    if (!movie) return;
    setShowPlayer(false); // Reset player on movie change
// ... (rest of useEffect logic remains same)

    const fetchDetails = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/movies/${movie.imdbID}`);
        const data = response.data;
        if (data && data.Response !== 'False') {
          setDetails(data);
        } else {
          // If fetch fails, at least show what we have from the list view
          setDetails(movie);
        }
      } catch (err) {
        console.warn("Detail fetch error:", err.message);
        setDetails(movie);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [movie]);

  if (!movie) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const poster = details?.Poster !== 'N/A' ? (details?.Poster || movie.Poster) : 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=400';

  return (
    <div className="detail-overlay" onClick={handleOverlayClick}>
      <div className={`detail-modal glass animate-fade-in ${showPlayer ? 'player-active' : ''}`}>
        <button className="detail-close" onClick={onClose}>
          <X size={22} />
        </button>

        {loading ? (
          <div className="detail-loading" style={{ width: '100%', height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="loader" />
          </div>
        ) : showPlayer && details?.TrailerEmbed ? (
          <div className="player-container animate-fade-in">
            <button className="btn-glass back-btn" onClick={() => setShowPlayer(false)}>
               Back to Details
            </button>
            <iframe 
              src={`${details.TrailerEmbed}?autoplay=1`}
              title="Movie Trailer"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="trailer-iframe"
            />
          </div>
        ) : (
          <div className="detail-content">
            <div className="detail-poster-wrap">
              <img src={poster} alt={details?.Title || movie.Title} className="detail-poster" />
              {details?.imdbRating && details.imdbRating !== 'N/A' && (
                <div className="detail-rating-badge">
                  <Star size={16} fill="var(--primary)" color="var(--primary)" />
                  <span>{details.imdbRating}</span>
                </div>
              )}
            </div>

            <div className="detail-info">
              <div style={{ marginBottom: '8px' }}>
                <h2 className="detail-title text-gradient">{details?.Title || movie.Title}</h2>
                {details?.Tagline && <p className="detail-tagline">"{details.Tagline}"</p>}
              </div>

              <div className="detail-meta">
                <span title="Release Year"><Calendar size={14} /> {details?.Year}</span>
                <span title="Duration"><Clock size={14} /> {details?.Runtime}</span>
                <span className="detail-meta-badge">{details?.Rated}</span>
                <span className="status-badge">{details?.Status}</span>
              </div>

              {details?.Genre && (
                <div className="detail-genres">
                  {details.Genre.split(',').map(g => (
                    <span key={g.trim()} className="detail-genre-tag">{g.trim()}</span>
                  ))}
                </div>
              )}

              <div className="detail-section">
                <h3 className="detail-section-title">Synopsis</h3>
                <p className="detail-plot">{details?.Plot}</p>
              </div>

              <div className="detail-grid">
                <div className="detail-section">
                  <h3 className="detail-section-title">Cast & Crew</h3>
                  <div className="detail-crew">
                    <div className="detail-crew-row">
                      <Film size={14} />
                      <span className="detail-crew-label">Director:</span>
                      <span>{details?.Director}</span>
                    </div>
                    <div className="detail-crew-row">
                      <Star size={14} />
                      <span className="detail-crew-label">Cast:</span>
                      <span className="cast-list">{details?.Actors}</span>
                    </div>
                  </div>
                </div>

                <div className="detail-section">
                  <h3 className="detail-section-title">Production</h3>
                  <div className="detail-crew">
                    <div className="detail-crew-row">
                      <Globe size={14} />
                      <span className="detail-crew-label">Origin:</span>
                      <span>{details?.Country}</span>
                    </div>
                    <div className="detail-crew-row">
                      <Award size={14} />
                      <span className="detail-crew-label">Language:</span>
                      <span>{details?.Language}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="detail-section financials">
                 <div className="financial-item">
                    <span className="financial-label">Budget</span>
                    <span className="financial-value">{details?.Budget}</span>
                 </div>
                 <div className="financial-item">
                    <span className="financial-label">Revenue</span>
                    <span className="financial-value">{details?.Revenue}</span>
                 </div>
              </div>

              <div style={{ marginTop: 'auto', paddingTop: '24px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <button 
                  className="btn-primary" 
                  onClick={() => {
                    if (details?.TrailerEmbed) {
                      setShowPlayer(true);
                    } else if (details?.imdb_id && details.imdb_id.startsWith('tt')) {
                      window.open(`https://www.imdb.com/title/${details.imdb_id}`, '_blank');
                    } else {
                      alert("Trailer and IMDb details not available for this title.");
                    }
                  }}
                  style={{ minWidth: '160px', justifyContent: 'center' }}
                >
                   <Play size={18} fill="white" /> {details?.TrailerEmbed ? 'Watch Now' : 'IMDb Page'}
                </button>
                {details?.TrailerEmbed && (
                  <button className="btn-glass" onClick={() => setShowPlayer(true)}>
                    <Play size={18} /> Trailer
                  </button>
                )}
                {details?.imdb_id && details.imdb_id.startsWith('tt') && (
                  <button className="btn-glass" onClick={() => window.open(`https://www.imdb.com/title/${details.imdb_id}`, '_blank')}>
                    IMDb
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetailModal;
