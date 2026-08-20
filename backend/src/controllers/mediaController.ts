import { Request, Response } from 'express';
import { Media } from '../models/Media';
import { getMediaStorageService } from '../services/mediaService';
import { AuthRequest } from '../middleware/auth';

export const uploadMedia = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, message: 'No file provided' });
      return;
    }

    const { museumId, artifactId } = req.body;
    const storageService = getMediaStorageService();

    const result = await storageService.uploadFile(req.file, 'museum_guide');

    const mediaDoc = new Media({
      museumId: museumId || undefined,
      artifactId: artifactId || undefined,
      url: result.url,
      publicId: result.publicId,
      mediaType: result.mediaType,
      fileName: result.fileName,
      fileSize: result.fileSize,
      mimeType: result.mimeType,
      thumbnailUrl: result.thumbnailUrl,
      duration: result.duration || 0,
      metadata: result.metadata,
    });

    await mediaDoc.save();

    res.status(201).json({
      success: true,
      data: mediaDoc,
      message: 'Media uploaded successfully',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMediaList = async (req: Request, res: Response): Promise<void> => {
  try {
    const { museumId, mediaType, page = '1', limit = '30' } = req.query;
    const query: any = {};

    if (museumId) query.museumId = museumId;
    if (mediaType) query.mediaType = mediaType;

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await Media.countDocuments(query);
    const media = await Media.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.json({
      success: true,
      data: media,
      pagination: {
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteMedia = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const media = await Media.findById(id);

    if (!media) {
      res.status(404).json({ success: false, message: 'Media record not found' });
      return;
    }

    const storageService = getMediaStorageService();
    await storageService.deleteFile(media.publicId, media.mediaType);
    await Media.findByIdAndDelete(id);

    res.json({ success: true, message: 'Media file removed successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
