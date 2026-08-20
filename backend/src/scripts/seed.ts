import mongoose from 'mongoose';
import { connectDB } from '../config/db';
import { User } from '../models/User';
import { Museum } from '../models/Museum';
import { Section } from '../models/Section';
import { Artifact } from '../models/Artifact';
import { QRCode } from '../models/QRCode';
import { QRService } from '../services/qrService';
import { Analytics } from '../models/Analytics';

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

    console.log('👤 Creating default administrators...');
    const superAdmin = new User({
      name: 'Super Administrator',
      email: 'admin@museum.org',
      password: 'REDACTED_SEED_PASSWORD',
      role: 'SUPER_ADMIN',
    });
    await superAdmin.save();

    console.log('🏛️ Creating GM University Heritage Museum...');
    const gmuMuseum = new Museum({
      name: 'GM University Heritage Museum',
      slug: 'gmu-heritage-museum',
      description:
        'A world-class university museum dedicated to preserving historical technological marvels, ancient manuscripts, classical art, and the rich cultural heritage of the region.',
      logo: 'https://images.unsplash.com/photo-1572953109213-3be62398eb95?auto=format&fit=crop&w=300&q=80',
      coverImage: 'https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?auto=format&fit=crop&w=1600&q=80',
      address: {
        street: 'University Main Boulevard, Heritage Campus',
        city: 'Davangere',
        state: 'Karnataka',
        country: 'India',
        postalCode: '577006',
      },
      contact: {
        email: 'heritage@gmu.edu.in',
        phone: '+91 8192 234567',
      },
      openingHours: 'Tuesday - Sunday: 9:30 AM - 5:30 PM (Closed on Mondays and National Holidays)',
      website: 'https://gmu.edu.in/heritage-museum',
      socialLinks: {
        facebook: 'https://facebook.com/gmuheritagemuseum',
        instagram: 'https://instagram.com/gmu_heritage',
        twitter: 'https://twitter.com/gmu_museum',
        youtube: 'https://youtube.com/@gmuheritagemuseum',
      },
    });
    await gmuMuseum.save();

    // Assign museum admin
    const museumAdmin = new User({
      name: 'Dr. Ananya Sharma',
      email: 'curator@gmu.edu.in',
      password: 'REDACTED_SEED_PASSWORD',
      role: 'MUSEUM_ADMIN',
      museumId: gmuMuseum._id as any,
    });
    await museumAdmin.save();

    console.log('📂 Creating Museum Sections / Galleries...');
    const secAncientTech = await Section.create({
      museumId: gmuMuseum._id,
      name: 'Ancient Technology & Engineering',
      description:
        'Exhibiting timekeeping instruments, hydrologic devices, early metallurgical furnaces, and mechanical innovations of ancient civilizations.',
      coverImage: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
      displayOrder: 1,
    });

    const secAstronomy = await Section.create({
      museumId: gmuMuseum._id,
      name: 'Astronomy & Rare Manuscripts',
      description:
        'Original palm-leaf treatises, celestial astrolabes, armillary spheres, and star charts dating from the 8th to 17th centuries.',
      coverImage: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80',
      displayOrder: 2,
    });

    const secSculptures = await Section.create({
      museumId: gmuMuseum._id,
      name: 'Classical Sculptures & Metallurgy',
      description:
        'Masterpieces of bronze casting (cire perdue), stone carvings, temple iconography, and numismatics.',
      coverImage: 'https://images.unsplash.com/photo-1544967082-d9d25d867d66?auto=format&fit=crop&w=800&q=80',
      displayOrder: 3,
    });

    const secFreedom = await Section.create({
      museumId: gmuMuseum._id,
      name: 'Freedom Struggle & Regional History',
      description:
        'Relics, underground printing presses, khadi textiles, and photographs documenting the regional freedom fighters.',
      coverImage: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&w=800&q=80',
      displayOrder: 4,
    });

    console.log('🏺 Creating Rich Exhibits & Generating QR Codes...');

    const sampleArtifacts = [
      {
        sectionId: secAncientTech._id,
        shortCode: 'art_8f29d2',
        name: 'Ancient Water Clock (Ghati Yantra / Clepsydra)',
        shortDescription:
          'A precision hydrodynamic timekeeping device used in ancient and medieval Indian observatories to measure 24-minute "Ghati" intervals.',
        fullDescription:
          'The Ghati Yantra is one of humanity’s earliest empirical precision instruments for measuring time independently of sunlight. This model consists of a calibrated copper bowl with a precision micro-orifice floating in a bronze reservoir. As water slowly fills the vessel through the bottom aperture, it sinks at an exact astronomical rate calculated by ancient mathematicians including Aryabhata and Varahamihira.',
        richContent: [
          {
            id: 'block-1',
            type: 'heading',
            content: 'How the Hydrodynamic Mechanism Works',
          },
          {
            id: 'block-2',
            type: 'paragraph',
            content:
              'The bowl has a specific calibrated volume and weight. When placed on calm water, hydrostatic pressure causes water to enter through the calibrated pinhole. Exactly 24 minutes (one Ghati, where 60 Ghatis equal 24 hours) are required for the bowl to submerge completely and strike the bottom gong.',
          },
          {
            id: 'block-3',
            type: 'bullet_list',
            items: [
              'Standard Unit: 1 Ghati = 24 minutes (3,600 Vipalas)',
              'Material: Pure beaten copper alloy with silver orifice lining',
              'Accuracy: Within ±12 seconds per 24-hour cycle when calibrated for water temperature',
              'Use: Astronomical observatories, temple rituals, and royal statecraft',
            ],
          },
          {
            id: 'block-4',
            type: 'quote',
            content:
              '“Time flows like water, but with the Clepsydra, man first learned to hold every drop in steady count.” — Suryasiddhanta commentary',
          },
        ],
        historicalInformation:
          'Described in detail in the 5th-century astronomical treatise Surya Siddhanta and the Panchasiddhantika of Varahamihira. This specific excavated vessel was recovered from an ancient temple observatory site and dates to the early 11th century CE.',
        datePeriod: 'c. 1020 CE (11th Century)',
        creatorOrigin: 'Chalukyan Guild of Mechanical Artisans (Kalyana)',
        locationInsideMuseum: 'Gallery 2 (Ancient Tech), Stand 14',
        displayOrder: 1,
        tags: ['Timekeeping', 'Engineering', 'Hydrodynamics', 'Astronomy', 'Bronze Age'],
        images: [
          {
            url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80',
            caption: 'The copper Ghati bowl resting in its calibrated water immersion reservoir',
            isCover: true,
          },
          {
            url: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=1200&q=80',
            caption: 'Detailed view of the precision perforated orifice and engraved calibrations',
            isCover: false,
          },
        ],
        audioNarration: {
          url: 'https://actions.google.com/sounds/v1/water/water_dripping_in_cave.ogg',
          title: 'Audio Guide: The Rhythm of Water Clock Mechanics',
          duration: 145,
          transcript:
            'Welcome to Exhibit 14. Before mechanical pendulum clocks existed, ancient astronomers looked to steady liquid flow to mark the passage of day and night. Listen closely to how a simple perforated copper vessel transformed time into a mathematical science...',
        },
        video: {
          url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
          posterUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
          title: 'Demonstration: The 24-Minute Sinking Cycle of the Clepsydra',
          duration: 15,
        },
        additionalNotes: 'Keep display temperature between 20°C - 24°C to prevent copper oxidation.',
        status: 'PUBLISHED',
      },
      {
        sectionId: secAstronomy._id,
        shortCode: 'art_a4f10e',
        name: 'Brass Astrolabe with Celestial Coordinates',
        shortDescription:
          'A two-dimensional model of the celestial sphere used by medieval navigators and astronomers to determine local time, latitude, and stellar positions.',
        fullDescription:
          'This exceptional brass astrolabe is an intricate analogue computer. It features engraved plates (tympan) for specific geographical latitudes, an openwork rete showing 28 principal guide stars, and an alidade on the reverse for sighting altitude of celestial bodies.',
        richContent: [
          {
            id: 'b-1',
            type: 'heading',
            content: 'The Instrument of Navigators & Stargazers',
          },
          {
            id: 'b-2',
            type: 'paragraph',
            content:
              'By rotating the delicate rete over the coordinate plate, the astronomer could simulate the apparent rotation of the night sky, calculate the exact sunrise/sunset times, and navigate oceans without compasses.',
          },
          {
            id: 'b-3',
            type: 'bullet_list',
            items: [
              'Diameter: 22.4 cm',
              'Engravings: Sanskrit and Persian astrological inscriptions',
              'Limb & Mater: Heavy cast bell-metal with 360-degree precision graduations',
            ],
          },
        ],
        historicalInformation:
          'Crafted during the reign of Emperor Akbar at the Lahore astronomical instrument workshops, renowned across Asia and Europe for producing the finest scientific brass instruments of the era.',
        datePeriod: '1588 CE (16th Century)',
        creatorOrigin: 'Master Craftsman Muhammad Muqim (Imperial Workshops)',
        locationInsideMuseum: 'Gallery 3 (Astronomy), Central Showcase 02',
        displayOrder: 1,
        tags: ['Astronomy', 'Navigation', 'Brass', 'Instruments', 'Renaissance'],
        images: [
          {
            url: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1200&q=80',
            caption: 'Front face showing the intricate star pointers of the celestial rete',
            isCover: true,
          },
          {
            url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
            caption: 'Reverse side showing the shadow square and altitude measuring alidade',
            isCover: false,
          },
        ],
        audioNarration: {
          url: 'https://actions.google.com/sounds/v1/science/radar_screen.ogg',
          title: 'Audio Guide: Unlocking the Heavens with Brass Gears',
          duration: 180,
          transcript:
            'You are standing in front of the ultimate analogue computer of the 16th century. Long before microchips, scholars used this disk to read the stars...',
        },
        video: {
          url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
          posterUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80',
          title: 'Rotating the Rete: Celestial Spheres in Action',
          duration: 15,
        },
        additionalNotes: 'Gifted by the Royal Asiatic Society Collection in 1974.',
        status: 'PUBLISHED',
      },
      {
        sectionId: secAstronomy._id,
        shortCode: 'art_7e20b4',
        name: 'Palm Leaf Ayurvedic Botanical Treatise (Tala-patra)',
        shortDescription:
          'Rare 14th-century palm leaf folio codex inscribed with iron stylus detailing 400 medicinal flora and surgical procedures.',
        fullDescription:
          'Written in early Kannada script on specially cured leaves of the Borassus flabellifer (Palmyra palm), this manuscript survived through treatment with natural oils and charcoal ink rubbing. It includes hand-etched anatomical diagrams, medicinal formulas, and herbal taxonomy.',
        richContent: [
          {
            id: 'b-1',
            type: 'heading',
            content: 'The Art of Palm Leaf Preservation',
          },
          {
            id: 'b-2',
            type: 'paragraph',
            content:
              'Each leaf was boiled in turmeric water, dried in the shade for several months, polished with smooth cowrie shells, and inscribed using a sharp iron stylus (Gantam). Black lamp soot was rubbed across the engravings to make the letters permanently legible.',
          },
        ],
        historicalInformation:
          'Originating from a monastic library in Sringeri, this manuscript has provided scholars with critical evidence of advanced regional medical knowledge predating Western botanical classifications.',
        datePeriod: '1380 CE (14th Century)',
        creatorOrigin: 'Scholar Physician Vidyaranya Sampradaya',
        locationInsideMuseum: 'Gallery 4 (Rare Archives), Climate Vault 01',
        displayOrder: 2,
        tags: ['Manuscript', 'Medicine', 'Ayurveda', 'Botanical', 'Literature'],
        images: [
          {
            url: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=1200&q=80',
            caption: 'Complete palm leaf bundle bound with raw silk cords and wooden protective covers',
            isCover: true,
          },
        ],
        audioNarration: {
          url: 'https://actions.google.com/sounds/v1/ambiences/library.ogg',
          title: 'Audio Guide: The Scribes of Palmyra',
          duration: 120,
          transcript:
            'Touchless sensors protect these fragile 600-year-old palm leaves. Hear the fascinating story of how ancient scholars preserved medical wisdom before paper was ever manufactured in the region...',
        },
        video: {
          url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
          posterUrl: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=800&q=80',
          title: 'Stylus Inscription Technique Demonstration',
          duration: 15,
        },
        additionalNotes: 'Requires strict RH (Relative Humidity) of 45-55% and UV filtration.',
        status: 'PUBLISHED',
      },
      {
        sectionId: secSculptures._id,
        shortCode: 'art_5d81c2',
        name: 'Chola Bronze Dancing Shiva (Nataraja)',
        shortDescription:
          'A classic lost-wax bronze sculpture representing the cosmic dance of creation, preservation, and dissolution.',
        fullDescription:
          'Regarded as one of the supreme achievements of global sculpture, this bronze depicts Shiva surrounded by the ring of flames (Prabhamandala), holding the Damaru drum of creation in his upper right hand and Agni (fire) in his left, with his foot subduing Apasmara (the dwarf of ignorance).',
        richContent: [
          {
            id: 'b-1',
            type: 'heading',
            content: 'Iconography and Sacred Geometry',
          },
          {
            id: 'b-2',
            type: 'paragraph',
            content:
              'The Nataraja bronze conforms to exact Shilpa Shastra proportions based on the Navatala system. The serene facial expression contrasts dynamically with the whirling locks containing Ganga and the crescent moon.',
          },
        ],
        historicalInformation:
          'Cast in the Thanjavur region during the high Chola period. Metallurgical spectroscopy shows an alloy of copper, tin, lead, silver, and gold (Panchaloha).',
        datePeriod: 'c. 1100 CE (12th Century)',
        creatorOrigin: 'Imperial Chola Sthapati Artisans',
        locationInsideMuseum: 'Gallery 1 (Sculpture Hall), Center Rotunda',
        displayOrder: 1,
        tags: ['Bronze', 'Sculpture', 'Chola', 'Iconography', 'Sacred Art'],
        images: [
          {
            url: 'https://images.unsplash.com/photo-1544967082-d9d25d867d66?auto=format&fit=crop&w=1200&q=80',
            caption: 'Frontal view of Nataraja in the cosmic Anandatandava stance',
            isCover: true,
          },
        ],
        audioNarration: {
          url: 'https://actions.google.com/sounds/v1/foley/temple_bell.ogg',
          title: 'Audio Guide: The Five Cosmic Activities of Nataraja',
          duration: 160,
          transcript:
            'Stand before this timeless bronze. Physicist Fritjof Capra famously compared this dance to the dance of subatomic particles...',
        },
        additionalNotes: 'Inspected for bronze disease biannually.',
        status: 'PUBLISHED',
      },
      {
        sectionId: secFreedom._id,
        shortCode: 'art_3b69e7',
        name: 'Underground Freedom Movement Treadle Printing Press',
        shortDescription:
          'A hand-operated cast iron treadle press used by regional freedom fighters in 1942 to secretly print nationalist pamphlets during the Quit India Movement.',
        fullDescription:
          'Hidden inside a rural grain mill to evade colonial police confiscation, this Chandler & Price style cast-iron press churned out over 50,000 underground freedom bulletins, speeches, and patriotic poetry in Kannada and English before being safely relocated after independence.',
        richContent: [
          {
            id: 'b-1',
            type: 'heading',
            content: 'Words as Weapons of Liberty',
          },
          {
            id: 'b-2',
            type: 'paragraph',
            content:
              'Operated in total darkness with muffled foot treadles, patriots typed lead movable type and distributed leaflets at railway stations and village markets under the cover of night.',
          },
        ],
        historicalInformation:
          'Donated to the university museum by the family of freedom fighter Sri K. R. Bellary in 1982.',
        datePeriod: '1938-1947 CE',
        creatorOrigin: 'Donated by Davangere Freedom Heritage Trust',
        locationInsideMuseum: 'Hall 5 (Modern Heritage), Stand 04',
        displayOrder: 1,
        tags: ['Freedom Struggle', 'Printing Press', 'Modern History', 'Patriotic'],
        images: [
          {
            url: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&w=1200&q=80',
            caption: 'The restored cast iron printing press with ink rollers and flywheel',
            isCover: true,
          },
        ],
        audioNarration: {
          url: 'https://actions.google.com/sounds/v1/household/typewriter_slow.ogg',
          title: 'Audio Guide: Midnight Presses of the Freedom Fighters',
          duration: 135,
          transcript:
            'In August 1942, the sound of this press was a dangerous whisper that defied colonial censorship. Listen to the dramatic true story of how young students risked their lives...',
        },
        additionalNotes: 'Functional mechanical condition.',
        status: 'PUBLISHED',
      },
    ];

    for (const artData of sampleArtifacts) {
      const artifact = new Artifact({
        ...artData,
        museumId: gmuMuseum._id,
        viewCount: Math.floor(Math.random() * 250) + 50,
        scanCount: Math.floor(Math.random() * 120) + 20,
      });

      await artifact.save();

      // Generate corresponding QR code with canonical public URL
      const qrData = await QRService.generateQRCode(artifact.shortCode);
      const qrCode = new QRCode({
        artifactId: artifact._id,
        museumId: gmuMuseum._id,
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

      // Seed initial analytics events
      for (let i = 0; i < 15; i++) {
        const sources: ('QR' | 'WEB' | 'APP')[] = ['QR', 'QR', 'WEB', 'APP'];
        const randomSource = sources[Math.floor(Math.random() * sources.length)];
        await Analytics.create({
          artifactId: artifact._id,
          museumId: gmuMuseum._id,
          sectionId: artifact.sectionId,
          eventType: randomSource === 'QR' ? 'QR_SCAN' : 'PAGE_VIEW',
          source: randomSource,
          timestamp: new Date(Date.now() - Math.random() * 86400000 * 14),
          deviceType: Math.random() > 0.3 ? 'mobile' : 'desktop',
        });
      }
    }

    console.log('✅ Seed completed successfully!');
    console.log('================================================');
    console.log('👑 Super Admin: admin@museum.org / REDACTED_SEED_PASSWORD');
    console.log('🏛️ Museum Admin: curator@gmu.edu.in / REDACTED_SEED_PASSWORD');
    console.log(`🏛️ Museum: GM University Heritage Museum (Slug: gmu-heritage-museum)`);
    console.log(`🏺 Total Artifacts Seeded: ${sampleArtifacts.length}`);
    console.log('================================================');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  }
};

// If run directly via CLI
if (require.main === module) {
  seedDatabase().then(() => process.exit(0));
}
