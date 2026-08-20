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
    // 🏛️ 1. GM University Heritage Museum
    // ==========================================
    const gmuMuseum = await Museum.create({
      name: 'GM University Heritage Museum',
      slug: 'gmu-heritage-museum',
      description:
        'A premier university museum dedicated to preserving historical technological marvels, ancient hydrodynamics, rare palm-leaf manuscripts, and classical Deccan arts.',
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
      openingHours: 'Tuesday - Sunday: 9:30 AM - 5:30 PM (Closed Mondays)',
      website: 'https://gmu.edu.in/heritage-museum',
    });

    const gmuAdmin = await User.create({
      name: 'Dr. Ananya Sharma',
      email: 'curator@gmu.edu.in',
      password: 'REDACTED_SEED_PASSWORD',
      role: 'MUSEUM_ADMIN',
      museumId: gmuMuseum._id,
    });

    const secGmuAncientTech = await Section.create({
      museumId: gmuMuseum._id,
      name: 'Ancient Technology & Engineering',
      description: 'Hydrodynamic timekeepers, metallurgical furnaces, and mechanical innovations of ancient civilizations.',
      coverImage: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
      displayOrder: 1,
    });

    const secGmuAstronomy = await Section.create({
      museumId: gmuMuseum._id,
      name: 'Astronomy & Rare Manuscripts',
      description: 'Original palm-leaf folios, brass celestial astrolabes, and star charts dating from the 8th to 17th centuries.',
      coverImage: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80',
      displayOrder: 2,
    });

    const secGmuSculptures = await Section.create({
      museumId: gmuMuseum._id,
      name: 'Classical Sculptures & Metallurgy',
      description: 'Masterpieces of bronze casting (cire perdue), stone carvings, and temple iconography.',
      coverImage: 'https://images.unsplash.com/photo-1544967082-d9d25d867d66?auto=format&fit=crop&w=800&q=80',
      displayOrder: 3,
    });

    const secGmuFreedom = await Section.create({
      museumId: gmuMuseum._id,
      name: 'Freedom Struggle & Regional History',
      description: 'Relics, underground printing presses, and photographs documenting the regional freedom movement.',
      coverImage: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&w=800&q=80',
      displayOrder: 4,
    });

    // ==========================================
    // 🏛️ 2. National Museum, New Delhi
    // ==========================================
    const natMuseumDelhi = await Museum.create({
      name: 'National Museum, New Delhi',
      slug: 'national-museum-new-delhi',
      description:
        'One of the largest museums in India, holding over 200,000 works of art spanning prehistoric Harappan civilization through the modern era.',
      logo: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&w=300&q=80',
      coverImage: 'https://images.unsplash.com/photo-1588714477688-cf28a50e94f7?auto=format&fit=crop&w=1600&q=80',
      address: {
        street: 'Janpath, Rajpath Area',
        city: 'New Delhi',
        state: 'Delhi',
        country: 'India',
        postalCode: '110011',
      },
      contact: {
        email: 'info@nationalmuseumdelhi.gov.in',
        phone: '+91 11 2301 9272',
      },
      openingHours: 'Tuesday - Sunday: 10:00 AM - 6:00 PM (Closed Mondays)',
      website: 'http://nationalmuseumindia.gov.in',
    });

    const secHarappa = await Section.create({
      museumId: natMuseumDelhi._id,
      name: 'Indus Valley Civilization Gallery',
      description: 'Excavated relics from Mohenjo-daro and Harappa including the Dancing Girl, terracotta seals, and beads.',
      coverImage: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&w=800&q=80',
      displayOrder: 1,
    });

    const secMaurya = await Section.create({
      museumId: natMuseumDelhi._id,
      name: 'Maurya, Shunga & Kushana Art Gallery',
      description: 'Iconic polished sandstone sculptures, Gandhara Buddhas, and Mathura yakshi pillars.',
      coverImage: 'https://images.unsplash.com/photo-1544967082-d9d25d867d66?auto=format&fit=crop&w=800&q=80',
      displayOrder: 2,
    });

    // ==========================================
    // 🏛️ 3. National Rail Museum, New Delhi
    // ==========================================
    const railMuseum = await Museum.create({
      name: 'National Rail Museum, New Delhi',
      slug: 'national-rail-museum',
      description:
        'Showcasing India’s rich 170-year railway heritage with 100+ life-sized exhibits, royal vintage saloons, the 1855 Fairy Queen steam engine, and working signalling instruments.',
      logo: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=300&q=80',
      coverImage: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=1600&q=80',
      address: {
        street: 'Chanakyapuri, Shanti Path',
        city: 'New Delhi',
        state: 'Delhi',
        country: 'India',
        postalCode: '110021',
      },
      contact: {
        email: 'railmuseum@rb.railnet.gov.in',
        phone: '+91 11 2688 1816',
      },
      openingHours: 'Tuesday - Sunday: 10:00 AM - 5:00 PM (Closed Mondays)',
      website: 'https://nrmindia.org',
    });

    const secSteamLocos = await Section.create({
      museumId: railMuseum._id,
      name: 'Vintage Steam Locomotives & Royal Saloons',
      description: 'Historical steam locomotives including the Fairy Queen (1855) and Maharaja Saloon coaches.',
      coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
      displayOrder: 1,
    });

    // ==========================================
    // 🏛️ 4. Government Museum, Chennai (Egmore)
    // ==========================================
    const egmoreMuseum = await Museum.create({
      name: 'Government Museum, Chennai (Egmore)',
      slug: 'government-museum-chennai',
      description:
        'Established in 1851, the second oldest museum in India, globally renowned for its priceless collection of South Indian Bronzes, Amaravati sculptures, and numismatics.',
      logo: 'https://images.unsplash.com/photo-1544967082-d9d25d867d66?auto=format&fit=crop&w=300&q=80',
      coverImage: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&w=1600&q=80',
      address: {
        street: 'Pantheon Road, Egmore',
        city: 'Chennai',
        state: 'Tamil Nadu',
        country: 'India',
        postalCode: '600008',
      },
      contact: {
        email: 'chennaimuseum@tn.gov.in',
        phone: '+91 44 2819 3238',
      },
      openingHours: 'Saturday - Thursday: 9:30 AM - 5:00 PM (Closed Fridays)',
      website: 'http://govtmuseumchennai.org',
    });

    const secEgmoreBronzes = await Section.create({
      museumId: egmoreMuseum._id,
      name: 'Pallava & Chola Bronze Gallery',
      description: 'World-famous masterpiece lost-wax bronzes from the 8th to 13th century Chola epoch.',
      coverImage: 'https://images.unsplash.com/photo-1544967082-d9d25d867d66?auto=format&fit=crop&w=800&q=80',
      displayOrder: 1,
    });

    // ==========================================
    // 🏛️ 5. National Science & Aerospace Museum
    // ==========================================
    const sciMuseum = await Museum.create({
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
      openingHours: 'Wednesday - Monday: 10:00 AM - 6:00 PM (Closed Tuesdays)',
      website: 'https://aerospacemuseum.gov.in',
    });

    const secSpace = await Section.create({
      museumId: sciMuseum._id,
      name: 'Space Exploration & Rocketry',
      description: 'Historical sounding rockets, lunar rover landing apparatus, and telemetry tracking arrays.',
      coverImage: 'https://images.unsplash.com/photo-1517976487508-466d7bc03632?auto=format&fit=crop&w=800&q=80',
      displayOrder: 1,
    });

    // ==========================================
    // 🏛️ 6. Deccan Royal Arts & Cultural Heritage Museum
    // ==========================================
    const royalMuseum = await Museum.create({
      name: 'Deccan Royal Arts & Cultural Heritage Museum',
      slug: 'deccan-royal-arts',
      description:
        'Preserving the grandeur of Vijayanagara, Bahmani, and Mysore royal arts, gilded weaponry, gold leaf miniature paintings, and silk textiles.',
      logo: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&w=300&q=80',
      coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
      address: {
        street: 'Palace Grounds, Heritage Complex',
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

    const secRoyalArmor = await Section.create({
      museumId: royalMuseum._id,
      name: 'Imperial Arms & Royal Metallurgy',
      description: 'Wootz steel swords, damascened daggers, gold-inlaid armor, and cavalry regalia.',
      coverImage: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&w=800&q=80',
      displayOrder: 1,
    });

    // ==========================================
    // 🏺 ALL ARTIFACTS
    // ==========================================
    console.log('🏺 Creating Exhibits & Generating QR Codes across all museums...');

    const allArtifactsData = [
      // 1. GMU Water Clock
      {
        museumId: gmuMuseum._id,
        sectionId: secGmuAncientTech._id,
        shortCode: 'art_8f29d2',
        name: 'Ancient Water Clock (Ghati Yantra / Clepsydra)',
        shortDescription: 'A precision hydrodynamic timekeeping device used in ancient observatories to measure 24-minute "Ghati" intervals.',
        fullDescription: 'The Ghati Yantra is one of humanity’s earliest empirical precision instruments for measuring time independently of sunlight. This model consists of a calibrated copper bowl with a precision micro-orifice floating in a bronze reservoir.',
        richContent: [
          { id: 'b-1', type: 'heading', content: 'How the Hydrodynamic Mechanism Works' },
          { id: 'b-2', type: 'paragraph', content: 'The bowl has a specific calibrated volume and weight. When placed on calm water, hydrostatic pressure causes water to enter through the calibrated pinhole. Exactly 24 minutes (one Ghati) are required for the bowl to submerge completely.' },
        ],
        historicalInformation: 'Described in the 5th-century astronomical treatise Surya Siddhanta and the Panchasiddhantika of Varahamihira.',
        datePeriod: 'c. 1020 CE (11th Century)',
        creatorOrigin: 'Chalukyan Guild of Mechanical Artisans (Kalyana)',
        locationInsideMuseum: 'Gallery 2 (Ancient Tech), Stand 14',
        displayOrder: 1,
        tags: ['Timekeeping', 'Engineering', 'Hydrodynamics', 'Astronomy'],
        images: [{ url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80', caption: 'Calibrated copper bowl in water reservoir', isCover: true }],
        audioNarration: {
          url: 'https://actions.google.com/sounds/v1/water/water_dripping_in_cave.ogg',
          title: 'Audio Guide: The Rhythm of Water Clock Mechanics',
          duration: 145,
          transcript: 'Welcome to Exhibit 14. Before mechanical pendulum clocks existed, ancient astronomers looked to steady liquid flow...',
        },
        video: {
          url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
          posterUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
          title: 'Demonstration: 24-Minute Sinking Cycle',
          duration: 15,
        },
        status: 'PUBLISHED',
      },
      // 2. GMU Astrolabe
      {
        museumId: gmuMuseum._id,
        sectionId: secGmuAstronomy._id,
        shortCode: 'art_a4f10e',
        name: 'Brass Astrolabe with Celestial Coordinates',
        shortDescription: 'A two-dimensional model of the celestial sphere used by medieval navigators and astronomers to determine local time and star positions.',
        fullDescription: 'This exceptional brass astrolabe is an intricate analogue computer featuring engraved plates for specific latitudes and an openwork rete showing 28 principal guide stars.',
        historicalInformation: 'Crafted during the reign of Emperor Akbar at the Lahore astronomical instrument workshops.',
        datePeriod: '1588 CE (16th Century)',
        creatorOrigin: 'Master Craftsman Muhammad Muqim',
        locationInsideMuseum: 'Gallery 3 (Astronomy), Showcase 02',
        displayOrder: 1,
        tags: ['Astronomy', 'Navigation', 'Brass', 'Instruments'],
        images: [{ url: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1200&q=80', caption: 'Intricate star pointers of the celestial rete', isCover: true }],
        audioNarration: {
          url: 'https://actions.google.com/sounds/v1/science/radar_screen.ogg',
          title: 'Audio Guide: Unlocking the Heavens with Brass Gears',
          duration: 180,
        },
        status: 'PUBLISHED',
      },
      // 3. GMU Palm Leaf Manuscript
      {
        museumId: gmuMuseum._id,
        sectionId: secGmuAstronomy._id,
        shortCode: 'art_7e20b4',
        name: 'Palm Leaf Ayurvedic Botanical Treatise (Tala-patra)',
        shortDescription: 'Rare 14th-century palm leaf folio codex inscribed with iron stylus detailing 400 medicinal flora and surgical procedures.',
        fullDescription: 'Written in early Kannada script on cured leaves of the Palmyra palm, treated with turmeric water and charcoal ink rubbing.',
        datePeriod: '1380 CE (14th Century)',
        creatorOrigin: 'Scholar Physician Vidyaranya Sampradaya',
        locationInsideMuseum: 'Gallery 4 (Rare Archives), Vault 01',
        displayOrder: 2,
        tags: ['Manuscript', 'Medicine', 'Ayurveda', 'Botanical'],
        images: [{ url: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=1200&q=80', caption: 'Palm leaf bundle with raw silk cords', isCover: true }],
        audioNarration: {
          url: 'https://actions.google.com/sounds/v1/ambiences/library.ogg',
          title: 'Audio Guide: The Scribes of Palmyra',
          duration: 120,
        },
        status: 'PUBLISHED',
      },
      // 4. National Museum Harappan Dancing Girl
      {
        museumId: natMuseumDelhi._id,
        sectionId: secHarappa._id,
        shortCode: 'art_2f90a1',
        name: 'The Bronze Dancing Girl of Mohenjo-daro',
        shortDescription: 'A world-famous prehistoric bronze sculpture made using the lost-wax casting technique circa 2300-1750 BCE.',
        fullDescription: 'Discovered in 1926 by Ernest Mackay at Mohenjo-daro, this 10.5 cm statuette depicts a young girl in a confident standing pose with her right hand on her hip and 25 bangles on her left arm.',
        historicalInformation: 'A testament to the sophisticated metallurgy and lost-wax bronze casting capability of the Indus Valley Civilization.',
        datePeriod: 'c. 2300–1750 BCE',
        creatorOrigin: 'Indus Valley Civilization (Mohenjo-daro)',
        locationInsideMuseum: 'Harappan Gallery, Central Case 01',
        displayOrder: 1,
        tags: ['Harappa', 'Bronze', 'Prehistoric', 'Indus Valley'],
        images: [{ url: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&w=1200&q=80', caption: 'The bronze Dancing Girl in lost-wax copper alloy', isCover: true }],
        audioNarration: {
          url: 'https://actions.google.com/sounds/v1/foley/temple_bell.ogg',
          title: 'Audio Guide: 4,500 Years Ago in Mohenjo-daro',
          duration: 160,
        },
        status: 'PUBLISHED',
      },
      // 5. National Rail Museum Fairy Queen
      {
        museumId: railMuseum._id,
        sectionId: secSteamLocos._id,
        shortCode: 'art_3c7d19',
        name: 'The Fairy Queen (EIR-22) Steam Locomotive',
        shortDescription: 'The oldest working steam locomotive in the world, certified by Guinness World Records, built in Leeds in 1855.',
        fullDescription: 'Built by Kitson, Thompson and Hewitson in Leeds, England, the Fairy Queen hauled troop trains during 1857 and passenger expresses between Howrah and Raniganj.',
        historicalInformation: 'Restored to operating condition in 1997 and regularly operated on heritage runs between Delhi and Alwar.',
        datePeriod: '1855 CE',
        creatorOrigin: 'Kitson & Co., Leeds (East Indian Railway)',
        locationInsideMuseum: 'Heritage Steam Shed, Track 01',
        displayOrder: 1,
        tags: ['Steam Locomotive', 'Rail Heritage', 'Guinness Record', 'Fairy Queen'],
        images: [{ url: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=1200&q=80', caption: 'The restored green and gold 2-2-2WT steam locomotive', isCover: true }],
        audioNarration: {
          url: 'https://actions.google.com/sounds/v1/transportation/steam_train_horn.ogg',
          title: 'Audio Guide: The Whistle of the Fairy Queen',
          duration: 130,
        },
        status: 'PUBLISHED',
      },
      // 6. Chennai Egmore Chola Nataraja
      {
        museumId: egmoreMuseum._id,
        sectionId: secEgmoreBronzes._id,
        shortCode: 'art_5d81c2',
        name: 'Chola Bronze Dancing Shiva (Nataraja)',
        shortDescription: 'The supreme masterpiece of lost-wax South Indian bronze casting representing the cosmic Anandatandava dance.',
        fullDescription: 'Cast in five-metal Panchaloha alloy, this Nataraja depicts Shiva surrounded by the ring of flames, holding the Damaru drum of creation.',
        historicalInformation: 'Cast in Thanjavur district during the zenith of the Chola empire.',
        datePeriod: 'c. 1100 CE (12th Century)',
        creatorOrigin: 'Imperial Chola Sthapati Guild',
        locationInsideMuseum: 'Bronze Gallery, Center Rotunda',
        displayOrder: 1,
        tags: ['Bronze', 'Sculpture', 'Chola', 'Sacred Art'],
        images: [{ url: 'https://images.unsplash.com/photo-1544967082-d9d25d867d66?auto=format&fit=crop&w=1200&q=80', caption: 'Nataraja in the cosmic ring of flames', isCover: true }],
        audioNarration: {
          url: 'https://actions.google.com/sounds/v1/foley/temple_bell.ogg',
          title: 'Audio Guide: The Five Cosmic Movements of Shiva',
          duration: 160,
        },
        status: 'PUBLISHED',
      },
      // 7. Aerospace Museum Rohini-75
      {
        museumId: sciMuseum._id,
        sectionId: secSpace._id,
        shortCode: 'art_9c3b1a',
        name: 'Rohini-75 Sounding Rocket Prototype',
        shortDescription: 'First indigenously fabricated sounding rocket launched from Thumba in 1967.',
        fullDescription: 'Marking the birth of the nation’s space program, the Rohini RH-75 had a diameter of 75mm and probed the upper ionosphere.',
        historicalInformation: 'Pioneered by Dr. Vikram Sarabhai and APJ Abdul Kalam at TERLS in Thumba.',
        datePeriod: '1967 CE',
        creatorOrigin: 'Indian Space Research Programme (TERLS)',
        locationInsideMuseum: 'Space Pavilion, Launch Stand 01',
        displayOrder: 1,
        tags: ['Aerospace', 'Rocketry', 'ISRO', 'Space'],
        images: [{ url: 'https://images.unsplash.com/photo-1517976487508-466d7bc03632?auto=format&fit=crop&w=1200&q=80', caption: 'Scale prototype of the RH-75 on mobile launch rail', isCover: true }],
        audioNarration: {
          url: 'https://actions.google.com/sounds/v1/science/radar_screen.ogg',
          title: 'Audio Guide: From Thumba Beach to the Stars',
          duration: 150,
        },
        status: 'PUBLISHED',
      },
      // 8. Deccan Royal Wootz Dagger
      {
        museumId: royalMuseum._id,
        sectionId: secRoyalArmor._id,
        shortCode: 'art_1a7f3e',
        name: 'Gilded Wootz Steel Royal Khanjar Dagger',
        shortDescription: 'High-carbon crucible Wootz steel dagger with nephrite jade hilt inlaid with rubies and gold koftgari damascening.',
        fullDescription: 'Forged in southern Karnataka, this curved double-edged blade displays the famous crystalline water-pattern characteristic of ancient Wootz metallurgy.',
        datePeriod: 'c. 1560 CE (16th Century)',
        creatorOrigin: 'Vijayanagara Royal Armory (Hampi)',
        locationInsideMuseum: 'Royal Armory Vault, Showcase 05',
        displayOrder: 1,
        tags: ['Wootz Steel', 'Weapons', 'Vijayanagara', 'Jeweled'],
        images: [{ url: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&w=1200&q=80', caption: 'Water-patterned Wootz blade with carved jade horse-head pommel', isCover: true }],
        status: 'PUBLISHED',
      },
    ];

    for (const artData of allArtifactsData) {
      const artifact = new Artifact({
        ...artData,
        viewCount: Math.floor(Math.random() * 300) + 75,
        scanCount: Math.floor(Math.random() * 150) + 30,
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
    console.log('🏛️ GMU Admin: curator@gmu.edu.in / REDACTED_SEED_PASSWORD');
    console.log(`🏛️ Total Museums Seeded: 6`);
    console.log(`🏺 Total Artifacts Seeded: ${allArtifactsData.length}`);
    console.log('================================================');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  }
};

if (require.main === module) {
  seedDatabase().then(() => process.exit(0));
}
