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

    // ==========================================
    // 🏛️ MUSEUM 1: GM University Heritage Museum
    // ==========================================
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

    const museumAdmin = new User({
      name: 'Dr. Ananya Sharma',
      email: 'curator@gmu.edu.in',
      password: 'REDACTED_SEED_PASSWORD',
      role: 'MUSEUM_ADMIN',
      museumId: gmuMuseum._id as any,
    });
    await museumAdmin.save();

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

    // ==========================================
    // 🏛️ MUSEUM 2: National Science & Aerospace Museum
    // ==========================================
    console.log('🏛️ Creating National Science & Aerospace Museum...');
    const sciMuseum = new Museum({
      name: 'National Science & Aerospace Museum',
      slug: 'national-science-aerospace',
      description:
        'Showcasing India’s pioneering aerospace achievements, rocket prototypes, robotic innovations, and quantum physics explorations.',
      logo: 'https://images.unsplash.com/photo-1517976487508-466d7bc03632?auto=format&fit=crop&w=300&q=80',
      coverImage: 'https://images.unsplash.com/photo-1517976487508-466d7bc03632?auto=format&fit=crop&w=1600&q=80',
      address: {
        street: 'HAL Airport Road, Science City',
        city: 'Bengaluru',
        state: 'Karnataka',
        country: 'India',
        postalCode: '560017',
      },
      contact: {
        email: 'info@aerospacemuseum.gov.in',
        phone: '+91 80 2522 8899',
      },
      openingHours: 'Wednesday - Monday: 10:00 AM - 6:00 PM (Closed on Tuesdays)',
      website: 'https://aerospacemuseum.gov.in',
    });
    await sciMuseum.save();

    const secSpace = await Section.create({
      museumId: sciMuseum._id,
      name: 'Space Exploration & Rocketry',
      description:
        'Historical sounding rockets, lunar rover landing apparatus, liquid propellant engines, and telemetry tracking arrays.',
      coverImage: 'https://images.unsplash.com/photo-1517976487508-466d7bc03632?auto=format&fit=crop&w=800&q=80',
      displayOrder: 1,
    });

    const secRobotics = await Section.create({
      museumId: sciMuseum._id,
      name: 'Quantum Physics & Robotics',
      description:
        'Superconducting cryostats, autonomous rovers, bionic limbs, and quantum key distribution testbeds.',
      coverImage: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80',
      displayOrder: 2,
    });

    // ==========================================
    // 🏛️ MUSEUM 3: Deccan Royal Arts & Cultural Heritage Museum
    // ==========================================
    console.log('🏛️ Creating Deccan Royal Arts & Cultural Heritage Museum...');
    const royalMuseum = new Museum({
      name: 'Deccan Royal Arts & Cultural Heritage Museum',
      slug: 'deccan-royal-arts',
      description:
        'Preserving the grandeur of Vijayanagara, Bahmani, and Mysore royal arts, gilded weaponry, gold leaf miniature paintings, and silk textiles.',
      logo: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&w=300&q=80',
      coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
      address: {
        street: 'Palace Grounds, Heritage Heritage Complex',
        city: 'Mysuru',
        state: 'Karnataka',
        country: 'India',
        postalCode: '570001',
      },
      contact: {
        email: 'curator@deccanroyalarts.org',
        phone: '+91 821 242 3344',
      },
      openingHours: 'Everyday: 9:00 AM - 5:30 PM',
      website: 'https://deccanroyalarts.org',
    });
    await royalMuseum.save();

    const secRoyalArmor = await Section.create({
      museumId: royalMuseum._id,
      name: 'Imperial Arms & Royal Metallurgy',
      description:
        'Wootz steel swords, damascened daggers, gold-inlaid armor, and cavalry regalia of Deccan rulers.',
      coverImage: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&w=800&q=80',
      displayOrder: 1,
    });

    const secPaintings = await Section.create({
      museumId: royalMuseum._id,
      name: 'Classical Gold Leaf Paintings & Ganjifa',
      description:
        'Traditional Mysore gesso paintings embossed with 24k gold leaf, semi-precious gems, and circular playing cards.',
      coverImage: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80',
      displayOrder: 2,
    });

    // ==========================================
    // 🏺 ALL ARTIFACTS & QR CODES
    // ==========================================
    console.log('🏺 Creating Exhibits & Generating QR Codes across all museums...');

    const allArtifactsData = [
      // --- GMU Museum Exhibits ---
      {
        museumId: gmuMuseum._id,
        sectionId: secAncientTech._id,
        shortCode: 'art_8f29d2',
        name: 'Ancient Water Clock (Ghati Yantra / Clepsydra)',
        shortDescription:
          'A precision hydrodynamic timekeeping device used in ancient and medieval Indian observatories to measure 24-minute "Ghati" intervals.',
        fullDescription:
          'The Ghati Yantra is one of humanity’s earliest empirical precision instruments for measuring time independently of sunlight. This model consists of a calibrated copper bowl with a precision micro-orifice floating in a bronze reservoir.',
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
              'The bowl has a specific calibrated volume and weight. When placed on calm water, hydrostatic pressure causes water to enter through the calibrated pinhole. Exactly 24 minutes (one Ghati) are required for the bowl to submerge completely and strike the bottom gong.',
          },
        ],
        historicalInformation:
          'Described in detail in the 5th-century astronomical treatise Surya Siddhanta and the Panchasiddhantika of Varahamihira.',
        datePeriod: 'c. 1020 CE (11th Century)',
        creatorOrigin: 'Chalukyan Guild of Mechanical Artisans (Kalyana)',
        locationInsideMuseum: 'Gallery 2 (Ancient Tech), Stand 14',
        displayOrder: 1,
        tags: ['Timekeeping', 'Engineering', 'Hydrodynamics', 'Astronomy'],
        images: [
          {
            url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80',
            caption: 'The copper Ghati bowl resting in its calibrated water immersion reservoir',
            isCover: true,
          },
        ],
        audioNarration: {
          url: 'https://actions.google.com/sounds/v1/water/water_dripping_in_cave.ogg',
          title: 'Audio Guide: The Rhythm of Water Clock Mechanics',
          duration: 145,
          transcript:
            'Welcome to Exhibit 14. Before mechanical pendulum clocks existed, ancient astronomers looked to steady liquid flow to mark the passage of day and night...',
        },
        video: {
          url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
          posterUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
          title: 'Demonstration: The 24-Minute Sinking Cycle',
          duration: 15,
        },
        status: 'PUBLISHED',
      },
      {
        museumId: gmuMuseum._id,
        sectionId: secAstronomy._id,
        shortCode: 'art_a4f10e',
        name: 'Brass Astrolabe with Celestial Coordinates',
        shortDescription:
          'A two-dimensional model of the celestial sphere used by medieval navigators and astronomers to determine local time, latitude, and stellar positions.',
        fullDescription:
          'This exceptional brass astrolabe is an intricate analogue computer. It features engraved plates (tympan) for specific geographical latitudes and an openwork rete showing 28 principal guide stars.',
        historicalInformation:
          'Crafted during the reign of Emperor Akbar at the Lahore astronomical instrument workshops.',
        datePeriod: '1588 CE (16th Century)',
        creatorOrigin: 'Master Craftsman Muhammad Muqim (Imperial Workshops)',
        locationInsideMuseum: 'Gallery 3 (Astronomy), Central Showcase 02',
        displayOrder: 1,
        tags: ['Astronomy', 'Navigation', 'Brass', 'Instruments'],
        images: [
          {
            url: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1200&q=80',
            caption: 'Front face showing the intricate star pointers of the celestial rete',
            isCover: true,
          },
        ],
        audioNarration: {
          url: 'https://actions.google.com/sounds/v1/science/radar_screen.ogg',
          title: 'Audio Guide: Unlocking the Heavens with Brass Gears',
          duration: 180,
          transcript:
            'You are standing in front of the ultimate analogue computer of the 16th century. Long before microchips, scholars used this disk to read the stars...',
        },
        status: 'PUBLISHED',
      },
      {
        museumId: gmuMuseum._id,
        sectionId: secAstronomy._id,
        shortCode: 'art_7e20b4',
        name: 'Palm Leaf Ayurvedic Botanical Treatise (Tala-patra)',
        shortDescription:
          'Rare 14th-century palm leaf folio codex inscribed with iron stylus detailing 400 medicinal flora and surgical procedures.',
        fullDescription:
          'Written in early Kannada script on specially cured leaves of the Palmyra palm, this manuscript survived through treatment with natural oils and charcoal ink rubbing.',
        datePeriod: '1380 CE (14th Century)',
        creatorOrigin: 'Scholar Physician Vidyaranya Sampradaya',
        locationInsideMuseum: 'Gallery 4 (Rare Archives), Climate Vault 01',
        displayOrder: 2,
        tags: ['Manuscript', 'Medicine', 'Ayurveda', 'Botanical'],
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
        },
        status: 'PUBLISHED',
      },
      {
        museumId: gmuMuseum._id,
        sectionId: secSculptures._id,
        shortCode: 'art_5d81c2',
        name: 'Chola Bronze Dancing Shiva (Nataraja)',
        shortDescription:
          'A classic lost-wax bronze sculpture representing the cosmic dance of creation, preservation, and dissolution.',
        fullDescription:
          'Regarded as one of the supreme achievements of global sculpture, this bronze depicts Shiva surrounded by the ring of flames (Prabhamandala).',
        datePeriod: 'c. 1100 CE (12th Century)',
        creatorOrigin: 'Imperial Chola Sthapati Artisans',
        locationInsideMuseum: 'Gallery 1 (Sculpture Hall), Center Rotunda',
        displayOrder: 1,
        tags: ['Bronze', 'Sculpture', 'Chola', 'Iconography'],
        images: [
          {
            url: 'https://images.unsplash.com/photo-1544967082-d9d25d867d66?auto=format&fit=crop&w=1200&q=80',
            caption: 'Frontal view of Nataraja in the cosmic Anandatandava stance',
            isCover: true,
          },
        ],
        status: 'PUBLISHED',
      },
      {
        museumId: gmuMuseum._id,
        sectionId: secFreedom._id,
        shortCode: 'art_3b69e7',
        name: 'Underground Freedom Movement Treadle Printing Press',
        shortDescription:
          'A hand-operated cast iron treadle press used by regional freedom fighters in 1942 to secretly print nationalist pamphlets during the Quit India Movement.',
        fullDescription:
          'Hidden inside a rural grain mill to evade colonial police confiscation, this press churned out over 50,000 underground freedom bulletins.',
        datePeriod: '1938-1947 CE',
        creatorOrigin: 'Donated by Davangere Freedom Heritage Trust',
        locationInsideMuseum: 'Hall 5 (Modern Heritage), Stand 04',
        displayOrder: 1,
        tags: ['Freedom Struggle', 'Printing Press', 'Modern History'],
        images: [
          {
            url: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&w=1200&q=80',
            caption: 'The restored cast iron printing press with ink rollers and flywheel',
            isCover: true,
          },
        ],
        status: 'PUBLISHED',
      },

      // --- Science & Aerospace Museum Exhibits ---
      {
        museumId: sciMuseum._id,
        sectionId: secSpace._id,
        shortCode: 'art_9c3b1a',
        name: 'Rohini-75 Sounding Rocket Launch Prototype',
        shortDescription:
          'First indigenously fabricated single-stage sounding rocket launched from Thumba Equatorial Rocket Launching Station in 1967.',
        fullDescription:
          'Marking the birth of the nation’s space program, the Rohini RH-75 had a diameter of 75mm and carried 1 kg of solid fuel to probe meteorological conditions in the upper ionosphere.',
        datePeriod: '1967 CE',
        creatorOrigin: 'Indian Space Research Programme (TERLS)',
        locationInsideMuseum: 'Space Pavilion, Launch Stand 01',
        displayOrder: 1,
        tags: ['Aerospace', 'Rocketry', 'Sounding Rocket', 'ISRO'],
        images: [
          {
            url: 'https://images.unsplash.com/photo-1517976487508-466d7bc03632?auto=format&fit=crop&w=1200&q=80',
            caption: 'Scale prototype of the RH-75 on mobile launch rail',
            isCover: true,
          },
        ],
        audioNarration: {
          url: 'https://actions.google.com/sounds/v1/science/radar_screen.ogg',
          title: 'Audio Guide: From Thumba Beach to the Stars',
          duration: 150,
          transcript:
            'In November 1967, scientists wheeled rocket components on bicycles through coconut groves. Hear the iconic story of India’s first rocket launch...',
        },
        status: 'PUBLISHED',
      },
      {
        museumId: sciMuseum._id,
        sectionId: secRobotics._id,
        shortCode: 'art_6b2d91',
        name: 'Superconducting Transmon Qubit Cryostat Chamber',
        shortDescription:
          'Dilution refrigerator apparatus that cools quantum circuits to 15 millikelvin (-273.135°C), near absolute zero, to preserve quantum superposition.',
        fullDescription:
          'Using a closed-cycle helium-3 / helium-4 dilution loop, this gold-plated cryogenic tower isolates sensitive quantum bits from electromagnetic noise and thermal fluctuations.',
        datePeriod: '2023 CE',
        creatorOrigin: 'Quantum Computing Laboratory, IISc & TIFR',
        locationInsideMuseum: 'Quantum Tech Hall, Chamber 03',
        displayOrder: 1,
        tags: ['Quantum Physics', 'Cryogenics', 'Computing', 'Superconductivity'],
        images: [
          {
            url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80',
            caption: 'Gilded multi-stage cryogenic refrigeration chandelier',
            isCover: true,
          },
        ],
        status: 'PUBLISHED',
      },

      // --- Deccan Royal Arts Museum Exhibits ---
      {
        museumId: royalMuseum._id,
        sectionId: secRoyalArmor._id,
        shortCode: 'art_1a7f3e',
        name: 'Gilded Wootz Steel Royal Khanjar Dagger',
        shortDescription:
          'High-carbon crucible Wootz steel dagger with nephrite jade hilt inlaid with rubies and gold koftgari damascening.',
        fullDescription:
          'Forged in southern Karnataka, this curved double-edged blade displays the famous crystalline water-pattern characteristic of ancient Wootz metallurgy.',
        datePeriod: 'c. 1560 CE (16th Century)',
        creatorOrigin: 'Vijayanagara Royal Armory (Hampi)',
        locationInsideMuseum: 'Royal Armory Vault, Showcase 05',
        displayOrder: 1,
        tags: ['Wootz Steel', 'Weapons', 'Vijayanagara', 'Jeweled'],
        images: [
          {
            url: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&w=1200&q=80',
            caption: 'The water-patterned Wootz blade with carved jade horse-head pommel',
            isCover: true,
          },
        ],
        status: 'PUBLISHED',
      },
      {
        museumId: royalMuseum._id,
        sectionId: secPaintings._id,
        shortCode: 'art_2c8b4f',
        name: 'Mysore Traditional Gold Leaf Ganjifa Card Deck',
        shortDescription:
          'Circular 96-card playing deck hand-painted on lacquered cloth discs with 24-karat pure gold leaf embossing (Gesso work).',
        fullDescription:
          'Revived under the patronage of Mummadi Krishnaraja Wadiyar, this Dasavatara Ganjifa set was painted using natural stone pigments and pure gold leaf.',
        datePeriod: 'c. 1845 CE (19th Century)',
        creatorOrigin: 'Mysore Court Chitragara Guild',
        locationInsideMuseum: 'Gallery 3 (Royal Paintings), Stand 09',
        displayOrder: 1,
        tags: ['Mysore Painting', 'Gold Leaf', 'Ganjifa', 'Royal Art'],
        images: [
          {
            url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80',
            caption: 'Circular painted disc showing Matsya avatar with embossed gold foil details',
            isCover: true,
          },
        ],
        status: 'PUBLISHED',
      },
    ];

    for (const artData of allArtifactsData) {
      const artifact = new Artifact({
        ...artData,
        viewCount: Math.floor(Math.random() * 250) + 50,
        scanCount: Math.floor(Math.random() * 120) + 20,
      });

      await artifact.save();

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

      // Telemetry
      for (let i = 0; i < 12; i++) {
        const sources: ('QR' | 'WEB' | 'APP')[] = ['QR', 'QR', 'WEB', 'APP'];
        const randomSource = sources[Math.floor(Math.random() * sources.length)];
        await Analytics.create({
          artifactId: artifact._id,
          museumId: artifact.museumId,
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
    console.log(`🏛️ Total Museums Seeded: 3`);
    console.log(`🏺 Total Artifacts Seeded: ${allArtifactsData.length}`);
    console.log('================================================');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  }
};

if (require.main === module) {
  seedDatabase().then(() => process.exit(0));
}
