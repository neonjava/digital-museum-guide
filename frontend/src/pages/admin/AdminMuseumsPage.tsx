import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Landmark,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  MapPin,
  Clock,
  Globe,
  X,
  Check,
  AlertCircle,
} from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { Museum } from '../../types';
import { api } from '../../services/api';

export const AdminMuseumsPage: React.FC = () => {
  const [museums, setMuseums] = useState<Museum[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMuseum, setEditingMuseum] = useState<Museum | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [logo, setLogo] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [openingHours, setOpeningHours] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchMuseums = async () => {
    try {
      setLoading(true);
      const res = await api.get('/museums');
      if (res.success && res.data) {
        setMuseums(res.data);
      }
    } catch (err) {
      console.error('Error fetching museums:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMuseums();
  }, []);

  const openCreateModal = () => {
    setEditingMuseum(null);
    setName('');
    setSlug('');
    setDescription('');
    setCoverImage('');
    setLogo('');
    setCity('');
    setState('');
    setOpeningHours('Tuesday - Sunday: 9:30 AM - 5:30 PM');
    setEmail('');
    setWebsite('');
    setError(null);
    setModalOpen(true);
  };

  const openEditModal = (museum: Museum) => {
    setEditingMuseum(museum);
    setName(museum.name);
    setSlug(museum.slug);
    setDescription(museum.description);
    setCoverImage(museum.coverImage || '');
    setLogo(museum.logo || '');
    setCity(museum.address?.city || '');
    setState(museum.address?.state || '');
    setOpeningHours(museum.openingHours || '');
    setEmail(museum.contact?.email || '');
    setWebsite(museum.website || '');
    setError(null);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      const payload = {
        name,
        slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description,
        coverImage,
        logo,
        address: { city, state, country: 'India' },
        contact: { email },
        openingHours,
        website,
      };

      if (editingMuseum) {
        await api.put(`/museums/${editingMuseum._id}`, payload);
      } else {
        await api.post('/museums', payload);
      }

      setModalOpen(false);
      fetchMuseums();
    } catch (err: any) {
      setError(err.message || 'Failed to save museum');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, museumName: string) => {
    if (window.confirm(`Are you sure you want to delete "${museumName}"? This will remove all associated galleries and exhibits.`)) {
      try {
        await api.delete(`/museums/${id}`);
        fetchMuseums();
      } catch (err: any) {
        alert(err.message || 'Failed to delete museum');
      }
    }
  };

  return (
    <AdminLayout
      title="Museum Management"
      subtitle="Create and configure digital museums on the platform"
      actions={
        <button
          onClick={openCreateModal}
          className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-museum-primary text-white text-xs font-bold hover:bg-museum-hover shadow-xs active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Museum</span>
        </button>
      }
    >
      <div className="space-y-6">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <div key={i} className="h-64 rounded-3xl bg-slate-200 animate-pulse" />
            ))}
          </div>
        ) : museums.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-museum-border">
            <Landmark className="w-12 h-12 text-museum-muted mx-auto mb-3" />
            <h3 className="font-bold text-museum-text">No museums found</h3>
            <p className="text-xs text-museum-muted mt-1">
              Click the "Add Museum" button to register your first digital museum.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {museums.map((museum) => (
              <div
                key={museum._id}
                className="rounded-3xl bg-white border border-museum-border shadow-card overflow-hidden flex flex-col justify-between"
              >
                <div className="relative h-44 bg-slate-800">
                  <img
                    src={
                      museum.coverImage ||
                      'https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?auto=format&fit=crop&w=800&q=80'
                    }
                    alt={museum.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <h3 className="font-serif font-bold text-lg line-clamp-1">{museum.name}</h3>
                    <span className="text-xs text-white/80 font-mono">Slug: /{museum.slug}</span>
                  </div>
                </div>

                <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                  <p className="text-xs sm:text-sm text-museum-muted line-clamp-3 leading-relaxed">
                    {museum.description}
                  </p>

                  <div className="pt-3 border-t border-museum-border/60 flex items-center justify-between">
                    <Link
                      to={`/museum/${museum.slug || museum._id}`}
                      target="_blank"
                      className="text-xs font-semibold text-museum-primary hover:underline flex items-center space-x-1"
                    >
                      <span>Public Visitor Page</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => openEditModal(museum)}
                        className="p-2 rounded-lg text-museum-muted hover:text-museum-primary hover:bg-museum-light transition-colors"
                        title="Edit Museum"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(museum._id, museum.name)}
                        className="p-2 rounded-lg text-museum-muted hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Delete Museum"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Museum Create/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-museum-border my-8 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-museum-border pb-3">
              <h3 className="font-serif font-bold text-lg text-museum-text">
                {editingMuseum ? 'Edit Museum Profile' : 'Create New Museum'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-museum-muted hover:text-museum-text"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs border border-red-200 flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="font-bold text-museum-text block mb-1">Museum Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. GM University Heritage Museum"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-museum-border focus:border-museum-primary focus:outline-hidden"
                />
              </div>

              <div>
                <label className="font-bold text-museum-text block mb-1">Slug Identifier</label>
                <input
                  type="text"
                  placeholder="e.g. gmu-heritage-museum"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-museum-border focus:border-museum-primary focus:outline-hidden font-mono text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-museum-text block mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Brief description of the museum's mission and collections..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-museum-border focus:border-museum-primary focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-museum-text block mb-1">City</label>
                  <input
                    type="text"
                    placeholder="Davangere"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-museum-border focus:border-museum-primary focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="font-bold text-museum-text block mb-1">State</label>
                  <input
                    type="text"
                    placeholder="Karnataka"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-museum-border focus:border-museum-primary focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-museum-text block mb-1">Cover Image URL</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-museum-border focus:border-museum-primary focus:outline-hidden"
                />
              </div>

              <div>
                <label className="font-bold text-museum-text block mb-1">Opening Hours</label>
                <input
                  type="text"
                  placeholder="Tuesday - Sunday: 9:30 AM - 5:30 PM"
                  value={openingHours}
                  onChange={(e) => setOpeningHours(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-museum-border focus:border-museum-primary focus:outline-hidden"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-museum-border font-semibold text-museum-muted hover:bg-museum-light transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl bg-museum-primary text-white font-bold hover:bg-museum-hover shadow-xs active:scale-95 transition-all"
                >
                  {saving ? 'Saving...' : editingMuseum ? 'Update Museum' : 'Create Museum'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
