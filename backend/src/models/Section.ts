import mongoose, { Document, Schema } from 'mongoose';

export interface ISection extends Document {
  museumId: mongoose.Types.ObjectId;
  name: string;
  description: string;
  coverImage?: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SectionSchema = new Schema<ISection>(
  {
    museumId: { type: Schema.Types.ObjectId, ref: 'Museum', required: true, index: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    coverImage: { type: String, default: '' },
    displayOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Section = mongoose.model<ISection>('Section', SectionSchema);
