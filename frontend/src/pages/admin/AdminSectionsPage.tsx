import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Layers,
  Plus,
  Edit2,
  Trash2,
  Landmark,
  X,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { Section, Museum } from '../../types';
import { api } from '../../services/api';

export const AdminSectionsPage: React.FC = () => {
  const [museums, setMuseums] = useState<Museum[]>([]);
  const [selectedMuseumId, setSelectedMuseumId] = useState<string>('');
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<Section | null>(null);

  // Form fields
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [displayOrder, setDisplayOrder] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchMuseums = async () => {
      try {
        const res = await api.get('/museums');
        if (res.success && res.data) {
          setMuseums(res.data);
          if (res.data.length > 0) {
            setSelectedMuseumId(res.data[0]._id);
          }
        }
      } catch (err) {
        console.error('Error fetching museums:', err);
      }
    };
    fetchMuseums();
  }, []);

  const fetchSections = async (museumId: string) => {
    if (!museumId) return;
    try {
      setLoading(true);
      const res = await api.get(`/sections/museum/${museumId}`);
      if (res.success && res.data) {
        setSections(res.data);
      }
    } catch (err) {
      console.error('Error fetching sections:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedMuseumId) {
      fetchSections(selectedMuseumId);
    }
  }, [selectedMuseumId]);

  const openCreateModal = () => {
    setEditingSection(null);
    setName('');
    setDescription('');
    setCoverImage('');
    setDisplayOrder((sections.length || 0) + 1);
    setError(null);
    setModalOpen(true);
  };

  const openEditModal = (sec: Section) => {
    setEditingSection(sec);
    setName(sec.name);
    setDescription(sec.description);
    setCoverImage(sec.coverImage || '');
    setDisplayOrder(sec.displayOrder || 1);
    setError(null);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      const payload = {
        museumId: selectedMuseumId,
        name,
        description,
        coverImage,
        displayOrder,
      };

      if (editingSection) {
        await api.put(`/sections/${editingSection._id}`, payload);
      } else {
        await api.post('/sections', payload);
      }

      setModalOpen(false);
      fetchSections(selectedMuseumId);
    } catch (err: any) {
      setError(err.message || 'Failed to save gallery section');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, secName: string) => {
    if (window.confirm(`Delete section "${secName}"? All exhibits within this section will also be removed.`)) {
      try {
        await api.delete(`/sections/${id}`);
        fetchSections(selectedMuseumId);
      } catch (err: any) {
        alert(err.message || 'Failed to delete section');
      }
    }
  };

  return (
    <AdminLayout
      title="Galleries & Sections"
      subtitle="Organize museum exhibits into themed wings and galleries"
      actions={
        <button
          onClick={openCreateModal}
          disabled={!selectedMuseumId}
          className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-museum-primary text-white text-xs font-bold hover:bg-museum-hover shadow-xs active:scale-95 transition-all disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
          <span>New Gallery Section</span>
        </button>
      }
    >
      <div className="space-y-6">
        {/* Museum Selector Filter */}
        <div className="bg-white p-4 rounded-2xl border border-museum-border shadow-card flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <Landmark className="w-4 h-4 text-museum-primary" />
            <span className="text-xs font-bold text-museum-text uppercase tracking-wider">
              Selected Museum:
            </span>
          </div>

          <select
            value={selectedMuseumId}
            onChange={(e) => setSelectedMuseumId(e.target.value)}
            className="w-full sm:w-72 px-3 py-2 rounded-xl border border-museum-border bg-museum-bg text-xs font-semibold text-museum-text focus:outline-hidden focus:border-museum-primary"
          >
            {museums.map((m) => (
              <option key={m._id} value={m._id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>

        {/* Section Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <div key={i} className="h-56 rounded-3xl bg-slate-200 animate-pulse" />
            ))}
          </div>
        ) : sections.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-museum-border">
            <Layers className="w-12 h-12 text-museum-muted mx-auto mb-3" />
            <h3 className="font-bold text-museum-text">No galleries created yet</h3>
            <p className="text-xs text-museum-muted mt-1">
              Click "New Gallery Section" to create your first museum wing.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sections.map((section) => (
              <div
                key={section._id}
                className="rounded-3xl bg-white border border-museum-border shadow-card overflow-hidden flex flex-col justify-between"
              >
                <div className="relative h-36 bg-slate-800">
                  <img
                    src={
                      section.coverImage ||
                      'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80'
                    }
                    alt={section.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4 text-white flex items-center justify-between">
                    <div>
                      <h3 className="font-serif font-bold text-base sm:text-lg line-clamp-1">
                        {section.name}
                      </h3>
                      <span className="text-[11px] text-museum-light">
                        Order #{section.displayOrder}
                      </span>
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-xs font-semibold">
                      {section.artifactCount || 0} Artifacts
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <p className="text-xs sm:text-sm text-museum-muted line-clamp-2 leading-relaxed">
                    {section.description}
                  </p>

                  <div className="pt-3 border-t border-museum-border/60 flex items-center justify-between">
                    <Link
                      to={`/admin/artifacts?sectionId=${section._id}`}
                      className="text-xs font-semibold text-museum-primary hover:underline"
                    >
                      View Section Artifacts →
                    </Link>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => openEditModal(section)}
                        className="p-2 rounded-lg text-museum-muted hover:text-museum-primary hover:bg-museum-light transition-colors"
                        title="Edit Section"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(section._id, section.name)}
                        className="p-2 rounded-lg text-museum-muted hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Delete Section"
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

      {/* Create/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-museum-border animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-museum-border pb-3">
              <h3 className="font-serif font-bold text-base text-museum-text">
                {editingSection ? 'Edit Section' : 'Create Gallery Section'}
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
                <label className="font-bold text-museum-text block mb-1">Section Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ancient Technology & Engineering"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-museum-border focus:border-museum-primary focus:outline-hidden"
                />
              </div>

              <div>
                <label className="font-bold text-museum-text block mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Brief overview of artifacts displayed in this gallery..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-museum-border focus:border-museum-primary focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
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
                  <label className="font-bold text-museum-text block mb-1">Display Order</label>
                  <input
                    type="number"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(parseInt(e.target.value, 10) || 1)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-museum-border focus:border-museum-primary focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-museum-border font-semibold text-museum-muted hover:bg-museum-light"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-museum-primary text-white font-bold hover:bg-museum-hover shadow-xs active:scale-95 transition-all"
                >
                  {saving ? 'Saving...' : editingSection ? 'Update Section' : 'Create Section'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
