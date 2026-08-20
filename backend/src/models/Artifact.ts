import mongoose, { Document, Schema } from 'mongoose';

export type ArtifactStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface IRichContentBlock {
  id: string;
  type: 'heading' | 'paragraph' | 'bullet_list' | 'image' | 'quote' | 'callout';
  content?: string;
  items?: string[];
  imageUrl?: string;
  caption?: string;
}

export interface IArtifactImage {
  url: string;
  caption?: string;
  isCover?: boolean;
  publicId?: string;
}

export interface IArtifactAudio {
  url?: string;
  title?: string;
  duration?: number;
  transcript?: string;
  publicId?: string;
}

export interface IArtifactVideo {
  url?: string;
  title?: string;
  posterUrl?: string;
  duration?: number;
  publicId?: string;
}

export interface IArtifact extends Document {
  museumId: mongoose.Types.ObjectId;
  sectionId: mongoose.Types.ObjectId;
  shortCode: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  richContent: IRichContentBlock[];
  historicalInformation?: string;
  datePeriod?: string;
  creatorOrigin?: string;
  locationInsideMuseum?: string;
  displayOrder: number;
  tags: string[];
  images: IArtifactImage[];
  audioNarration?: IArtifactAudio;
  video?: IArtifactVideo;
  additionalNotes?: string;
  status: ArtifactStatus;
  qrCodeId?: mongoose.Types.ObjectId;
  viewCount: number;
  scanCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const RichContentBlockSchema = new Schema<IRichContentBlock>(
  {
    id: { type: String, required: true },
    type: {
      type: String,
      enum: ['heading', 'paragraph', 'bullet_list', 'image', 'quote', 'callout'],
      required: true,
    },
    content: { type: String, default: '' },
    items: [{ type: String }],
    imageUrl: { type: String, default: '' },
    caption: { type: String, default: '' },
  },
  { _id: false }
);

const ArtifactImageSchema = new Schema<IArtifactImage>(
  {
    url: { type: String, required: true },
    caption: { type: String, default: '' },
    isCover: { type: Boolean, default: false },
    publicId: { type: String, default: '' },
  },
  { _id: false }
);

const ArtifactAudioSchema = new Schema<IArtifactAudio>(
  {
    url: { type: String, default: '' },
    title: { type: String, default: 'Audio Narration' },
    duration: { type: Number, default: 0 },
    transcript: { type: String, default: '' },
    publicId: { type: String, default: '' },
  },
  { _id: false }
);

const ArtifactVideoSchema = new Schema<IArtifactVideo>(
  {
    url: { type: String, default: '' },
    title: { type: String, default: '' },
    posterUrl: { type: String, default: '' },
    duration: { type: Number, default: 0 },
    publicId: { type: String, default: '' },
  },
  { _id: false }
);

const ArtifactSchema = new Schema<IArtifact>(
  {
    museumId: { type: Schema.Types.ObjectId, ref: 'Museum', required: true, index: true },
    sectionId: { type: Schema.Types.ObjectId, ref: 'Section', required: true, index: true },
    shortCode: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    shortDescription: { type: String, default: '' },
    fullDescription: { type: String, default: '' },
    richContent: [RichContentBlockSchema],
    historicalInformation: { type: String, default: '' },
    datePeriod: { type: String, default: '' },
    creatorOrigin: { type: String, default: '' },
    locationInsideMuseum: { type: String, default: '' },
    displayOrder: { type: Number, default: 0 },
    tags: [{ type: String, trim: true }],
    images: [ArtifactImageSchema],
    audioNarration: { type: ArtifactAudioSchema, default: () => ({}) },
    video: { type: ArtifactVideoSchema, default: () => ({}) },
    additionalNotes: { type: String, default: '' },
    status: {
      type: String,
      enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'],
      default: 'DRAFT',
      index: true,
    },
    qrCodeId: { type: Schema.Types.ObjectId, ref: 'QRCode' },
    viewCount: { type: Number, default: 0 },
    scanCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Artifact = mongoose.model<IArtifact>('Artifact', ArtifactSchema);
