import mongoose, { Document, Schema } from 'mongoose';

export type MediaType = 'image' | 'audio' | 'video' | 'document';

export interface IMedia extends Document {
  museumId?: mongoose.Types.ObjectId;
  artifactId?: mongoose.Types.ObjectId;
  url: string;
  publicId: string;
  mediaType: MediaType;
  fileName: string;
  fileSize: number;
  mimeType: string;
  thumbnailUrl?: string;
  duration?: number;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const MediaSchema = new Schema<IMedia>(
  {
    museumId: { type: Schema.Types.ObjectId, ref: 'Museum' },
    artifactId: { type: Schema.Types.ObjectId, ref: 'Artifact' },
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    mediaType: {
      type: String,
      enum: ['image', 'audio', 'video', 'document'],
      required: true,
    },
    fileName: { type: String, required: true },
    fileSize: { type: Number, default: 0 },
    mimeType: { type: String, default: '' },
    thumbnailUrl: { type: String, default: '' },
    duration: { type: Number, default: 0 },
    metadata: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

export const Media = mongoose.model<IMedia>('Media', MediaSchema);
