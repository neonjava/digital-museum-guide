import { Request, Response } from 'express';
import mongoose from 'mongoose';
import crypto from 'crypto';
import { Artifact } from '../models/Artifact';
import { Museum } from '../models/Museum';
import { QRCode } from '../models/QRCode';
import { QRService } from '../services/qrService';
import { AuthRequest } from '../middleware/auth';

// Helper to generate a clean, short unique alphanumeric identifier (e.g., 'art_8f29d2')
const generateUniqueShortCode = (): string => {
  const randomHex = crypto.randomBytes(3).toString('hex'); // 6 hex characters
  return `art_${randomHex}`;
};

export const getArtifacts = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      museumId,
      sectionId,
      status,
      search,
      page = '1',
      limit = '50',
    } = req.query;

    const query: any = {};

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

    if (status) {
      query.status = status;
    }

    if (search) {
      const searchRegex = new RegExp(String(search).trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { shortDescription: searchRegex },
        { shortCode: searchRegex },
        { tags: { $in: [searchRegex] } },
        { locationInsideMuseum: searchRegex },
        { creatorOrigin: searchRegex },
        { datePeriod: searchRegex },
      ];
    }

    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 50;
    const skip = (pageNum - 1) * limitNum;

    const total = await Artifact.countDocuments(query);
    const artifacts = await Artifact.find(query)
      .populate('museumId', 'name slug logo coverImage description address contact openingHours website')
      .populate('sectionId', 'name description coverImage')
      .populate('qrCodeId')
      .sort({ displayOrder: 1, createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.json({
      success: true,
      data: artifacts,
      pagination: {
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum),
        limit: limitNum,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getArtifactById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const shortCodeRegex = new RegExp(`^${id}$`, 'i');
    let query: any = { shortCode: shortCodeRegex };
    if (mongoose.Types.ObjectId.isValid(id)) {
      query = { $or: [{ _id: id }, { shortCode: shortCodeRegex }] };
    }

    const artifact = await Artifact.findOne(query)
      .populate('museumId', 'name slug logo coverImage description address contact openingHours website')
      .populate('sectionId', 'name description coverImage')
      .populate('qrCodeId');

    if (!artifact) {
      res.status(404).json({ success: false, message: 'Artifact not found' });
      return;
    }

    const sectionId = (artifact.sectionId as any)?._id || artifact.sectionId;
    const museumId = (artifact.museumId as any)?._id || artifact.museumId;

    let relatedArtifacts: any[] = await Artifact.find({
      sectionId,
      _id: { $ne: artifact._id },
      status: 'PUBLISHED',
    })
      .limit(6)
      .select('name shortCode shortDescription images locationInsideMuseum datePeriod tags audioNarration video')
      .lean();

    if (relatedArtifacts.length === 0) {
      relatedArtifacts = await Artifact.find({
        museumId,
        _id: { $ne: artifact._id },
        status: 'PUBLISHED',
      })
        .limit(6)
        .select('name shortCode shortDescription images locationInsideMuseum datePeriod tags audioNarration video')
        .lean();
    }

    res.json({
      success: true,
      data: artifact,
      relatedArtifacts,
      museum: artifact.museumId,
      section: artifact.sectionId,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createArtifact = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      museumId,
      sectionId,
      name,
      shortDescription,
      fullDescription,
      richContent,
      historicalInformation,
      datePeriod,
      creatorOrigin,
      locationInsideMuseum,
      displayOrder,
      tags,
      images,
      audioNarration,
      video,
      additionalNotes,
      status,
    } = req.body;

    if (!museumId || !sectionId || !name) {
      res.status(400).json({
        success: false,
        message: 'Museum, Section, and Artifact name are required',
      });
      return;
    }

    // Generate unique short code
    let shortCode = generateUniqueShortCode();
    while (await Artifact.findOne({ shortCode })) {
      shortCode = generateUniqueShortCode();
    }

    // Create the artifact document first
    const artifact = new Artifact({
      museumId,
      sectionId,
      shortCode,
      name,
      shortDescription,
      fullDescription,
      richContent: richContent || [],
      historicalInformation,
      datePeriod,
      creatorOrigin,
      locationInsideMuseum,
      displayOrder: displayOrder || 0,
      tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map((t: string) => t.trim()) : []),
      images: images || [],
      audioNarration: audioNarration || {},
      video: video || {},
      additionalNotes,
      status: status || 'DRAFT',
    });

    await artifact.save();

    // Automatically generate the unique QR Code record pointing to the canonical public URL
    const qrData = await QRService.generateQRCode(shortCode);

    const qrCode = new QRCode({
      artifactId: artifact._id,
      museumId: artifact.museumId,
      shortCode: artifact.shortCode,
      publicUrl: qrData.publicUrl,
      qrImageUrl: qrData.qrImageUrl,
      svgContent: qrData.svgContent,
    });

    await qrCode.save();

    // Link QR code to artifact
    artifact.qrCodeId = qrCode._id as any;
    await artifact.save();

    const populatedArtifact = await Artifact.findById(artifact._id)
      .populate('museumId', 'name slug logo coverImage description')
      .populate('sectionId', 'name description coverImage')
      .populate('qrCodeId');

    res.status(201).json({ success: true, data: populatedArtifact });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateArtifact = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    // Prevent overwriting the unique shortCode or qrCodeId to ensure existing QR codes never break
    delete updates.shortCode;
    delete updates.qrCodeId;

    if (updates.tags && typeof updates.tags === 'string') {
      updates.tags = updates.tags.split(',').map((t: string) => t.trim());
    }

    const artifact = await Artifact.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    })
      .populate('museumId', 'name slug logo coverImage description')
      .populate('sectionId', 'name description coverImage')
      .populate('qrCodeId');

    if (!artifact) {
      res.status(404).json({ success: false, message: 'Artifact not found' });
      return;
    }

    res.json({ success: true, data: artifact });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateArtifactStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['DRAFT', 'PUBLISHED', 'ARCHIVED'].includes(status)) {
      res.status(400).json({ success: false, message: 'Invalid status value' });
      return;
    }

    const artifact = await Artifact.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    )
      .populate('museumId', 'name slug logo coverImage description')
      .populate('sectionId', 'name description coverImage')
      .populate('qrCodeId');

    if (!artifact) {
      res.status(404).json({ success: false, message: 'Artifact not found' });
      return;
    }

    res.json({ success: true, data: artifact });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteArtifact = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const artifact = await Artifact.findByIdAndDelete(id);

    if (!artifact) {
      res.status(404).json({ success: false, message: 'Artifact not found' });
      return;
    }

    // Delete associated QR code
    await QRCode.deleteMany({ artifactId: id });

    res.json({ success: true, message: 'Artifact and QR Code deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
