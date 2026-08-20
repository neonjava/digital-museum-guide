import QRCode from 'qrcode';
import { env } from '../config/env';

export interface GeneratedQRCode {
  shortCode: string;
  publicUrl: string;
  qrImageUrl: string;
  svgContent: string;
}

export class QRService {
  /**
   * Builds the canonical public URL for an artifact.
   * Format: ${CLIENT_URL}/a/${shortCode}
   */
  static buildPublicUrl(shortCode: string): string {
    const baseUrl = env.CLIENT_URL.replace(/\/$/, '');
    return `${baseUrl}/a/${shortCode}`;
  }

  /**
   * Generates high quality PNG DataURL and SVG string for a given public URL.
   */
  static async generateQRCode(shortCode: string): Promise<GeneratedQRCode> {
    const publicUrl = this.buildPublicUrl(shortCode);

    // Options for high quality rendering with museum brand colors
    const qrOptions: QRCode.QRCodeToDataURLOptions = {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      margin: 2,
      width: 600,
      color: {
        dark: '#214E86', // Deep Museum Blue as requested in Design System
        light: '#FFFFFF',
      },
    };

    // 1. Generate PNG Data URL
    const qrImageUrl = await QRCode.toDataURL(publicUrl, qrOptions);

    // 2. Generate SVG String
    const svgContent = await QRCode.toString(publicUrl, {
      type: 'svg',
      errorCorrectionLevel: 'H',
      margin: 2,
      color: {
        dark: '#214E86',
        light: '#FFFFFF',
      },
    });

    return {
      shortCode,
      publicUrl,
      qrImageUrl,
      svgContent,
    };
  }

  /**
   * Generates a raw PNG Buffer for direct downloads
   */
  static async generatePNGStream(publicUrl: string): Promise<Buffer> {
    return QRCode.toBuffer(publicUrl, {
      errorCorrectionLevel: 'H',
      type: 'png',
      margin: 2,
      width: 1024,
      color: {
        dark: '#214E86',
        light: '#FFFFFF',
      },
    });
  }
}
