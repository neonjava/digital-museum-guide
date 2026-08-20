import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Sparkles,
  Plus,
  Search,
  QrCode,
  Edit2,
  Trash2,
  Eye,
  ExternalLink,
  Filter,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { QRPrintCardModal } from '../../components/admin/QRPrintCardModal';
import { Artifact, Museum, Section } from '../../types';
import { api } from '../../services/api';

export const AdminArtifactsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [museums, setMuseums] = useState<Museum[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedMuseum, setSelectedMuseum] = useState(searchParams.get('museumId') || '');
  const [selectedSection, setSelectedSection] = useState(searchParams.get('sectionId') || '');
  const [selectedStatus, setSelectedStatus] = useState('');

  // Active QR Card modal
  const [qrModalArtifact, setQrModalArtifact] = useState<Artifact | null>(null);

  const fetchFilters = async () => {
    try {
      const [mRes, sRes] = await Promise.all([
        api.get('/museums'),
        api.get('/sections/museum/' + (selectedMuseum || 'all')).catch(() => ({ data: [] })),
      ]);
      if (mRes.success && mRes.data) setMuseums(mRes.data);
      if (sRes.success && sRes.data) setSections(sRes.data);
    } catch (err) {
      console.error('Error fetching filter options:', err);
    }
  };

  const fetchArtifacts = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (search) queryParams.set('search', search);
      if (selectedMuseum) queryParams.set('museumId', selectedMuseum);
      if (selectedSection) queryParams.set('sectionId', selectedSection);
      if (selectedStatus) queryParams.set('status', selectedStatus);

      const res = await api.get(`/artifacts?${queryParams.toString()}`);
      if (res.success && res.data) {
        setArtifacts(res.data);
      }
    } catch (err) {
      console.error('Error fetching artifacts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilters();
  }, [selectedMuseum]);

  useEffect(() => {
    fetchArtifacts();
  }, [search, selectedMuseum, selectedSection, selectedStatus]);

  const handleStatusChange = async (artifactId: string, newStatus: string) => {
    try {
      await api.patch(`/artifacts/${artifactId}/status`, { status: newStatus });
      fetchArtifacts();
    } catch (err: any) {
      alert(err.message || 'Failed to update artifact status');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete exhibit "${name}"? Its associated QR code will also be removed.`)) {
      try {
        await api.delete(`/artifacts/${id}`);
        fetchArtifacts();
      } catch (err: any) {
        alert(err.message || 'Failed to delete artifact');
      }
    }
  };

  return (
    <AdminLayout
      title="Artifacts Management"
      subtitle="Curate and publish physical artifact stories and digital QR guides"
      actions={
        <Link
          to="/admin/artifacts/new"
          className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-museum-primary text-white text-xs font-bold hover:bg-museum-hover shadow-xs active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Artifact</span>
        </Link>
      }
    >
      <div className="space-y-6">
        {/* Filters Bar */}
        <div className="bg-white p-4 rounded-2xl border border-museum-border shadow-card grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-museum-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, tag, ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-museum-border text-xs text-museum-text focus:outline-hidden focus:border-museum-primary"
            />
          </div>

          {/* Museum Filter */}
          <select
            value={selectedMuseum}
            onChange={(e) => {
              setSelectedMuseum(e.target.value);
              setSelectedSection('');
            }}
            className="px-3 py-2 rounded-xl border border-museum-border bg-museum-bg text-xs font-medium text-museum-text focus:outline-hidden"
          >
            <option value="">All Museums</option>
            {museums.map((m) => (
              <option key={m._id} value={m._id}>
                {m.name}
              </option>
            ))}
          </select>

          {/* Section Filter */}
          <select
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            className="px-3 py-2 rounded-xl border border-museum-border bg-museum-bg text-xs font-medium text-museum-text focus:outline-hidden"
          >
            <option value="">All Galleries & Sections</option>
            {sections.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 rounded-xl border border-museum-border bg-museum-bg text-xs font-medium text-museum-text focus:outline-hidden"
          >
            <option value="">All Statuses</option>
            <option value="PUBLISHED">Published</option>
            <option value="DRAFT">Draft</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>

        {/* Table of Artifacts */}
        <div className="bg-white rounded-3xl border border-museum-border shadow-card overflow-hidden">
          {loading ? (
            <div className="p-8 space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-14 bg-slate-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : artifacts.length === 0 ? (
            <div className="p-12 text-center">
              <Sparkles className="w-12 h-12 text-museum-muted mx-auto mb-3" />
              <h3 className="font-bold text-museum-text">No artifacts found</h3>
              <p className="text-xs text-museum-muted mt-1">
                Try adjusting your filters or click "New Artifact" to add one.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-museum-bg/60 border-b border-museum-border text-museum-muted uppercase text-[11px] font-bold">
                  <tr>
                    <th className="py-3 px-4">Artifact</th>
                    <th className="py-3 px-4">Museum & Gallery</th>
                    <th className="py-3 px-4">QR Code</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-center">Views / Scans</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-museum-border/40">
                  {artifacts.map((art) => {
                    const museum = art.museumId as Museum | undefined;
                    const section = art.sectionId as Section | undefined;

                    return (
                      <tr key={art._id} className="hover:bg-museum-light/30 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center space-x-3">
                            <img
                              src={art.images?.[0]?.url || 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=100&q=80'}
                              alt={art.name}
                              className="w-12 h-12 rounded-xl object-cover shrink-0 border border-museum-border/60"
                            />
                            <div>
                              <span className="font-bold text-museum-text block line-clamp-1">
                                {art.name}
                              </span>
                              <span className="text-[11px] text-museum-muted block">
                                {art.locationInsideMuseum || 'Main Stand'}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="font-medium text-museum-text block">
                            {museum?.name || 'Museum'}
                          </span>
                          <span className="text-[11px] text-museum-muted block">
                            {section?.name || 'Section'}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <button
                            onClick={() => setQrModalArtifact(art)}
                            className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-museum-light text-museum-primary hover:bg-museum-primary hover:text-white transition-all font-mono text-xs font-semibold"
                            title="View and print QR placard"
                          >
                            <QrCode className="w-3.5 h-3.5" />
                            <span>{art.shortCode}</span>
                          </button>
                        </td>

                        <td className="py-3.5 px-4">
                          <select
                            value={art.status}
                            onChange={(e) => handleStatusChange(art._id, e.target.value)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold focus:outline-hidden cursor-pointer border ${
                              art.status === 'PUBLISHED'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : art.status === 'DRAFT'
                                ? 'bg-amber-50 text-amber-800 border-amber-200'
                                : 'bg-slate-100 text-slate-700 border-slate-200'
                            }`}
                          >
                            <option value="PUBLISHED">PUBLISHED</option>
                            <option value="DRAFT">DRAFT</option>
                            <option value="ARCHIVED">ARCHIVED</option>
                          </select>
                        </td>

                        <td className="py-3.5 px-4 text-center">
                          <span className="font-semibold text-museum-text">
                            {art.viewCount || 0}
                          </span>
                          <span className="text-museum-muted text-xs"> / </span>
                          <span className="font-semibold text-museum-primary">
                            {art.scanCount || 0}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Link
                              to={`/a/${art.shortCode}`}
                              target="_blank"
                              className="p-1.5 rounded-lg text-museum-muted hover:text-museum-primary hover:bg-museum-light"
                              title="Preview Public Page"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Link>

                            <Link
                              to={`/admin/artifacts/${art._id}/edit`}
                              className="p-1.5 rounded-lg text-museum-muted hover:text-museum-primary hover:bg-museum-light"
                              title="Edit Artifact"
                            >
                              <Edit2 className="w-4 h-4" />
                            </Link>

                            <button
                              onClick={() => handleDelete(art._id, art.name)}
                              className="p-1.5 rounded-lg text-museum-muted hover:text-red-600 hover:bg-red-50"
                              title="Delete Artifact"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* QR Code Printable Modal */}
      {qrModalArtifact && (
        <QRPrintCardModal
          artifact={qrModalArtifact}
          museum={qrModalArtifact.museumId as Museum}
          section={qrModalArtifact.sectionId as Section}
          onClose={() => setQrModalArtifact(null)}
        />
      )}
    </AdminLayout>
  );
};
