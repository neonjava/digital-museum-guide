import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Landmark, Lock, Mail, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.success && res.token && res.user) {
        login(res.token, res.user);
        navigate('/admin');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-museum-bg p-4">
      <div className="w-full max-w-md bg-white border border-museum-border rounded-3xl p-8 shadow-elevated space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-museum-primary text-white flex items-center justify-center mx-auto shadow-xs">
            <Landmark className="w-7 h-7 text-museum-light" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-museum-text">
            Museum Staff Portal
          </h1>
          <p className="text-xs text-museum-muted">
            Sign in to manage museum galleries, exhibits, audio guides, and QR codes
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-museum-text uppercase tracking-wider block">
              Staff Email
            </label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 text-museum-muted absolute left-3.5" />
              <input
                type="email"
                required
                placeholder="curator@gmu.edu.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-museum-border text-sm text-museum-text focus:outline-hidden focus:border-museum-primary"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-museum-text uppercase tracking-wider block">
              Password
            </label>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-museum-muted absolute left-3.5" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-museum-border text-sm text-museum-text focus:outline-hidden focus:border-museum-primary"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl bg-museum-primary text-white font-bold text-sm hover:bg-museum-hover shadow-md transition-all active:scale-95 disabled:opacity-50"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2">
          <Link
            to="/"
            className="text-xs text-museum-muted hover:text-museum-primary font-medium"
          >
            ← Return to Visitor Portal
          </Link>
        </div>
      </div>
    </div>
  );
};
