import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, MapPin, Landmark, ArrowRight, Layers, Tag } from 'lucide-react';
import { Header } from '../../components/common/Header';
import { Footer } from '../../components/common/Footer';
import { Artifact, Museum } from '../../types';
import { api } from '../../services/api';

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<Artifact[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const performSearch = async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    try {
      setLoading(true);
      setHasSearched(true);
      const res = await api.get(`/public/search?q=${encodeURIComponent(searchTerm.trim())}`);
      if (res.success && res.data) {
        setResults(res.data);
      }
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    }
  }, [initialQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams(query.trim() ? { q: query.trim() } : {});
    performSearch(query);
  };

  return (
    <div className="min-h-screen flex flex-col bg-museum-bg">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-8 w-full space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-museum-text">
            Search Museum Exhibits
          </h1>
          <p className="text-xs sm:text-sm text-museum-muted mt-1">
            Search across historical titles, creators, origins, materials, and display tags
          </p>
        </div>

        {/* Search input form */}
        <form onSubmit={handleSubmit} className="relative flex items-center shadow-card rounded-2xl bg-white border border-museum-border overflow-hidden p-1.5">
          <Search className="w-5 h-5 text-museum-muted ml-3 shrink-0" />
          <input
            type="text"
            placeholder="Search for exhibits (e.g. 'water clock', 'astrolabe', 'sculpture')..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full px-3 py-3 text-sm sm:text-base text-museum-text placeholder:text-museum-muted focus:outline-hidden"
          />
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-museum-primary text-white text-sm font-semibold hover:bg-museum-hover transition-colors"
          >
            Search
          </button>
        </form>

        {/* Results List */}
        <div className="pt-2">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-28 bg-slate-200 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : hasSearched && results.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-museum-border">
              <Search className="w-12 h-12 text-museum-muted mx-auto mb-3" />
              <h3 className="font-bold text-museum-text text-lg">No matching exhibits found</h3>
              <p className="text-xs text-museum-muted mt-1">
                Try searching for broader keywords like "clock", "bronze", "astronomy", or "manuscript".
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {results.map((artifact) => {
                const cover = artifact.images?.[0]?.url || 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=300&q=80';
                const museum = artifact.museumId as Museum | undefined;

                return (
                  <Link
                    key={artifact._id}
                    to={`/a/${artifact.shortCode}`}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-white border border-museum-border shadow-card hover:shadow-elevated transition-all group gap-4"
                  >
                    <div className="flex items-center space-x-4">
                      <img
                        src={cover}
                        alt={artifact.name}
                        className="w-20 h-20 rounded-xl object-cover shrink-0"
                      />
                      <div>
                        {artifact.datePeriod && (
                          <span className="text-xs font-semibold text-museum-primary uppercase tracking-wider block">
                            {artifact.datePeriod}
                          </span>
                        )}
                        <h3 className="font-serif font-bold text-base sm:text-lg text-museum-text group-hover:text-museum-primary transition-colors">
                          {artifact.name}
                        </h3>
                        <div className="flex items-center space-x-3 text-xs text-museum-muted mt-1">
                          {museum?.name && (
                            <span className="flex items-center space-x-1">
                              <Landmark className="w-3 h-3" />
                              <span>{museum.name}</span>
                            </span>
                          )}
                          {artifact.locationInsideMuseum && (
                            <span className="flex items-center space-x-1 text-museum-dark font-medium">
                              <MapPin className="w-3 h-3 text-museum-primary" />
                              <span>{artifact.locationInsideMuseum}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="self-end sm:self-center shrink-0">
                      <span className="inline-flex items-center space-x-1 text-xs font-bold text-museum-primary bg-museum-light px-3 py-1.5 rounded-xl group-hover:bg-museum-primary group-hover:text-white transition-all">
                        <span>Open Guide</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};
