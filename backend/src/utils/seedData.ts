export interface SeedUser {
  name: string;
  email: string;
  password: string;
  role: 'SUPER_ADMIN' | 'MUSEUM_ADMIN' | 'EDITOR';
  museumSlug?: string;
}

export interface SeedSection {
  name: string;
  description: string;
  coverImage: string;
  displayOrder: number;
}

export interface SeedArtifactImage {
  url: string;
  caption?: string;
  isCover?: boolean;
}

export interface SeedArtifactAudio {
  url: string;
  title: string;
  duration: number;
  transcript?: string;
}

export interface SeedArtifactVideo {
  url: string;
  posterUrl?: string;
  title: string;
  duration: number;
}

export interface SeedRichContentBlock {
  id: string;
  type: 'heading' | 'paragraph' | 'bullet_list' | 'image' | 'quote' | 'callout';
  content?: string;
  items?: string[];
  imageUrl?: string;
  caption?: string;
}

export interface SeedArtifact {
  shortCode: string;
  name: string;
  museumSlug: string;
  sectionName: string;
  shortDescription: string;
  fullDescription: string;
  richContent: SeedRichContentBlock[];
  historicalInformation: string;
  datePeriod: string;
  creatorOrigin: string;
  locationInsideMuseum: string;
  displayOrder: number;
  tags: string[];
  images: SeedArtifactImage[];
  audioNarration?: SeedArtifactAudio;
  video?: SeedArtifactVideo;
  additionalNotes?: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
}

export interface SeedMuseum {
  name: string;
  slug: string;
  description: string;
  logo: string;
  coverImage: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  contact: {
    email: string;
    phone: string;
  };
  openingHours: string;
  website: string;
  sections: SeedSection[];
}

export const SEED_USERS: SeedUser[] = [
  {
    name: 'Super Administrator',
    email: 'admin@museum.org',
    password: 'REDACTED_SEED_PASSWORD',
    role: 'SUPER_ADMIN',
  },
  {
    name: 'Dr. Ananya Sharma',
    email: 'curator@gmu.edu.in',
    password: 'REDACTED_SEED_PASSWORD',
    role: 'MUSEUM_ADMIN',
    museumSlug: 'gmu-heritage-museum',
  },
  {
    name: 'Rajesh Nair',
    email: 'curator@nationalmuseumdelhi.gov.in',
    password: 'REDACTED_SEED_PASSWORD',
    role: 'MUSEUM_ADMIN',
    museumSlug: 'national-museum-new-delhi',
  },
];

export const SEED_MUSEUMS: SeedMuseum[] = [
  // 1. GM University Heritage Museum
  {
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
    sections: [
      {
        name: 'Ancient Technology & Engineering',
        description: 'Hydrodynamic timekeepers, metallurgical furnaces, and mechanical innovations of ancient civilizations.',
        coverImage: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
        displayOrder: 1,
      },
      {
        name: 'Astronomy & Rare Manuscripts',
        description: 'Original palm-leaf folios, brass celestial astrolabes, and star charts dating from the 8th to 17th centuries.',
        coverImage: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80',
        displayOrder: 2,
      },
      {
        name: 'Classical Sculptures & Metallurgy',
        description: 'Masterpieces of bronze casting (cire perdue), stone carvings, and temple iconography.',
        coverImage: 'https://images.unsplash.com/photo-1544967082-d9d25d867d66?auto=format&fit=crop&w=800&q=80',
        displayOrder: 3,
      },
      {
        name: 'Freedom Struggle & Regional History',
        description: 'Relics, underground printing presses, and photographs documenting the regional freedom movement.',
        coverImage: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&w=800&q=80',
        displayOrder: 4,
      },
    ],
  },

  // 2. National Museum, New Delhi
  {
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
    sections: [
      {
        name: 'Indus Valley Civilization Gallery',
        description: 'Excavated relics from Mohenjo-daro and Harappa including the Dancing Girl, terracotta seals, and beads.',
        coverImage: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&w=800&q=80',
        displayOrder: 1,
      },
      {
        name: 'Maurya, Shunga & Kushana Art Gallery',
        description: 'Iconic polished sandstone sculptures, Gandhara Buddhas, and Mathura yakshi pillars.',
        coverImage: 'https://images.unsplash.com/photo-1544967082-d9d25d867d66?auto=format&fit=crop&w=800&q=80',
        displayOrder: 2,
      },
    ],
  },

  // 3. National Rail Museum, New Delhi
  {
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
    sections: [
      {
        name: 'Vintage Steam Locomotives & Royal Saloons',
        description: 'Historical steam locomotives including the Fairy Queen (1855) and Maharaja Saloon coaches.',
        coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
        displayOrder: 1,
      },
    ],
  },

  // 4. Government Museum, Chennai (Egmore)
  {
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
    sections: [
      {
        name: 'Pallava & Chola Bronze Gallery',
        description: 'World-famous masterpiece lost-wax bronzes from the 8th to 13th century Chola epoch.',
        coverImage: 'https://images.unsplash.com/photo-1544967082-d9d25d867d66?auto=format&fit=crop&w=800&q=80',
        displayOrder: 1,
      },
    ],
  },

  // 5. National Science & Aerospace Museum
  {
    name: 'National Science & Aerospace Museum',
    slug: 'national-science-aerospace',
    description:
      'Showcasing India’s pioneering aerospace achievements, rocket prototypes, robotic innovations, and quantum physics explorations.',
    logo: 'https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?auto=format&fit=crop&w=300&q=80',
    coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80',
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
    sections: [
      {
        name: 'Space Exploration & Rocketry',
        description: 'Historical sounding rockets, lunar rover landing apparatus, and telemetry tracking arrays.',
        coverImage: 'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=800&q=80',
        displayOrder: 1,
      },
    ],
  },

  // 6. Deccan Royal Arts & Cultural Heritage Museum
  {
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
    sections: [
      {
        name: 'Imperial Arms & Royal Metallurgy',
        description: 'Wootz steel swords, damascened daggers, gold-inlaid armor, and cavalry regalia.',
        coverImage: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&w=800&q=80',
        displayOrder: 1,
      },
    ],
  },
];

export const SEED_ARTIFACTS: SeedArtifact[] = [
  // 1. GMU Water Clock
  {
    shortCode: 'art_8f29d2',
    name: 'Ancient Water Clock (Ghati Yantra / Clepsydra)',
    museumSlug: 'gmu-heritage-museum',
    sectionName: 'Ancient Technology & Engineering',
    shortDescription:
      'A precision hydrodynamic timekeeping device used in ancient observatories to measure 24-minute "Ghati" intervals.',
    fullDescription:
      'The Ghati Yantra is one of humanity’s earliest empirical precision instruments for measuring time independently of solar illumination. This model consists of a calibrated copper hemispherical bowl with a precision micro-orifice floating in a bronze reservoir. As water enters through the pinhole via hydrostatic pressure, the bowl gradually sinks at a constant, mathematically calibrated rate.',
    richContent: [
      { id: 'b-1', type: 'heading', content: 'Hydrodynamic Calibration & Mechanics' },
      {
        id: 'b-2',
        type: 'paragraph',
        content:
          'In ancient Indian chronometry, a day and night cycle (Nycthemeron) was divided into 60 equal intervals known as Ghatis (or Nadikas), each equivalent to exactly 24 modern solar minutes. The bowl is weighted and dimensioned such that water fills it to the tipping point precisely at the 24th minute.',
      },
      {
        id: 'b-3',
        type: 'callout',
        content:
          'When the bowl submerges and strikes the copper gong at the bottom of the reservoir, a temple or royal attendant tolls a bell to mark the completion of the Ghati.',
      },
      {
        id: 'b-4',
        type: 'bullet_list',
        items: [
          'Material: High-purity beaten copper (Tamra) with anti-corrosive bronze reservoir',
          'Orifice Dimension: Drilled with a 0.75mm gold needle to ensure laminar flow',
          'Time Measurement: Exactly 1 Ghati = 24 minutes (60 Ghatis per civil day)',
          'Operational Context: Used in royal courtyards, Buddhist viharas, and astronomical observatories',
        ],
      },
    ],
    historicalInformation:
      'Described in the 5th-century astronomical treatise Surya Siddhanta and the Panchasiddhantika of Varahamihira. Widely utilized across Deccan universities and royal observatories from the Chalukyan through the Vijayanagara periods.',
    datePeriod: 'c. 1020 CE (11th Century)',
    creatorOrigin: 'Chalukyan Guild of Mechanical Artisans (Kalyana)',
    locationInsideMuseum: 'Gallery 2 (Ancient Tech), Stand 14',
    displayOrder: 1,
    tags: ['Timekeeping', 'Engineering', 'Hydrodynamics', 'Astronomy', 'Chalukya'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80',
        caption: 'Calibrated copper bowl floating in bronze reservoir',
        isCover: true,
      },
      {
        url: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1200&q=80',
        caption: 'Detailed view of the laminar flow micro-orifice',
        isCover: false,
      },
    ],
    audioNarration: {
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      title: 'Audio Guide: The Rhythm of Ancient Hydrodynamic Timekeeping',
      duration: 145,
      transcript:
        'Welcome to Exhibit 14. Before mechanical escapement clocks existed in Europe, ancient Indian astronomers looked to the continuous, steady flow of water to measure time with extraordinary precision...',
    },
    video: {
      url: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4',
      posterUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
      title: 'Demonstration: 24-Minute Sinking Cycle of the Ghati Yantra',
      duration: 15,
    },
    status: 'PUBLISHED',
  },

  // 2. GMU Astrolabe
  {
    shortCode: 'art_a4f10e',
    name: 'Brass Astrolabe with Celestial Coordinates',
    museumSlug: 'gmu-heritage-museum',
    sectionName: 'Astronomy & Rare Manuscripts',
    shortDescription:
      'A two-dimensional model of the celestial sphere used by medieval navigators and astronomers to determine local time, azimuths, and planetary positions.',
    fullDescription:
      'This exceptional brass astrolabe is an intricate medieval analogue computer featuring engraved latitude plates (tympan) calibrated for specific northern Deccan latitudes and an openwork rete showing 28 principal guide stars. Hand-engraved with Arabic and Sanskrit astrological glyphs.',
    richContent: [
      { id: 'ast-1', type: 'heading', content: 'Astronomical & Navigational Principles' },
      {
        id: 'ast-2',
        type: 'paragraph',
        content:
          'By sighting celestial bodies through the rotating alidade on the reverse side and aligning the rete, an astronomer could instantly determine the exact local solar and sidereal time, predict planetary risings, and compute latitude at sea.',
      },
      {
        id: 'ast-3',
        type: 'quote',
        content:
          '“The astrolabe is the mirror of the heavens, calculating in seconds what human thought requires days of geometry to unravel.” — Medieval Astronomical Treatise',
      },
    ],
    historicalInformation:
      'Crafted during the scholastic zenith of the Western Chalukya and subsequent Indo-Islamic scientific exchange in the northern Deccan. Demonstrates advanced spherical trigonometry and precision brass casting.',
    datePeriod: '1588 CE (16th Century)',
    creatorOrigin: 'Master Craftsman Muhammad Muqim (Lahore-Deccan Guild)',
    locationInsideMuseum: 'Gallery 3 (Astronomy), Showcase 02',
    displayOrder: 1,
    tags: ['Astronomy', 'Navigation', 'Brass', 'Instruments', 'Astrolabe'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1200&q=80',
        caption: 'Intricate star pointers and celestial rete of the brass astrolabe',
        isCover: true,
      },
      {
        url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
        caption: 'Reverse side featuring latitude engravings and altitude alidade',
        isCover: false,
      },
    ],
    audioNarration: {
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
      title: 'Audio Guide: Unlocking the Heavens with Brass Gears',
      duration: 180,
      transcript:
        'You are looking at one of the most sophisticated computational devices of the medieval world. With this brass astrolabe, astronomers carried the cosmos in their hands...',
    },
    video: {
      url: 'https://test-videos.co.uk/vids/jellyfish/mp4/h264/360/Jellyfish_360_10s_1MB.mp4',
      posterUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80',
      title: 'Interactive Breakdown: Reading the Rete & Altitude Plates',
      duration: 20,
    },
    status: 'PUBLISHED',
  },

  // 3. GMU Palm Leaf Manuscript
  {
    shortCode: 'art_7e20b4',
    name: 'Palm Leaf Ayurvedic Botanical Treatise (Tala-patra)',
    museumSlug: 'gmu-heritage-museum',
    sectionName: 'Astronomy & Rare Manuscripts',
    shortDescription:
      'Rare 14th-century palm leaf folio codex inscribed with iron stylus detailing 400 medicinal flora and surgical procedures.',
    fullDescription:
      'Written in early Old Kannada and Grantha script on cured leaves of the Palmyra palm (Borassus flabellifer). Each folio was boiled in herbal decoctions, dried under shade, polished with cowrie shells, and inscribed using a diamond-tipped iron stylus before black carbon lamp soot was rubbed to reveal the glyphs.',
    richContent: [
      { id: 'pl-1', type: 'heading', content: 'Preservation of Ancient Pharmacopeia' },
      {
        id: 'pl-2',
        type: 'paragraph',
        content:
          'The codex contains 124 leaves bound with raw silk cords between seasoned teak wood covers. It details pharmacological preparations for respiratory remedies, anti-venom antidotes, and anatomical illustrations.',
      },
      {
        id: 'pl-3',
        type: 'bullet_list',
        items: [
          'Medium: Cured Palmyra palm leaves (Tala-patra)',
          'Script: Old Kannada & Sanskrit in Grantha script',
          'Folios: 124 two-sided inscribed leaves with marginal commentary',
          'Condition: Fully preserved in climate-controlled argon gas chamber',
        ],
      },
    ],
    historicalInformation:
      'Preserved for centuries within the temple granaries of the Tungabhadra basin before being cataloged by GM University conservators in 1984.',
    datePeriod: '1380 CE (14th Century)',
    creatorOrigin: 'Scholar Physician Vidyaranya Sampradaya',
    locationInsideMuseum: 'Gallery 4 (Rare Archives), Vault 01',
    displayOrder: 2,
    tags: ['Manuscript', 'Medicine', 'Ayurveda', 'Botanical', 'Palm Leaf'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=1200&q=80',
        caption: 'Inscribed palm leaf folio bundle with raw silk binding cord',
        isCover: true,
      },
      {
        url: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1200&q=80',
        caption: 'High-magnification view of iron stylus incised script',
        isCover: false,
      },
    ],
    audioNarration: {
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
      title: 'Audio Guide: The Scribes of Palmyra',
      duration: 120,
      transcript:
        'Step closer to examine the delicate lines of this palm leaf manuscript. Before the printing press or paper mills reached this region, scholars carved timeless medical knowledge into organic leaves...',
    },
    video: {
      url: 'https://test-videos.co.uk/vids/sintel/mp4/h264/360/Sintel_360_10s_1MB.mp4',
      posterUrl: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=800&q=80',
      title: 'Documentary: Conserving Medieval Palm Leaf Folios',
      duration: 18,
    },
    status: 'PUBLISHED',
  },

  // 4. National Museum Harappan Dancing Girl
  {
    shortCode: 'art_2f90a1',
    name: 'The Bronze Dancing Girl of Mohenjo-daro',
    museumSlug: 'national-museum-new-delhi',
    sectionName: 'Indus Valley Civilization Gallery',
    shortDescription:
      'A world-famous prehistoric bronze sculpture made using the lost-wax casting technique circa 2300-1750 BCE.',
    fullDescription:
      'Discovered in 1926 by archaeologist Ernest Mackay at Mohenjo-daro in the Indus Valley, this 10.5 cm statuette depicts a young girl in a confident, poised standing stance with her right hand resting on her hip and 25 bangles covering her left arm. It is globally recognized as the apex of Bronze Age metallurgy.',
    richContent: [
      { id: 'har-1', type: 'heading', content: 'The Lost-Wax (Cire Perdue) Metallurgy' },
      {
        id: 'har-2',
        type: 'paragraph',
        content:
          'Created more than 4,000 years ago, the statue demonstrates that Indus Valley artisans had mastered advanced copper-tin bronze alloy casting, wax sculpting, and post-cast surface chasing millennia before similar works appeared in many other ancient civilizations.',
      },
      {
        id: 'har-3',
        type: 'callout',
        content:
          'Sir John Marshall, Director-General of Archaeology in India, remarked: "When I first saw her I found it difficult to believe that she was prehistoric... there is nothing like her in ancient art."',
      },
    ],
    historicalInformation:
      'Excavated from the HR area of Mohenjo-daro (Sindh, Pakistan) in 1926. Transferred to the National Museum, New Delhi during partition treaties where it remains the crown jewel of prehistoric Indian art.',
    datePeriod: 'c. 2300–1750 BCE (Bronze Age)',
    creatorOrigin: 'Indus Valley Civilization (Mohenjo-daro)',
    locationInsideMuseum: 'Harappan Gallery, Central Case 01',
    displayOrder: 1,
    tags: ['Harappa', 'Bronze', 'Prehistoric', 'Indus Valley', 'Mohenjo-daro'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&w=1200&q=80',
        caption: 'The bronze Dancing Girl in lost-wax copper-tin alloy',
        isCover: true,
      },
      {
        url: 'https://images.unsplash.com/photo-1544967082-d9d25d867d66?auto=format&fit=crop&w=1200&q=80',
        caption: 'Profile showing bangle adornment and bun coiffure',
        isCover: false,
      },
    ],
    audioNarration: {
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
      title: 'Audio Guide: 4,500 Years Ago in Mohenjo-daro',
      duration: 160,
      transcript:
        'You are looking at one of humanity’s greatest prehistoric masterpieces. Standing just over 10 centimeters tall, this bronze figure conveys incredible life, personality, and metallurgical sophistication...',
    },
    video: {
      url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
      posterUrl: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&w=800&q=80',
      title: '360 Photogrammetry Reconstruction: Harappan Dancing Girl',
      duration: 12,
    },
    status: 'PUBLISHED',
  },

  // 5. National Rail Museum Fairy Queen
  {
    shortCode: 'art_3c7d19',
    name: 'The Fairy Queen (EIR-22) Steam Locomotive',
    museumSlug: 'national-rail-museum',
    sectionName: 'Vintage Steam Locomotives & Royal Saloons',
    shortDescription:
      'The oldest working steam locomotive in the world, certified by Guinness World Records, built in Leeds in 1855.',
    fullDescription:
      'Built by Kitson, Thompson and Hewitson in Leeds, England, in 1855, the Fairy Queen (East Indian Railway No. 22) has a 2-2-2 wheel arrangement and reached speeds of 40 km/h. It hauled military supply trains during the 1857 events and later passenger expresses between Howrah and Raniganj.',
    richContent: [
      { id: 'fq-1', type: 'heading', content: 'Engineering Specifications & Heritage' },
      {
        id: 'fq-2',
        type: 'paragraph',
        content:
          'Equipped with twin 12x22 inch cylinders, a coal-fired boiler operating at 130 psi, and ornamental brass dome cladding, the locomotive was restored to working condition in 1997 and won the National Tourism Award.',
      },
      {
        id: 'fq-3',
        type: 'bullet_list',
        items: [
          'Guinness Record: World’s oldest operating steam locomotive in regular commercial service',
          'Builder: Kitson, Thompson & Hewitson (Leeds, UK, Works No. 481)',
          'Gauge: Broad Gauge (5 ft 6 in / 1676 mm)',
          'Service Span: 1855–1909 (active service), 1997–present (heritage runs)',
        ],
      },
    ],
    historicalInformation:
      'Retired from active mainline service in 1909, preserved at Howrah, and permanently enshrined at the National Rail Museum in Chanakyapuri, New Delhi in 1977.',
    datePeriod: '1855 CE (19th Century)',
    creatorOrigin: 'Kitson & Co., Leeds (East Indian Railway)',
    locationInsideMuseum: 'Heritage Steam Shed, Track 01',
    displayOrder: 1,
    tags: ['Steam Locomotive', 'Rail Heritage', 'Guinness Record', 'Fairy Queen', 'Indian Railways'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=1200&q=80',
        caption: 'The restored green and gold 2-2-2WT steam locomotive',
        isCover: true,
      },
      {
        url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
        caption: 'Front boiler smokebox and brass nameplate EIR-22',
        isCover: false,
      },
    ],
    audioNarration: {
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
      title: 'Audio Guide: The Whistle of the 1855 Fairy Queen',
      duration: 135,
      transcript:
        'Listen to the rhythm of steam that built modern transportation. Built in Leeds in 1855, the Fairy Queen is officially the world’s oldest functioning steam locomotive...',
    },
    video: {
      url: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4',
      posterUrl: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=800&q=80',
      title: 'Archival Footage: Fairy Queen Heritage Steam Run to Alwar',
      duration: 25,
    },
    status: 'PUBLISHED',
  },

  // 6. Chennai Egmore Chola Nataraja
  {
    shortCode: 'art_5d81c2',
    name: 'Chola Bronze Dancing Shiva (Nataraja)',
    museumSlug: 'government-museum-chennai',
    sectionName: 'Pallava & Chola Bronze Gallery',
    shortDescription:
      'The supreme masterpiece of lost-wax South Indian bronze casting representing the cosmic Anandatandava dance.',
    fullDescription:
      'Cast in the sacred five-metal Panchaloha alloy (copper, zinc, gold, silver, lead), this Nataraja depicts Shiva surrounded by the circular ring of cosmic fire (Prabhavali). With his upper right hand holding the Damaru drum of creation and upper left hand bearing the Agni flame of destruction, this icon synthesizes philosophy and sculptural perfection.',
    richContent: [
      { id: 'nat-1', type: 'heading', content: 'The Five Cosmic Activities (Pancha Kritya)' },
      {
        id: 'nat-2',
        type: 'paragraph',
        content:
          'Every gesture in this bronze encodes a foundational philosophical tenet: Creation (Srishti) via the drum, Preservation (Sthiti) via the Abhaya blessing hand, Destruction (Samhara) via the fire, Concealment (Tirobhava) via the planted foot, and Liberation (Anugraha) via the raised foot.',
      },
      {
        id: 'nat-3',
        type: 'callout',
        content:
          'Celebrated physicist Fritjof Capra noted in The Tao of Physics: "Modern physics has shown that the rhythm of creation and destruction is not only the basis of seasons, but also of all matter: the dance of subatomic particles is the dance of Shiva."',
      },
    ],
    historicalInformation:
      'Cast in the Thanjavur region during the reign of the Imperial Cholas (10th–12th century CE). Acquired by the Government Museum Chennai in the early 20th century.',
    datePeriod: 'c. 1100 CE (12th Century)',
    creatorOrigin: 'Imperial Chola Sthapati Guild (Thanjavur)',
    locationInsideMuseum: 'Bronze Gallery, Center Rotunda Plinth',
    displayOrder: 1,
    tags: ['Bronze', 'Sculpture', 'Chola', 'Sacred Art', 'Nataraja', 'Panchaloha'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1544967082-d9d25d867d66?auto=format&fit=crop&w=1200&q=80',
        caption: 'Masterpiece Chola Nataraja in the cosmic ring of flames',
        isCover: true,
      },
      {
        url: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&w=1200&q=80',
        caption: 'Detail of the Abhaya mudra and flying dreadlocks',
        isCover: false,
      },
    ],
    audioNarration: {
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
      title: 'Audio Guide: The Five Cosmic Movements of the Chola Nataraja',
      duration: 160,
      transcript:
        'Stand before the crowning glory of South Indian metallurgy. Cast during the zenith of the Chola empire, this bronze sculpture portrays Shiva dancing the Anandatandava...',
    },
    video: {
      url: 'https://test-videos.co.uk/vids/jellyfish/mp4/h264/360/Jellyfish_360_10s_1MB.mp4',
      posterUrl: 'https://images.unsplash.com/photo-1544967082-d9d25d867d66?auto=format&fit=crop&w=800&q=80',
      title: 'Documentary: The Lost-Wax Casting Tradition of Swamimalai',
      duration: 22,
    },
    status: 'PUBLISHED',
  },

  // 7. Aerospace Museum Rohini-75
  {
    shortCode: 'art_9c3b1a',
    name: 'Rohini-75 Sounding Rocket Prototype',
    museumSlug: 'national-science-aerospace',
    sectionName: 'Space Exploration & Rocketry',
    shortDescription:
      'First indigenously fabricated sounding rocket launched from Thumba in 1967, founding the national space program.',
    fullDescription:
      'Developed by pioneer scientists Dr. Vikram Sarabhai and APJ Abdul Kalam at the Thumba Equatorial Rocket Launching Station (TERLS) in Kerala, the Rohini RH-75 had an outer diameter of 75mm and carried meteorological payloads to study the equatorial electrojet in the upper ionosphere.',
    richContent: [
      { id: 'roh-1', type: 'heading', content: 'Birth of the Indian Space Odyssey' },
      {
        id: 'roh-2',
        type: 'paragraph',
        content:
          'On November 20, 1967, the RH-75 was successfully launched from the sandy beaches of Thumba. This single-stage solid propellant rocket laid the foundation for the SLV-3, PSLV, and Chandrayaan exploration vehicles.',
      },
      {
        id: 'roh-3',
        type: 'bullet_list',
        items: [
          'Diameter: 75 mm (solid propellant single-stage)',
          'Apogee: 10 km altitude in suborbital trajectory',
          'Launch Facility: Thumba Equatorial Rocket Launching Station (TERLS)',
          'Key Architects: Dr. Vikram Sarabhai, Dr. APJ Abdul Kalam',
        ],
      },
    ],
    historicalInformation:
      'Pioneered in a converted church building in Thumba in the 1960s with bicycle transportation of nose cones, becoming the catalyst for one of the world’s leading space agencies.',
    datePeriod: '1967 CE (20th Century)',
    creatorOrigin: 'Indian Space Research Organisation (ISRO / INCOSPAR)',
    locationInsideMuseum: 'Space Pavilion, Launch Stand 01',
    displayOrder: 1,
    tags: ['Aerospace', 'Rocketry', 'ISRO', 'Space', 'Sounding Rocket'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=1200&q=80',
        caption: 'Full-scale prototype of the Rohini RH-75 on mobile launch rail',
        isCover: true,
      },
      {
        url: 'https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?auto=format&fit=crop&w=1200&q=80',
        caption: 'Historical launch telemetry and guidance payload casing',
        isCover: false,
      },
    ],
    audioNarration: {
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
      title: 'Audio Guide: From Thumba Beach to the Lunar South Pole',
      duration: 150,
      transcript:
        'In November 1967, a tiny rocket took flight from a fishing village in Kerala. That 75-millimeter rocket was the seed of the entire Indian space program...',
    },
    video: {
      url: 'https://test-videos.co.uk/vids/sintel/mp4/h264/360/Sintel_360_10s_1MB.mp4',
      posterUrl: 'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=800&q=80',
      title: 'Archival Launch Footage: The First Rohini Sounding Rockets',
      duration: 16,
    },
    status: 'PUBLISHED',
  },

  // 8. Deccan Royal Wootz Dagger
  {
    shortCode: 'art_1a7f3e',
    name: 'Mysore Tiger-Hilt Damascene Wootz Talwar',
    museumSlug: 'deccan-royal-arts',
    sectionName: 'Imperial Arms & Royal Metallurgy',
    shortDescription:
      'High-carbon crucible Wootz steel sword with carved nephrite jade and gold koftgari damascened tiger pommel.',
    fullDescription:
      'Forged in southern Karnataka crucible furnaces (Wootz / Ukku), this curved double-edged talwar sword displays the legendary crystalline water-silk pattern (Jauhar) formed by banded iron carbide crystals (Fe3C). Hand-embellished with gold foil inlay calligraphy on the forte.',
    richContent: [
      { id: 'wt-1', type: 'heading', content: 'The Crucible Wootz Metallurgy Secret' },
      {
        id: 'wt-2',
        type: 'paragraph',
        content:
          'Southern Indian Wootz steel was exported throughout antiquity across the Silk Road and Middle East, giving rise to Damascus steel. Its ultra-high carbon content (1.5%) combined with trace vanadium gave blades flexibility coupled with razor micro-serrated hardness.',
      },
      {
        id: 'wt-3',
        type: 'bullet_list',
        items: [
          'Metallurgy: Crucible Wootz high-carbon steel with natural carbon nanotube matrix',
          'Hilt Style: Mysore royal court tiger-head pommel with ruby cabochon eyes',
          'Damascening: 24k gold leaf Koftgari inlay along the spine and ricasso',
          'Blade Length: 84 cm curved single-edged blade with reinforced tip',
        ],
      },
    ],
    historicalInformation:
      'Forged in the royal armories of Srirangapatna during the late 18th century, preserved through royal treasury descent before accession into the heritage collection.',
    datePeriod: 'c. 1790 CE (18th Century)',
    creatorOrigin: 'Mysore Royal Armory Metallurgists',
    locationInsideMuseum: 'Royal Armory Vault, Showcase 05',
    displayOrder: 1,
    tags: ['Wootz Steel', 'Weapons', 'Mysore', 'Damascus', 'Arms & Armor'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&w=1200&q=80',
        caption: 'Water-patterned Wootz talwar blade with gold damascened tiger pommel',
        isCover: true,
      },
      {
        url: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&w=1200&q=80',
        caption: 'Microstructure magnification of the Jauhar crystalline banding',
        isCover: false,
      },
    ],
    audioNarration: {
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
      title: 'Audio Guide: The Metallurgy of Indian Crucible Wootz Steel',
      duration: 145,
      transcript:
        'Look closely at the surface of this blade. You will see swirling, water-like bands of steel. This is authentic Wootz steel, the ancient wonder metal of southern India...',
    },
    video: {
      url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
      posterUrl: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&w=800&q=80',
      title: 'Masterclass: The Secret Chemistry of Ancient Crucible Wootz',
      duration: 14,
    },
    status: 'PUBLISHED',
  },
];
