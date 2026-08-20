# Digital Museum QR Guide Platform 🏛️📱

A complete, modern digital museum guide platform built for museums to create rich digital information guides for physical artifacts, models, and exhibitions displayed inside the museum.

Each physical artifact receives a unique QR code plaque. When museum visitors scan the QR code using their smartphone camera or the Android app, the application opens the artifact's digital guide containing audio narrations, video documentaries, high-resolution image galleries, historical significance, and structured stories.

---

## 🌟 Key Features

### 1. 👥 Visitor Experience (Zero Friction)
- **No account required**: Visitors instantly access artifact guides without login or signup.
- **Museum Brand Theme**: Premium academic styling with deep museum blue (`#214E86`), light background (`#FBFCFD`), and accessible typography.
- **Audio Narration Player**: Dedicated voice guide with play/pause, scrubber bar, duration timer, adjustable playback speed (0.8x, 1.0x, 1.25x, 1.5x), rewind, volume mute, and accessible narration transcript.
- **Video Documentaries**: Responsive video player with poster preview and fullscreen capabilities.
- **Interactive Image Lightbox**: High-resolution exhibit gallery with swipe thumbnails and fullscreen zoom.
- **Structured Story Blocks**: Curated narratives with styled headings, paragraphs, bullet points, image blocks with captions, and historical quotes.
- **Accessibility System**: Font scaling (Normal, Large, Extra Large) and High-Contrast mode for elderly visitors and children.

### 2. 📱 Android Application & Deep Linking
- **Capacitor Android wrapper** with native camera barcode scanning.
- **Android App Links & Deep Linking**:
  - `https://museum-app.example/a/art_8f29d2` opens directly inside the Android app if installed, or seamlessly loads in the mobile browser if not installed.
  - `museumguide://a/*` custom URL scheme.
- **Asset Links verification endpoint**: `/.well-known/assetlinks.json`.
- **Intelligent Scanner**: Validates platform QR codes and displays friendly error guidance for non-museum QR codes.

### 3. 🛡️ Museum Management & Admin Dashboard (`/admin`)
- **Multi-Museum Hierarchy**: Museum → Sections/Galleries → Artifacts/Models → Digital Content.
- **Role-Based Authentication**: `SUPER_ADMIN`, `MUSEUM_ADMIN`, and `EDITOR` roles with secure JWT and bcrypt hashing.
- **Gallery / Section Management**: Create, edit, reorder, and organize exhibits into themed wings.
- **Rich Artifact Editor**: Form fields for period, creator/origin, location inside museum (e.g., *Gallery 2, Stand 14*), tags, structured content builder, image manager, audio narration with transcripts, and video documentary links.
- **Publishing System**: `DRAFT`, `PUBLISHED`, and `ARCHIVED` states. Changing exhibit information never breaks or modifies the physical QR code URL.

### 4. 🖨️ QR Code Studio & Printable Exhibition Placards
- **Dedicated QR Management Studio**: View, preview, and download QR codes in high-resolution **PNG** (1024x1024) and vector **SVG**.
- **Printable Exhibition Cards**: Generates standardized exhibition cards with Museum branding, artifact title, museum location badge, high-res QR code, and *"Scan for Audio Narration & Video"* callout ready for physical exhibit placement.
- **URL Shortcodes**: Canonical short URLs such as `/a/art_8f29d2`.

### 5. ☁️ Media Storage & Database Architecture
- **Dedicated Storage Abstraction (`IMediaStorageService`)**:
  - **Cloudinary Storage Provider**: Uploads images, audio narration tracks, and video clips to Cloudinary CDN.
  - **Local Disk Storage Provider**: Fallback local storage served via static `/uploads` route for self-hosting or offline setups.
  - Binaries are never stored inside MongoDB.
- **Database**: MongoDB Atlas Mongoose schema with embedded fallback for zero-friction local development.
- **Built-in Analytics**: Lightweight event tracking for page views, QR plaque scans, audio listens, and traffic origin (QR vs Web vs App).

---

## 🏛️ Multi-Museum Hierarchy

```
GM University Heritage Museum
├── Ancient Technology & Engineering
│   └── Ancient Water Clock (Ghati Yantra / Clepsydra) [art_8f29d2]
├── Astronomy & Rare Manuscripts
│   ├── Brass Astrolabe with Celestial Coordinates [art_a4f10e]
│   └── Palm Leaf Ayurvedic Botanical Treatise [art_7e20b4]
├── Classical Sculptures & Metallurgy
│   └── Chola Bronze Dancing Shiva (Nataraja) [art_5d81c2]
└── Freedom Struggle & Regional History
    └── Underground Freedom Movement Treadle Printing Press [art_3b69e7]
```

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js v18+ or v20+
- npm v9+

### 1. Clone & Install Dependencies

```bash
# Install backend packages
cd backend
npm install

# Install frontend packages
cd ../frontend
npm install
```

### 2. Configure Environment Variables

**Backend (`backend/.env`):**
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
JWT_SECRET=REDACTED_JWT_SECRET

# Optional: MongoDB Atlas URI (leave empty for automatic embedded database)
MONGODB_URI=

# Media Storage ('cloudinary' or 'local')
STORAGE_PROVIDER=local
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

### 3. Run the Development Servers

```bash
# In terminal 1: Start Backend API (Port 5000)
cd backend
npm run dev

# In terminal 2: Start Frontend Web App (Port 5173)
cd frontend
npm run dev
```

The database will automatically populate with realistic museum exhibits, audio tracks, and QR codes on initial launch!

---

## 🔑 Default Administrator Credentials

| Role | Email | Password |
|---|---|---|
| **Super Admin** | `admin@museum.org` | `REDACTED_SEED_PASSWORD` |
| **GMU Museum Admin** | `curator@gmu.edu.in` | `REDACTED_SEED_PASSWORD` |

---

## 📱 Building the Android Application

The project uses Capacitor to wrap the web application with native Android camera scanning and deep link capabilities.

```bash
cd frontend

# Build production web bundle
npm run build

# Sync web bundle and plugins with Android project
npx cap sync android

# Open project in Android Studio
npx cap open android
```

In Android Studio:
1. Connect an Android phone or launch an Android Virtual Device (AVD).
2. Click **Run 'app'** or select **Build > Build Bundle(s) / APK(s) > Build APK(s)**.

---

## 🌐 Free-Tier Deployment Blueprint

### 1. Frontend Hosting on Netlify (Free Tier)
1. Push the repository to GitHub.
2. Connect the repo on [Netlify](https://app.netlify.com).
3. Set **Base Directory** to `frontend`.
4. Set **Build Command** to `npm run build`.
5. Set **Publish Directory** to `dist`.
6. Add environment variable `VITE_API_URL` pointing to your deployed backend.

### 2. Backend Hosting on Render / Railway / Fly.io (Free Tier)
1. Deploy the `backend` directory as a Node web service.
2. Set **Build Command** to `npm run build`.
3. Set **Start Command** to `npm start`.
4. Configure environment variables (`MONGODB_URI`, `JWT_SECRET`, `CLIENT_URL`, `CLOUDINARY_*`).

### 3. Database on MongoDB Atlas (M0 Free Tier)
1. Create a free M0 cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas).
2. Create a database user and allow network access (`0.0.0.0/0`).
3. Copy the connection URI into `MONGODB_URI`.

### 4. Media Storage on Cloudinary (Free Tier)
1. Create a free account at [cloudinary.com](https://cloudinary.com).
2. Copy `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` into your backend environment variables.

---

## 📡 REST API Reference

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/api/auth/login` | Administrator sign in | Public |
| `GET` | `/api/auth/me` | Current authenticated user profile | Bearer |
| `GET` | `/api/museums` | List all active museums | Public |
| `GET` | `/api/museums/:id` | Get museum details & stats | Public |
| `POST` | `/api/museums` | Create museum | Admin |
| `GET` | `/api/sections/museum/:id` | Get sections in a museum | Public |
| `POST` | `/api/sections` | Create gallery section | Admin |
| `GET` | `/api/artifacts` | List artifacts with filters | Public/Admin |
| `POST` | `/api/artifacts` | Create artifact & auto-generate QR | Admin |
| `PUT` | `/api/artifacts/:id` | Update artifact | Admin |
| `PATCH` | `/api/artifacts/:id/status` | Change status (`PUBLISHED`/`DRAFT`) | Admin |
| `GET` | `/api/public/museum/:slug` | Public museum page data | Public |
| `GET` | `/api/public/artifact/:code` | Public artifact data (by shortCode) | Public |
| `GET` | `/api/public/search` | Search exhibits across museum | Public |
| `GET` | `/api/qr` | List all generated QR codes | Admin |
| `GET` | `/api/qr/download/png/:code` | Download high-res PNG QR code | Public |
| `GET` | `/api/qr/download/svg/:code` | Download vector SVG QR code | Public |
| `POST` | `/api/media/upload` | Upload image, audio or video | Admin |
| `POST` | `/api/analytics/view` | Track visitor page view / QR scan | Public |
| `GET` | `/api/analytics/museum/:id` | Museum visitor analytics | Admin |
| `GET` | `/.well-known/assetlinks.json` | Android App Links verification | Public |

---

## 📂 Project Directory Structure

```
museum-guide/
├── backend/
│   ├── src/
│   │   ├── config/          # Database & environment configuration
│   │   ├── controllers/     # Auth, Museum, Section, Artifact, QR, Media, Analytics
│   │   ├── middleware/      # JWT auth, RBAC, Multer upload filter
│   │   ├── models/          # User, Museum, Section, Artifact, QRCode, Media, Analytics
│   │   ├── routes/          # Express API route modules
│   │   ├── scripts/         # Realistic GMU museum seed script
│   │   ├── services/        # Cloudinary/Local media abstraction, QRCode generator
│   │   ├── app.ts           # Express application setup
│   │   └── server.ts        # Server entry point
│   ├── uploads/             # Local fallback media storage directory
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/       # Layout, QRPrintCardModal, MediaUploader
│   │   │   ├── common/      # Header, Footer, Modals, A11y menu
│   │   │   └── visitor/     # AudioPlayer, VideoPlayer, ImageGallery, RichRenderer, Scanner
│   │   ├── context/         # AuthContext, AccessibilityContext
│   │   ├── pages/
│   │   │   ├── admin/       # Overview, Museums, Sections, Artifacts, QR Studio, Analytics
│   │   │   └── visitor/     # HomePage, MuseumPage, SectionPage, ArtifactPage, ScanPage
│   │   ├── services/        # API client
│   │   ├── types/           # TypeScript data models
│   │   ├── App.tsx          # Route definitions
│   │   └── main.tsx
│   ├── android/             # Native Android Capacitor workspace
│   ├── capacitor.config.ts  # Capacitor native configuration
│   ├── tailwind.config.js   # Museum Deep Blue color palette
│   └── package.json
│
├── netlify.toml             # Netlify deployment configuration
├── package.json             # Root monorepo runner
└── README.md
```

---

## 🏛️ License
MIT License. Built for Museums, Cultural Heritage Centers, and Educational Observatories.
