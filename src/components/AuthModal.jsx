import React, { useState } from 'react';
import api from '../api';
import { X, Mail, Lock, User } from 'lucide-react';

const AuthModal = ({ isOpen, onClose, initialView, onLoginSuccess }) => {
  const [isLoginView, setIsLoginView] = useState(initialView === 'login');
  const [formData, setFormData] = useState({ username: '', email: '', password: '', identifier: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setIsLoginView(initialView === 'login');
      setError('');
      setFormData({ username: '', email: '', password: '', identifier: '' });
    }
  }, [isOpen, initialView]);

  if (!isOpen) return null;

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const url = isLoginView ? '/api/auth/login' : '/api/auth/register';

    const payload = isLoginView 
      ? { username: formData.identifier, email: formData.identifier, password: formData.password }
      : { username: formData.username, email: formData.email, password: formData.password };

    try {
      const response = await api.post(url, payload);
      const userObj = {
        username: response.data.user?.username || payload.username || payload.email?.split('@')[0] || 'User',
        token: response.data.accessToken || ''
      };
      onLoginSuccess(userObj);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="auth-modal animate-fade-in" onClick={e => e.stopPropagation()}>
        <button className="detail-close" onClick={onClose}><X size={20} /></button>
        <h2 className="detail-title" style={{ fontSize: '32px', textAlign: 'center', marginBottom: '8px' }}>
            {isLoginView ? 'Welcome Back' : 'Join Flakes'}
        </h2>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '32px' }}>
            {isLoginView ? 'Sign in to continue your cinematic journey' : 'Start exploring thousands of movies today'}
        </p>
        
        {error && (
            <div className="glass" style={{ padding: '12px', borderRadius: '12px', border: '1px solid var(--accent)', color: 'var(--accent)', fontSize: '13px', marginBottom: '24px', textAlign: 'center' }}>
                {error}
            </div>
        )}
        
        <form onSubmit={handleSubmit} className="modal-form">
          {isLoginView ? (
            <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="text" name="identifier" placeholder="Email or Username" 
                  value={formData.identifier} onChange={handleChange} required
                  className="modal-input" style={{ paddingLeft: '48px' }}
                />
            </div>
          ) : (
            <>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="text" name="username" placeholder="Username" 
                  value={formData.username} onChange={handleChange} required
                  className="modal-input" style={{ paddingLeft: '48px' }}
                />
              </div>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="email" name="email" placeholder="Email" 
                  value={formData.email} onChange={handleChange} required
                  className="modal-input" style={{ paddingLeft: '48px' }}
                />
              </div>
            </>
          )}
          <div style={{ position: 'relative' }}>
            <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
                type="password" name="password" placeholder="Password" 
                value={formData.password} onChange={handleChange} required 
                className="modal-input" style={{ paddingLeft: '48px' }}
            />
          </div>
          <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '16px' }} disabled={loading}>
            {loading ? 'Processing...' : (isLoginView ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <p style={{ marginTop: '32px', textAlign: 'center', fontSize: '14px', color: 'var(--text-muted)' }}>
          {isLoginView ? "New to Flakes? " : "Already have an account? "}
          <span style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: 600 }} onClick={() => setIsLoginView(!isLoginView)}>
            {isLoginView ? 'Create an account' : 'Sign In'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default AuthModal;
