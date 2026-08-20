import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Section } from '../models/Section';
import { Museum } from '../models/Museum';
import { Artifact } from '../models/Artifact';
import { AuthRequest } from '../middleware/auth';

export const getSectionsByMuseum = async (req: Request, res: Response): Promise<void> => {
  try {
    const { museumId } = req.params;
    let validMuseumId: any = museumId;

    if (!mongoose.Types.ObjectId.isValid(museumId)) {
      const museum = await Museum.findOne({ slug: museumId.toLowerCase() });
      if (museum) {
        validMuseumId = museum._id;
      }
    }

    const sections = await Section.find({ museumId: validMuseumId, isActive: true })
      .sort({ displayOrder: 1, createdAt: 1 })
      .lean();

    // Attach artifact counts for each section
    const sectionsWithCounts = await Promise.all(
      sections.map(async (sec) => {
        const artifactCount = await Artifact.countDocuments({ sectionId: sec._id });
        const publishedCount = await Artifact.countDocuments({ sectionId: sec._id, status: 'PUBLISHED' });
        const artifacts = await Artifact.find({ sectionId: sec._id, status: 'PUBLISHED' })
          .populate('qrCodeId')
          .sort({ displayOrder: 1, createdAt: 1 })
          .select('name shortCode shortDescription images audioNarration video locationInsideMuseum datePeriod tags qrCodeId')
          .lean();

        return {
          ...sec,
          artifactCount,
          publishedCount,
          artifacts,
        };
      })
    );

    res.json({ success: true, data: sectionsWithCounts });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getSectionById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const section = await Section.findById(id).populate('museumId', 'name slug logo coverImage');
    if (!section) {
      res.status(404).json({ success: false, message: 'Section not found' });
      return;
    }

    const artifacts = await Artifact.find({ sectionId: id, status: 'PUBLISHED' })
      .populate('qrCodeId')
      .sort({ displayOrder: 1, createdAt: 1 });

    res.json({
      success: true,
      data: {
        ...section.toObject(),
        artifacts,
        artifactCount: artifacts.length,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createSection = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { museumId, name, description, coverImage, displayOrder } = req.body;

    if (!museumId || !name) {
      res.status(400).json({ success: false, message: 'Museum ID and section name are required' });
      return;
    }

    const section = new Section({
      museumId,
      name,
      description,
      coverImage,
      displayOrder: displayOrder || 0,
    });

    await section.save();
    res.status(201).json({ success: true, data: section });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateSection = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const section = await Section.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!section) {
      res.status(404).json({ success: false, message: 'Section not found' });
      return;
    }

    res.json({ success: true, data: section });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteSection = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const section = await Section.findByIdAndDelete(id);

    if (!section) {
      res.status(404).json({ success: false, message: 'Section not found' });
      return;
    }

    // Also remove artifacts in this section
    await Artifact.deleteMany({ sectionId: id });

    res.json({ success: true, message: 'Section and associated artifacts removed' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
