import mongoose from 'mongoose';
import { connectDB } from '../config/db';
import { User } from '../models/User';
import { Museum } from '../models/Museum';
import { Section } from '../models/Section';
import { Artifact } from '../models/Artifact';
import { QRCode } from '../models/QRCode';
import { QRService } from '../services/qrService';
import { Analytics } from '../models/Analytics';
import { SEED_USERS, SEED_MUSEUMS, SEED_ARTIFACTS } from '../utils/seedData';

export const seedDatabase = async () => {
  try {
    await connectDB();
    console.log('🧹 Clearing existing collections...');
    await User.deleteMany({});
    await Museum.deleteMany({});
    await Section.deleteMany({});
    await Artifact.deleteMany({});
    await QRCode.deleteMany({});
    await Analytics.deleteMany({});

    console.log('🏛️ Seeding Museums & Sections...');
    const museumMap = new Map<string, mongoose.Document & { _id: mongoose.Types.ObjectId; slug: string }>();
    const sectionMap = new Map<string, mongoose.Document & { _id: mongoose.Types.ObjectId; name: string }>();

    for (const mData of SEED_MUSEUMS) {
      const museum = await Museum.create({
        name: mData.name,
        slug: mData.slug,
        description: mData.description,
        logo: mData.logo,
        coverImage: mData.coverImage,
        address: mData.address,
        contact: mData.contact,
        openingHours: mData.openingHours,
        website: mData.website,
        isActive: true,
      });

      museumMap.set(mData.slug, museum as any);

      for (const sData of mData.sections) {
        const section = await Section.create({
          museumId: museum._id,
          name: sData.name,
          description: sData.description,
          coverImage: sData.coverImage,
          displayOrder: sData.displayOrder,
          isActive: true,
        });

        // Key by museumSlug + sectionName
        sectionMap.set(`${mData.slug}::${sData.name}`, section as any);
      }
    }

    console.log('👤 Seeding User Accounts...');
    for (const uData of SEED_USERS) {
      const userDoc: any = {
        name: uData.name,
        email: uData.email,
        password: uData.password,
        role: uData.role,
      };

      if (uData.museumSlug && museumMap.has(uData.museumSlug)) {
        userDoc.museumId = museumMap.get(uData.museumSlug)!._id;
      }

      const user = new User(userDoc);
      await user.save();
    }

    console.log('🏺 Seeding Artifacts & Generating QR Codes...');
    for (const aData of SEED_ARTIFACTS) {
      const museum = museumMap.get(aData.museumSlug);
      const section = sectionMap.get(`${aData.museumSlug}::${aData.sectionName}`);

      if (!museum || !section) {
        console.warn(`Skipping artifact ${aData.name}: missing museum or section mapping`);
        continue;
      }

      const artifact = new Artifact({
        museumId: museum._id,
        sectionId: section._id,
        shortCode: aData.shortCode,
        name: aData.name,
        shortDescription: aData.shortDescription,
        fullDescription: aData.fullDescription,
        richContent: aData.richContent,
        historicalInformation: aData.historicalInformation,
        datePeriod: aData.datePeriod,
        creatorOrigin: aData.creatorOrigin,
        locationInsideMuseum: aData.locationInsideMuseum,
        displayOrder: aData.displayOrder,
        tags: aData.tags,
        images: aData.images,
        audioNarration: aData.audioNarration,
        video: aData.video,
        additionalNotes: aData.additionalNotes,
        status: aData.status,
        viewCount: Math.floor(Math.random() * 300) + 75,
        scanCount: Math.floor(Math.random() * 150) + 30,
      });

      await artifact.save();

      // Automatically generate real canonical QR Code
      const qrData = await QRService.generateQRCode(artifact.shortCode);
      const qrCode = new QRCode({
        artifactId: artifact._id,
        museumId: artifact.museumId,
        shortCode: artifact.shortCode,
        publicUrl: qrData.publicUrl,
        qrImageUrl: qrData.qrImageUrl,
        svgContent: qrData.svgContent,
        scanCount: artifact.scanCount,
        lastScannedAt: new Date(Date.now() - Math.random() * 86400000 * 3),
      });

      await qrCode.save();

      artifact.qrCodeId = qrCode._id as any;
      await artifact.save();

      // Seed initial analytics telemetry
      const sources: ('QR' | 'WEB' | 'APP')[] = ['QR', 'QR', 'WEB', 'APP'];
      for (let i = 0; i < 14; i++) {
        const randomSource = sources[Math.floor(Math.random() * sources.length)];
        await Analytics.create({
          artifactId: artifact._id,
          museumId: artifact.museumId,
          sectionId: artifact.sectionId,
          eventType: randomSource === 'QR' ? 'QR_SCAN' : (i % 3 === 0 ? 'AUDIO_PLAY' : 'PAGE_VIEW'),
          source: randomSource,
          timestamp: new Date(Date.now() - Math.random() * 86400000 * 14),
          deviceType: Math.random() > 0.3 ? 'mobile' : 'desktop',
        });
      }
    }

    console.log('✅ Database Seed completed successfully!');
    console.log('================================================');
    console.log('👑 Super Admin: admin@museum.org / REDACTED_SEED_PASSWORD');
    console.log('🏛️ GMU Admin: curator@gmu.edu.in / REDACTED_SEED_PASSWORD');
    console.log(`🏛️ Total Museums Seeded: ${SEED_MUSEUMS.length}`);
    console.log(`🏺 Total Artifacts Seeded: ${SEED_ARTIFACTS.length}`);
    console.log('================================================');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  }
};

if (require.main === module) {
  seedDatabase().then(() => process.exit(0)).catch(() => process.exit(1));
}
