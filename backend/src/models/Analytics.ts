import mongoose, { Document, Schema } from 'mongoose';

export type EventType = 'PAGE_VIEW' | 'QR_SCAN' | 'AUDIO_PLAY' | 'VIDEO_PLAY';
export type TrafficSource = 'QR' | 'WEB' | 'APP';

export interface IAnalytics extends Document {
  artifactId?: mongoose.Types.ObjectId;
  museumId: mongoose.Types.ObjectId;
  sectionId?: mongoose.Types.ObjectId;
  eventType: EventType;
  source: TrafficSource;
  timestamp: Date;
  userAgent?: string;
  deviceType?: string;
  referrer?: string;
}

const AnalyticsSchema = new Schema<IAnalytics>(
  {
    artifactId: { type: Schema.Types.ObjectId, ref: 'Artifact', index: true },
    museumId: { type: Schema.Types.ObjectId, ref: 'Museum', required: true, index: true },
    sectionId: { type: Schema.Types.ObjectId, ref: 'Section' },
    eventType: {
      type: String,
      enum: ['PAGE_VIEW', 'QR_SCAN', 'AUDIO_PLAY', 'VIDEO_PLAY'],
      default: 'PAGE_VIEW',
    },
    source: {
      type: String,
      enum: ['QR', 'WEB', 'APP'],
      default: 'WEB',
    },
    timestamp: { type: Date, default: Date.now, index: true },
    userAgent: { type: String, default: '' },
    deviceType: { type: String, default: 'desktop' },
    referrer: { type: String, default: '' },
  },
  { timestamps: false }
);

export const Analytics = mongoose.model<IAnalytics>('Analytics', AnalyticsSchema);
