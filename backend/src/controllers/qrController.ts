import { Request, Response } from 'express';
import { QRCode } from '../models/QRCode';
import { Artifact } from '../models/Artifact';
import { QRService } from '../services/qrService';
import { AuthRequest } from '../middleware/auth';

export const getAllQRCodes = async (req: Request, res: Response): Promise<void> => {
  try {
    const { museumId, search } = req.query;
    const query: any = {};
    if (museumId) query.museumId = museumId;

    const qrCodes = await QRCode.find(query)
      .populate({
        path: 'artifactId',
        select: 'name shortCode status locationInsideMuseum displayOrder sectionId',
        populate: { path: 'sectionId', select: 'name' },
      })
      .populate('museumId', 'name slug logo')
      .sort({ createdAt: -1 });

    let filtered = qrCodes;
    if (search) {
      const s = String(search).toLowerCase();
      filtered = qrCodes.filter((qr: any) => {
        const artName = qr.artifactId?.name?.toLowerCase() || '';
        const museumName = qr.museumId?.name?.toLowerCase() || '';
        const shortCode = qr.shortCode?.toLowerCase() || '';
        return artName.includes(s) || museumName.includes(s) || shortCode.includes(s);
      });
    }

    res.json({ success: true, count: filtered.length, data: filtered });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getQRCodeByArtifactId = async (req: Request, res: Response): Promise<void> => {
  try {
    const { artifactId } = req.params;
    let qr = await QRCode.findOne({ artifactId })
      .populate('artifactId')
      .populate('museumId', 'name slug logo');

    if (!qr) {
      // If artifact exists but QR is missing, automatically generate it
      const artifact = await Artifact.findById(artifactId);
      if (!artifact) {
        res.status(404).json({ success: false, message: 'Artifact not found' });
        return;
      }

      const qrData = await QRService.generateQRCode(artifact.shortCode);
      qr = new QRCode({
        artifactId: artifact._id,
        museumId: artifact.museumId,
        shortCode: artifact.shortCode,
        publicUrl: qrData.publicUrl,
        qrImageUrl: qrData.qrImageUrl,
        svgContent: qrData.svgContent,
      });
      await qr.save();
      artifact.qrCodeId = qr._id as any;
      await artifact.save();
    }

    res.json({ success: true, data: qr });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const downloadQRPNG = async (req: Request, res: Response): Promise<void> => {
  try {
    const { shortCode } = req.params;
    const qr = await QRCode.findOne({ shortCode }).populate('artifactId', 'name');
    if (!qr) {
      res.status(404).json({ success: false, message: 'QR Code not found' });
      return;
    }

    const pngBuffer = await QRService.generatePNGStream(qr.publicUrl);
    const fileName = `qr-${shortCode}.png`;

    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.send(pngBuffer);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const downloadQRSVG = async (req: Request, res: Response): Promise<void> => {
  try {
    const { shortCode } = req.params;
    const qr = await QRCode.findOne({ shortCode });
    if (!qr) {
      res.status(404).json({ success: false, message: 'QR Code not found' });
      return;
    }

    const fileName = `qr-${shortCode}.svg`;
    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.send(qr.svgContent);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const regenerateQRCode = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { artifactId } = req.params;
    const artifact = await Artifact.findById(artifactId);
    if (!artifact) {
      res.status(404).json({ success: false, message: 'Artifact not found' });
      return;
    }

    const qrData = await QRService.generateQRCode(artifact.shortCode);
    const qr = await QRCode.findOneAndUpdate(
      { artifactId: artifact._id },
      {
        publicUrl: qrData.publicUrl,
        qrImageUrl: qrData.qrImageUrl,
        svgContent: qrData.svgContent,
      },
      { new: true, upsert: true }
    );

    res.json({ success: true, data: qr, message: 'QR Code regenerated successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
