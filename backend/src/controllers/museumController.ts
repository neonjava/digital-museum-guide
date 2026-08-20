import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Museum } from '../models/Museum';
import { Section } from '../models/Section';
import { Artifact } from '../models/Artifact';
import { QRCode } from '../models/QRCode';
import { AuthRequest } from '../middleware/auth';

export const getMuseums = async (_req: Request, res: Response): Promise<void> => {
  try {
    const museums = await Museum.find({ isActive: true }).sort({ createdAt: -1 }).lean();

    const populatedMuseums = await Promise.all(
      museums.map(async (museum) => {
        const sections = await Section.find({ museumId: museum._id, isActive: true })
          .sort({ displayOrder: 1, createdAt: 1 })
          .lean();

        const artifacts = await Artifact.find({ museumId: museum._id })
          .populate('qrCodeId')
          .populate('sectionId', 'name description coverImage')
          .sort({ displayOrder: 1, createdAt: 1 })
          .lean();

        const sectionsWithArtifacts = sections.map((sec) => {
          const secArtifacts = artifacts.filter(
            (art) =>
              art.sectionId &&
              ((art.sectionId as any)._id
                ? (art.sectionId as any)._id.toString()
                : (art.sectionId as any).toString()) === sec._id.toString()
          );
          return {
            ...sec,
            artifacts: secArtifacts,
            artifactCount: secArtifacts.length,
          };
        });

        const publishedArtifactsCount = artifacts.filter((a) => a.status === 'PUBLISHED').length;
        const qrCodesCount = artifacts.filter((a) => a.qrCodeId).length;

        return {
          ...museum,
          sections: sectionsWithArtifacts,
          artifacts,
          stats: {
            sectionsCount: sections.length,
            artifactsCount: artifacts.length,
            publishedArtifactsCount,
            qrCodesCount,
          },
        };
      })
    );

    res.json({ success: true, count: populatedMuseums.length, data: populatedMuseums });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMuseumById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    let query: any = { _id: id };
    if (!mongoose.Types.ObjectId.isValid(id)) {
      query = { slug: id.toLowerCase() };
    }

    const museum = await Museum.findOne(query).lean();
    if (!museum) {
      res.status(404).json({ success: false, message: 'Museum not found' });
      return;
    }

    const sections = await Section.find({ museumId: museum._id, isActive: true })
      .sort({ displayOrder: 1, createdAt: 1 })
      .lean();

    const artifacts = await Artifact.find({ museumId: museum._id })
      .populate('qrCodeId')
      .populate('sectionId', 'name description coverImage')
      .sort({ displayOrder: 1, createdAt: 1 })
      .lean();

    const sectionsWithArtifacts = sections.map((sec) => {
      const secArtifacts = artifacts.filter(
        (art) =>
          art.sectionId &&
          ((art.sectionId as any)._id
            ? (art.sectionId as any)._id.toString()
            : (art.sectionId as any).toString()) === sec._id.toString()
      );
      return {
        ...sec,
        artifacts: secArtifacts,
        artifactCount: secArtifacts.length,
      };
    });

    const publishedArtifactsCount = artifacts.filter((a) => a.status === 'PUBLISHED').length;
    const qrCodesCount = artifacts.filter((a) => a.qrCodeId).length;

    res.json({
      success: true,
      data: {
        ...museum,
        sections: sectionsWithArtifacts,
        artifacts,
      },
      stats: {
        sectionsCount: sections.length,
        artifactsCount: artifacts.length,
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

    // Cascade delete associated records
    await Section.deleteMany({ museumId: id });
    await Artifact.deleteMany({ museumId: id });
    await QRCode.deleteMany({ museumId: id });

    res.json({ success: true, message: 'Museum and associated records removed' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
