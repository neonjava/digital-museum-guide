import mongoose, { Document, Schema } from 'mongoose';

export interface IMuseum extends Document {
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
  createdAt: Date;
  updatedAt: Date;
}

const MuseumSchema = new Schema<IMuseum>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, default: '' },
    logo: { type: String, default: '' },
    coverImage: { type: String, default: '' },
    address: {
      street: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      country: { type: String, default: '' },
      postalCode: { type: String, default: '' },
    },
    contact: {
      email: { type: String, default: '' },
      phone: { type: String, default: '' },
    },
    openingHours: { type: String, default: 'Tue-Sun: 9:00 AM - 5:00 PM (Closed Mondays)' },
    website: { type: String, default: '' },
    socialLinks: {
      facebook: { type: String, default: '' },
      instagram: { type: String, default: '' },
      twitter: { type: String, default: '' },
      youtube: { type: String, default: '' },
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Museum = mongoose.model<IMuseum>('Museum', MuseumSchema);
