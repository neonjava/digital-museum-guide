import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  QrCode,
  Download,
  Printer,
  Copy,
  Check,
  Search,
  ExternalLink,
  RefreshCw,
  Landmark,
  Layers,
  Sparkles,
} from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { QRPrintCardModal } from '../../components/admin/QRPrintCardModal';
import { QRCodeData, Artifact, Museum, Section } from '../../types';
import { api } from '../../services/api';

export const AdminQRCodesPage: React.FC = () => {
  const [qrList, setQrList] = useState<QRCodeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedQR, setSelectedQR] = useState<QRCodeData | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchQRCodes = async () => {
    try {
      setLoading(true);
      const res = await api.get('/qr');
      if (res.success && res.data) {
        setQrList(res.data);
      }
    } catch (err) {
      console.error('Error fetching QR codes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQRCodes();
  }, []);

  const handleCopy = (publicUrl: string, id: string) => {
    navigator.clipboard.writeText(publicUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRegenerate = async (artifactId: string) => {
    try {
      await api.post(`/qr/regenerate/${artifactId}`);
      fetchQRCodes();
      alert('QR Code regenerated successfully!');
    } catch (err: any) {
      alert(err.message || 'Failed to regenerate QR code');
    }
  };

  const filteredQRs = qrList.filter((qr) => {
    if (!searchTerm) return true;
    const s = searchTerm.toLowerCase();
    const art = qr.artifactId as Artifact | undefined;
    const museum = qr.museumId as Museum | undefined;
    return (
      art?.name?.toLowerCase().includes(s) ||
      museum?.name?.toLowerCase().includes(s) ||
      qr.shortCode.toLowerCase().includes(s)
    );
  });

  return (
    <AdminLayout
      title="QR Code Management Studio"
      subtitle="Manage, preview, download high-res PNG/SVG, and print exhibit QR cards"
      actions={
        <div className="flex items-center space-x-2">
          <button
            onClick={fetchQRCodes}
            className="flex items-center space-x-1 px-3 py-2 rounded-xl bg-white border border-museum-border text-xs font-semibold text-museum-text hover:bg-museum-light transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Search bar */}
        <div className="bg-white p-4 rounded-2xl border border-museum-border shadow-card flex items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-museum-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by exhibit name or shortcode..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-museum-border text-xs text-museum-text focus:outline-hidden focus:border-museum-primary"
            />
          </div>

          <span className="text-xs text-museum-muted font-medium">
            Total QR Codes: {filteredQRs.length}
          </span>
        </div>

        {/* QR Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 rounded-3xl bg-slate-200 animate-pulse" />
            ))}
          </div>
        ) : filteredQRs.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-museum-border">
            <QrCode className="w-12 h-12 text-museum-muted mx-auto mb-3" />
            <h3 className="font-bold text-museum-text">No QR codes found</h3>
            <p className="text-xs text-museum-muted mt-1">
              QR codes are automatically generated whenever you create or publish an artifact.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQRs.map((qr) => {
              const art = qr.artifactId as Artifact | undefined;
              const museum = qr.museumId as Museum | undefined;

              return (
                <div
                  key={qr._id}
                  className="rounded-3xl bg-white border border-museum-border shadow-card p-6 flex flex-col justify-between space-y-4 hover:shadow-elevated transition-all"
                >
                  {/* Top info */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono font-bold text-museum-primary bg-museum-light px-2.5 py-0.5 rounded-md">
                        {qr.shortCode}
                      </span>
                      <span className="text-[11px] text-museum-muted">
                        Scanned {qr.scanCount || 0} times
                      </span>
                    </div>

                    <h3 className="font-serif font-bold text-base text-museum-text line-clamp-1">
                      {art?.name || 'Exhibit Model'}
                    </h3>

                    <p className="text-xs text-museum-muted line-clamp-1">
                      {museum?.name || 'Museum Collection'}
                    </p>
                  </div>

                  {/* QR Image Preview */}
                  <div
                    onClick={() => setSelectedQR(qr)}
                    className="p-4 bg-museum-bg rounded-2xl border border-museum-border/60 flex items-center justify-center cursor-pointer hover:border-museum-primary transition-colors group"
                  >
                    <img
                      src={qr.qrImageUrl}
                      alt={qr.shortCode}
                      className="w-36 h-36 object-contain group-hover:scale-105 transition-transform"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 border-t border-museum-border/60 flex items-center justify-between">
                    <button
                      onClick={() => setSelectedQR(qr)}
                      className="flex items-center space-x-1 text-xs font-bold text-museum-primary hover:underline"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print Card</span>
                    </button>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleCopy(qr.publicUrl, qr._id)}
                        className="p-2 rounded-lg text-museum-muted hover:text-museum-primary hover:bg-museum-light transition-colors"
                        title="Copy Public URL"
                      >
                        {copiedId === qr._id ? (
                          <Check className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>

                      <Link
                        to={`/a/${qr.shortCode}`}
                        target="_blank"
                        className="p-2 rounded-lg text-museum-muted hover:text-museum-primary hover:bg-museum-light transition-colors"
                        title="Test Public QR Destination"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Printable Exhibit Card Modal */}
      {selectedQR && (
        <QRPrintCardModal
          artifact={selectedQR.artifactId as Artifact}
          museum={selectedQR.museumId as Museum}
          onClose={() => setSelectedQR(null)}
        />
      )}
    </AdminLayout>
  );
};
