import mongoose, { Document, Schema } from 'mongoose';

export interface IQRCode extends Document {
  artifactId: mongoose.Types.ObjectId;
  museumId: mongoose.Types.ObjectId;
  shortCode: string;
  publicUrl: string;
  qrImageUrl: string;
  svgContent?: string;
  scanCount: number;
  lastScannedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const QRCodeSchema = new Schema<IQRCode>(
  {
    artifactId: { type: Schema.Types.ObjectId, ref: 'Artifact', required: true, unique: true },
    museumId: { type: Schema.Types.ObjectId, ref: 'Museum', required: true, index: true },
    shortCode: { type: String, required: true, unique: true, index: true },
    publicUrl: { type: String, required: true },
    qrImageUrl: { type: String, required: true },
    svgContent: { type: String, default: '' },
    scanCount: { type: Number, default: 0 },
    lastScannedAt: { type: Date },
  },
  { timestamps: true }
);

export const QRCode = mongoose.model<IQRCode>('QRCode', QRCodeSchema);
