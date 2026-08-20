import { Request, Response } from 'express';
import { Museum } from '../models/Museum';
import { Section } from '../models/Section';
import { Artifact } from '../models/Artifact';
import { QRCode } from '../models/QRCode';
import { AuthRequest } from '../middleware/auth';

export const getMuseums = async (_req: Request, res: Response): Promise<void> => {
  try {
    const museums = await Museum.find({ isActive: true }).sort({ createdAt: -1 });
    res.json({ success: true, count: museums.length, data: museums });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMuseumById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const museum = await Museum.findById(id);
    if (!museum) {
      res.status(404).json({ success: false, message: 'Museum not found' });
      return;
    }

    const sectionsCount = await Section.countDocuments({ museumId: id, isActive: true });
    const artifactsCount = await Artifact.countDocuments({ museumId: id });
    const publishedArtifactsCount = await Artifact.countDocuments({ museumId: id, status: 'PUBLISHED' });
    const qrCodesCount = await QRCode.countDocuments({ museumId: id });

    res.json({
      success: true,
      data: museum,
      stats: {
        sectionsCount,
        artifactsCount,
        publishedArtifactsCount,
        qrCodesCount,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createMuseum = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      name,
      slug,
      description,
      logo,
      coverImage,
      address,
      contact,
      openingHours,
      website,
      socialLinks,
    } = req.body;

    const generatedSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const existingSlug = await Museum.findOne({ slug: generatedSlug });
    if (existingSlug) {
      res.status(400).json({ success: false, message: 'Museum slug/identifier already exists' });
      return;
    }

    const museum = new Museum({
      name,
      slug: generatedSlug,
      description,
      logo,
      coverImage,
      address,
      contact,
      openingHours,
      website,
      socialLinks,
    });

    await museum.save();
    res.status(201).json({ success: true, data: museum });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateMuseum = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const museum = await Museum.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!museum) {
      res.status(404).json({ success: false, message: 'Museum not found' });
      return;
    }

    res.json({ success: true, data: museum });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteMuseum = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const museum = await Museum.findByIdAndDelete(id);

    if (!museum) {
      res.status(404).json({ success: false, message: 'Museum not found' });
      return;
    }

    // Cascade soft delete or cleanup
    await Section.deleteMany({ museumId: id });
    await Artifact.deleteMany({ museumId: id });
    await QRCode.deleteMany({ museumId: id });

    res.json({ success: true, message: 'Museum and associated records removed' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
