import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Museum } from '../models/Museum';
import { Section } from '../models/Section';
import { Artifact } from '../models/Artifact';

export const getPublicMuseum = async (req: Request, res: Response): Promise<void> => {
  try {
    const { identifier } = req.params;
    let query: any = { slug: identifier.toLowerCase() };

    if (mongoose.Types.ObjectId.isValid(identifier)) {
      query = { $or: [{ _id: identifier }, { slug: identifier.toLowerCase() }] };
    }

    const museum = await Museum.findOne({ ...query, isActive: true }).lean();
    if (!museum) {
      res.status(404).json({ success: false, message: 'Museum not found or inactive' });
      return;
    }

    const sections = await Section.find({ museumId: museum._id, isActive: true })
      .sort({ displayOrder: 1, createdAt: 1 })
      .lean();

    const sectionsWithArtifacts = await Promise.all(
      sections.map(async (sec) => {
        const artifacts = await Artifact.find({
          sectionId: sec._id,
          status: 'PUBLISHED',
        })
          .populate('qrCodeId')
          .sort({ displayOrder: 1, createdAt: 1 })
          .select('name shortCode shortDescription images audioNarration video locationInsideMuseum datePeriod tags qrCodeId')
          .lean();

        return {
          ...sec,
          artifacts,
          artifactCount: artifacts.length,
        };
      })
    );

    const totalPublishedArtifacts = await Artifact.countDocuments({
      museumId: museum._id,
      status: 'PUBLISHED',
    });

    const allArtifacts = await Artifact.find({
      museumId: museum._id,
      status: 'PUBLISHED',
    })
      .populate('qrCodeId')
      .populate('sectionId', 'name description coverImage')
      .sort({ displayOrder: 1, createdAt: 1 })
      .lean();

    res.json({
      success: true,
      data: {
        museum,
        sections: sectionsWithArtifacts,
        artifacts: allArtifacts,
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
    const section = await Section.findById(sectionId).populate('museumId', 'name slug logo coverImage description');
    if (!section) {
      res.status(404).json({ success: false, message: 'Section not found' });
      return;
    }

    const artifacts = await Artifact.find({
      sectionId,
      status: 'PUBLISHED',
    })
      .populate('qrCodeId')
      .sort({ displayOrder: 1, createdAt: 1 })
      .select('name shortCode shortDescription fullDescription richContent historicalInformation images audioNarration video locationInsideMuseum datePeriod creatorOrigin tags qrCodeId');

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

    const shortCodeRegex = new RegExp(`^${identifier}$`, 'i');
    let query: any = { shortCode: shortCodeRegex };
    if (mongoose.Types.ObjectId.isValid(identifier)) {
      query = { $or: [{ _id: identifier }, { shortCode: shortCodeRegex }] };
    }

    const artifact = await Artifact.findOne(query)
      .populate('museumId', 'name slug logo coverImage description address contact openingHours website')
      .populate('sectionId', 'name description coverImage')
      .populate('qrCodeId');

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

    const sectionId = (artifact.sectionId as any)?._id || artifact.sectionId;
    const museumId = (artifact.museumId as any)?._id || artifact.museumId;

    // Get related artifacts in the same section for exploration
    let relatedArtifacts = await Artifact.find({
      sectionId,
      _id: { $ne: artifact._id },
      status: 'PUBLISHED',
    })
      .limit(6)
      .select('name shortCode shortDescription images locationInsideMuseum datePeriod tags audioNarration video');

    // If no related artifacts in section, get from the same museum
    if (relatedArtifacts.length === 0) {
      relatedArtifacts = await Artifact.find({
        museumId,
        _id: { $ne: artifact._id },
        status: 'PUBLISHED',
      })
        .limit(6)
        .select('name shortCode shortDescription images locationInsideMuseum datePeriod tags audioNarration video');
    }

    res.json({
      success: true,
      data: {
        artifact,
        museum: artifact.museumId,
        section: artifact.sectionId,
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
      res.json({ success: true, count: 0, data: [] });
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

    if (museumId) {
      if (mongoose.Types.ObjectId.isValid(String(museumId))) {
        query.museumId = museumId;
      } else {
        const museum = await Museum.findOne({ slug: String(museumId).toLowerCase() });
        if (museum) {
          query.museumId = museum._id;
        }
      }
    }

    if (sectionId && mongoose.Types.ObjectId.isValid(String(sectionId))) {
      query.sectionId = sectionId;
    }

    const artifacts = await Artifact.find(query)
      .populate('museumId', 'name slug logo')
      .populate('sectionId', 'name')
      .populate('qrCodeId')
      .limit(30)
      .select('name shortCode shortDescription images audioNarration video museumId sectionId locationInsideMuseum datePeriod tags qrCodeId');

    res.json({ success: true, count: artifacts.length, data: artifacts });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
