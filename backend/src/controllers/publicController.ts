import { Request, Response } from 'express';
import { Museum } from '../models/Museum';
import { Section } from '../models/Section';
import { Artifact } from '../models/Artifact';
import mongoose from 'mongoose';

export const getPublicMuseum = async (req: Request, res: Response): Promise<void> => {
  try {
    const { identifier } = req.params;
    let query: any = { slug: identifier.toLowerCase() };

    if (mongoose.Types.ObjectId.isValid(identifier)) {
      query = { $or: [{ _id: identifier }, { slug: identifier.toLowerCase() }] };
    }

    const museum = await Museum.findOne({ ...query, isActive: true });
    if (!museum) {
      res.status(404).json({ success: false, message: 'Museum not found or inactive' });
      return;
    }

    const sections = await Section.find({ museumId: museum._id, isActive: true })
      .sort({ displayOrder: 1, createdAt: 1 });

    const sectionsWithStats = await Promise.all(
      sections.map(async (sec) => {
        const publishedCount = await Artifact.countDocuments({
          sectionId: sec._id,
          status: 'PUBLISHED',
        });
        return {
          ...sec.toObject(),
          artifactCount: publishedCount,
        };
      })
    );

    const totalPublishedArtifacts = await Artifact.countDocuments({
      museumId: museum._id,
      status: 'PUBLISHED',
    });

    res.json({
      success: true,
      data: {
        museum,
        sections: sectionsWithStats,
        stats: {
          totalSections: sections.length,
          totalArtifacts: totalPublishedArtifacts,
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPublicSectionArtifacts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { sectionId } = req.params;
    const section = await Section.findById(sectionId).populate('museumId', 'name slug logo');
    if (!section) {
      res.status(404).json({ success: false, message: 'Section not found' });
      return;
    }

    const artifacts = await Artifact.find({
      sectionId,
      status: 'PUBLISHED',
    })
      .sort({ displayOrder: 1, createdAt: 1 })
      .select('name shortCode shortDescription images audioNarration video locationInsideMuseum datePeriod tags');

    res.json({
      success: true,
      data: {
        section,
        artifacts,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPublicArtifact = async (req: Request, res: Response): Promise<void> => {
  try {
    const { identifier } = req.params;

    let query: any = { shortCode: identifier };
    if (mongoose.Types.ObjectId.isValid(identifier)) {
      query = { $or: [{ _id: identifier }, { shortCode: identifier }] };
    }

    const artifact = await Artifact.findOne(query)
      .populate('museumId', 'name slug logo address contact openingHours website')
      .populate('sectionId', 'name description coverImage');

    if (!artifact) {
      res.status(404).json({
        success: false,
        message: 'Artifact not found. Please check the QR code or URL.',
      });
      return;
    }

    // If artifact is not published, return specific status message
    if (artifact.status !== 'PUBLISHED') {
      res.status(403).json({
        success: false,
        isUnpublished: true,
        message: 'This exhibit is currently unavailable or under curation.',
        data: {
          name: artifact.name,
          museum: artifact.museumId,
        },
      });
      return;
    }

    // Get related artifacts in the same section for easy exploration
    const relatedArtifacts = await Artifact.find({
      sectionId: artifact.sectionId,
      _id: { $ne: artifact._id },
      status: 'PUBLISHED',
    })
      .limit(4)
      .select('name shortCode shortDescription images locationInsideMuseum');

    res.json({
      success: true,
      data: {
        artifact,
        relatedArtifacts,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const searchPublicArtifacts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { q, museumId, sectionId } = req.query;

    if (!q || String(q).trim() === '') {
      res.json({ success: true, data: [] });
      return;
    }

    const searchRegex = new RegExp(String(q).trim(), 'i');
    const query: any = {
      status: 'PUBLISHED',
      $or: [
        { name: searchRegex },
        { shortDescription: searchRegex },
        { tags: { $in: [searchRegex] } },
        { creatorOrigin: searchRegex },
        { datePeriod: searchRegex },
        { locationInsideMuseum: searchRegex },
      ],
    };

    if (museumId) query.museumId = museumId;
    if (sectionId) query.sectionId = sectionId;

    const artifacts = await Artifact.find(query)
      .populate('museumId', 'name slug')
      .populate('sectionId', 'name')
      .limit(20)
      .select('name shortCode shortDescription images museumId sectionId locationInsideMuseum datePeriod');

    res.json({ success: true, count: artifacts.length, data: artifacts });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
