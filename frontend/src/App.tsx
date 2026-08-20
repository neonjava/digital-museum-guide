import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Visitor Pages
import { HomePage } from './pages/visitor/HomePage';
import { MuseumPage } from './pages/visitor/MuseumPage';
import { SectionPage } from './pages/visitor/SectionPage';
import { ArtifactPage } from './pages/visitor/ArtifactPage';
import { ScanPage } from './pages/visitor/ScanPage';
import { SearchPage } from './pages/visitor/SearchPage';
import { QRShowcasePage } from './pages/visitor/QRShowcasePage';

// Admin Pages
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminOverviewPage } from './pages/admin/AdminOverviewPage';
import { AdminMuseumsPage } from './pages/admin/AdminMuseumsPage';
import { AdminSectionsPage } from './pages/admin/AdminSectionsPage';
import { AdminArtifactsPage } from './pages/admin/AdminArtifactsPage';
import { AdminArtifactEditorPage } from './pages/admin/AdminArtifactEditorPage';
import { AdminQRCodesPage } from './pages/admin/AdminQRCodesPage';
import { AdminMediaPage } from './pages/admin/AdminMediaPage';
import { AdminAnalyticsPage } from './pages/admin/AdminAnalyticsPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

// Protected Route Component
const ProtectedAdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-museum-bg">
        <div className="w-8 h-8 rounded-full border-2 border-museum-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <Routes>
      {/* 1. Visitor Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/museum/:museumId" element={<MuseumPage />} />
      <Route path="/museum/:museumId/section/:sectionId" element={<SectionPage />} />
      <Route path="/a/:artifactId" element={<ArtifactPage />} />
      <Route path="/artifact/:artifactId" element={<ArtifactPage />} />
      <Route path="/scan" element={<ScanPage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/qr-showcase" element={<QRShowcasePage />} />
      <Route path="/placards" element={<QRShowcasePage />} />

      {/* 2. Admin Auth */}
      <Route path="/admin/login" element={<AdminLoginPage />} />

      {/* 3. Protected Admin Management Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedAdminRoute>
            <AdminOverviewPage />
          </ProtectedAdminRoute>
        }
      />
      <Route
        path="/admin/museums"
        element={
          <ProtectedAdminRoute>
            <AdminMuseumsPage />
          </ProtectedAdminRoute>
        }
      />
      <Route
        path="/admin/sections"
        element={
          <ProtectedAdminRoute>
            <AdminSectionsPage />
          </ProtectedAdminRoute>
        }
      />
      <Route
        path="/admin/artifacts"
        element={
          <ProtectedAdminRoute>
            <AdminArtifactsPage />
          </ProtectedAdminRoute>
        }
      />
      <Route
        path="/admin/artifacts/new"
        element={
          <ProtectedAdminRoute>
            <AdminArtifactEditorPage />
          </ProtectedAdminRoute>
        }
      />
      <Route
        path="/admin/artifacts/:id/edit"
        element={
          <ProtectedAdminRoute>
            <AdminArtifactEditorPage />
          </ProtectedAdminRoute>
        }
      />
      <Route
        path="/admin/qr-codes"
        element={
          <ProtectedAdminRoute>
            <AdminQRCodesPage />
          </ProtectedAdminRoute>
        }
      />
      <Route
        path="/admin/media"
        element={
          <ProtectedAdminRoute>
            <AdminMediaPage />
          </ProtectedAdminRoute>
        }
      />
      <Route
        path="/admin/analytics"
        element={
          <ProtectedAdminRoute>
            <AdminAnalyticsPage />
          </ProtectedAdminRoute>
        }
      />
      <Route
        path="/admin/settings"
        element={
          <ProtectedAdminRoute>
            <AdminSettingsPage />
          </ProtectedAdminRoute>
        }
      />

      {/* Fallback to Home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
