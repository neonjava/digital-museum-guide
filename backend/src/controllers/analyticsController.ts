import { Request, Response } from 'express';
import { Analytics, TrafficSource, EventType } from '../models/Analytics';
import { Artifact } from '../models/Artifact';
import { QRCode } from '../models/QRCode';
import mongoose from 'mongoose';

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

    const event = new Analytics({
      artifactId: artifactId || undefined,
      museumId,
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
    const museumObjectId = new mongoose.Types.ObjectId(museumId);

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

    // 2. Traffic source breakdown
    const sourceBreakdown = await Analytics.aggregate([
      { $match: { museumId: museumObjectId } },
      { $group: { _id: '$source', count: { $sum: 1 } } },
    ]);

    // 3. Top viewed artifacts
    const topViewedArtifacts = await Artifact.find({ museumId: museumObjectId, status: 'PUBLISHED' })
      .sort({ viewCount: -1 })
      .limit(6)
      .select('name shortCode viewCount scanCount images locationInsideMuseum');

    // 4. Top scanned artifacts
    const topScannedArtifacts = await Artifact.find({ museumId: museumObjectId, status: 'PUBLISHED' })
      .sort({ scanCount: -1 })
      .limit(6)
      .select('name shortCode viewCount scanCount images locationInsideMuseum');

    // 5. Recent events (latest 10)
    const recentActivity = await Analytics.find({ museumId: museumObjectId })
      .populate('artifactId', 'name shortCode')
      .sort({ timestamp: -1 })
      .limit(10);

    res.json({
      success: true,
      data: {
        summary: {
          totalViews,
          totalQRScans,
          totalAudioPlays,
        },
        sources: sourceBreakdown.reduce((acc: any, curr: any) => {
          acc[curr._id] = curr.count;
          return acc;
        }, {}),
        topViewedArtifacts,
        topScannedArtifacts,
        recentActivity,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
