import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Analytics, TrafficSource, EventType } from '../models/Analytics';
import { Museum } from '../models/Museum';
import { Artifact } from '../models/Artifact';
import { QRCode } from '../models/QRCode';

export const trackEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      artifactId,
      museumId,
      sectionId,
      eventType = 'PAGE_VIEW',
      source = 'WEB',
    } = req.body;

    if (!museumId) {
      res.status(400).json({ success: false, message: 'Museum ID is required' });
      return;
    }

    let validMuseumId = museumId;
    if (!mongoose.Types.ObjectId.isValid(museumId)) {
      const museum = await Museum.findOne({ slug: String(museumId).toLowerCase() });
      if (museum) {
        validMuseumId = museum._id;
      }
    }

    const event = new Analytics({
      artifactId: artifactId || undefined,
      museumId: validMuseumId,
      sectionId: sectionId || undefined,
      eventType: eventType as EventType,
      source: (['QR', 'WEB', 'APP'].includes(source) ? source : 'WEB') as TrafficSource,
      userAgent: req.headers['user-agent'] || '',
      referrer: req.headers.referer || '',
    });

    await event.save();

    // Increment artifact view or scan counters
    if (artifactId) {
      const updateDoc: any = {};
      if (eventType === 'PAGE_VIEW') {
        updateDoc.$inc = { viewCount: 1 };
      } else if (eventType === 'QR_SCAN') {
        updateDoc.$inc = { scanCount: 1, viewCount: 1 };
      }

      if (Object.keys(updateDoc).length > 0) {
        await Artifact.findByIdAndUpdate(artifactId, updateDoc);
      }

      if (eventType === 'QR_SCAN') {
        await QRCode.findOneAndUpdate(
          { artifactId },
          { $inc: { scanCount: 1 }, $set: { lastScannedAt: new Date() } }
        );
      }
    }

    res.status(201).json({ success: true, message: 'Event tracked' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMuseumAnalytics = async (req: Request, res: Response): Promise<void> => {
  try {
    const { museumId } = req.params;
    let museumObjectId: mongoose.Types.ObjectId;

    if (mongoose.Types.ObjectId.isValid(museumId)) {
      museumObjectId = new mongoose.Types.ObjectId(museumId);
    } else {
      const museum = await Museum.findOne({ slug: museumId.toLowerCase() });
      if (!museum) {
        res.status(404).json({ success: false, message: 'Museum not found' });
        return;
      }
      museumObjectId = museum._id as mongoose.Types.ObjectId;
    }

    // 1. Total events breakdown
    const totalViews = await Analytics.countDocuments({
      museumId: museumObjectId,
      eventType: 'PAGE_VIEW',
    });

    const totalQRScans = await Analytics.countDocuments({
      museumId: museumObjectId,
      eventType: 'QR_SCAN',
    });

    const totalAudioPlays = await Analytics.countDocuments({
      museumId: museumObjectId,
      eventType: 'AUDIO_PLAY',
    });

    const totalVideoPlays = await Analytics.countDocuments({
      museumId: museumObjectId,
      eventType: 'VIDEO_PLAY',
    });

    // 2. Traffic source breakdown
    const sourceBreakdown = await Analytics.aggregate([
      { $match: { museumId: museumObjectId } },
      { $group: { _id: '$source', count: { $sum: 1 } } },
    ]);

    const sourceMap = {
      QR: 0,
      WEB: 0,
      APP: 0,
      ...sourceBreakdown.reduce((acc: any, curr: any) => {
        acc[curr._id] = curr.count;
        return acc;
      }, {}),
    };

    // 3. Top viewed artifacts
    const topViewedArtifacts = await Artifact.find({ museumId: museumObjectId, status: 'PUBLISHED' })
      .sort({ viewCount: -1 })
      .limit(6)
      .select('name shortCode viewCount scanCount images locationInsideMuseum datePeriod');

    // 4. Top scanned artifacts
    const topScannedArtifacts = await Artifact.find({ museumId: museumObjectId, status: 'PUBLISHED' })
      .sort({ scanCount: -1 })
      .limit(6)
      .select('name shortCode viewCount scanCount images locationInsideMuseum datePeriod');

    // 5. Recent events (latest 15)
    const recentActivity = await Analytics.find({ museumId: museumObjectId })
      .populate('artifactId', 'name shortCode')
      .sort({ timestamp: -1 })
      .limit(15);

    res.json({
      success: true,
      data: {
        summary: {
          totalViews,
          totalQRScans,
          totalAudioPlays,
          totalVideoPlays,
          totalEvents: totalViews + totalQRScans + totalAudioPlays + totalVideoPlays,
        },
        sources: sourceMap,
        topViewedArtifacts,
        topScannedArtifacts,
        recentActivity,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
