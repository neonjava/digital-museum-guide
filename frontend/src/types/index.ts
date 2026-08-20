export type UserRole = 'SUPER_ADMIN' | 'MUSEUM_ADMIN' | 'EDITOR';

export interface User {
  id: string;
  _id?: string;
  name: string;
  email: string;
  role: UserRole;
  museumId?: string | Museum;
}

export interface Museum {
  _id: string;
  name: string;
  slug: string;
  description: string;
  logo?: string;
  coverImage?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };
  contact?: {
    email?: string;
    phone?: string;
  };
  openingHours?: string;
  website?: string;
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Section {
  _id: string;
  museumId: string | Museum;
  name: string;
  description: string;
  coverImage?: string;
  displayOrder: number;
  isActive: boolean;
  artifactCount?: number;
  publishedCount?: number;
  createdAt: string;
  updatedAt: string;
}

export type ArtifactStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface RichContentBlock {
  id: string;
  type: 'heading' | 'paragraph' | 'bullet_list' | 'image' | 'quote' | 'callout';
  content?: string;
  items?: string[];
  imageUrl?: string;
  caption?: string;
}

export interface ArtifactImage {
  url: string;
  caption?: string;
  isCover?: boolean;
  publicId?: string;
}

export interface ArtifactAudio {
  url?: string;
  title?: string;
  duration?: number;
  transcript?: string;
  publicId?: string;
}

export interface ArtifactVideo {
  url?: string;
  title?: string;
  posterUrl?: string;
  duration?: number;
  publicId?: string;
}

export interface Artifact {
  _id: string;
  museumId: string | Museum;
  sectionId: string | Section;
  shortCode: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  richContent: RichContentBlock[];
  historicalInformation?: string;
  datePeriod?: string;
  creatorOrigin?: string;
  locationInsideMuseum?: string;
  displayOrder: number;
  tags: string[];
  images: ArtifactImage[];
  audioNarration?: ArtifactAudio;
  video?: ArtifactVideo;
  additionalNotes?: string;
  status: ArtifactStatus;
  qrCodeId?: string | QRCodeData;
  viewCount: number;
  scanCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface QRCodeData {
  _id: string;
  artifactId: string | Artifact;
  museumId: string | Museum;
  shortCode: string;
  publicUrl: string;
  qrImageUrl: string;
  svgContent?: string;
  scanCount: number;
  lastScannedAt?: string;
  createdAt: string;
}

export interface MediaItem {
  _id: string;
  url: string;
  publicId: string;
  mediaType: 'image' | 'audio' | 'video' | 'document';
  fileName: string;
  fileSize: number;
  mimeType: string;
  thumbnailUrl?: string;
  duration?: number;
  createdAt: string;
}

export interface AnalyticsSummary {
  summary: {
    totalViews: number;
    totalQRScans: number;
    totalAudioPlays: number;
  };
  sources: {
    QR?: number;
    WEB?: number;
    APP?: number;
  };
  topViewedArtifacts: Artifact[];
  topScannedArtifacts: Artifact[];
  recentActivity: Array<{
    _id: string;
    artifactId?: Artifact;
    eventType: string;
    source: string;
    timestamp: string;
    deviceType: string;
  }>;
}
