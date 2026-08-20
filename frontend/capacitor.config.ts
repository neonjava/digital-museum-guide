import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.museumguide.app',
  appName: 'Digital Museum Guide',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    cleartext: true,
  },
  plugins: {
    BarcodeScanner: {
      enableTorch: true,
    },
  },
};

export default config;
