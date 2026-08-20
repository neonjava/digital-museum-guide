import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import { env } from '../config/env';
import { MediaType } from '../models/Media';

export interface UploadResult {
  url: string;
  publicId: string;
  mediaType: MediaType;
  fileName: string;
  fileSize: number;
  mimeType: string;
  thumbnailUrl?: string;
  duration?: number;
  metadata?: Record<string, any>;
}

export interface IMediaStorageService {
  uploadFile(file: Express.Multer.File, folder?: string): Promise<UploadResult>;
  deleteFile(publicId: string, mediaType?: MediaType): Promise<boolean>;
}

// 1. Cloudinary Storage Provider
export class CloudinaryStorageService implements IMediaStorageService {
  constructor() {
    cloudinary.config({
      cloud_name: env.CLOUDINARY_CLOUD_NAME,
      api_key: env.CLOUDINARY_API_KEY,
      api_secret: env.CLOUDINARY_API_SECRET,
      secure: true,
    });
  }

  async uploadFile(file: Express.Multer.File, folder: string = 'museum_guide'): Promise<UploadResult> {
    const mime = file.mimetype;
    let resourceType: 'image' | 'video' | 'raw' = 'image';
    let mediaType: MediaType = 'image';

    if (mime.startsWith('audio/')) {
      resourceType = 'video'; // Cloudinary treats audio under 'video' resource type
      mediaType = 'audio';
    } else if (mime.startsWith('video/')) {
      resourceType = 'video';
      mediaType = 'video';
    }

    try {
      const result = await cloudinary.uploader.upload(file.path, {
        folder,
        resource_type: resourceType,
        use_filename: true,
      });

      // Clean up local temp file after upload to Cloudinary
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }

      let thumbnailUrl = '';
      if (mediaType === 'image') {
        thumbnailUrl = cloudinary.url(result.public_id, {
          width: 300,
          height: 300,
          crop: 'fill',
          secure: true,
        });
      } else if (mediaType === 'video') {
        thumbnailUrl = cloudinary.url(result.public_id, {
          resource_type: 'video',
          format: 'jpg',
          secure: true,
        });
      }

      return {
        url: result.secure_url,
        publicId: result.public_id,
        mediaType,
        fileName: file.originalname,
        fileSize: result.bytes || file.size,
        mimeType: mime,
        thumbnailUrl: thumbnailUrl || result.secure_url,
        duration: result.duration || 0,
        metadata: {
          format: result.format,
          width: result.width,
          height: result.height,
        },
      };
    } catch (error) {
      // Clean up local temp file on error
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
      throw error;
    }
  }

  async deleteFile(publicId: string, mediaType?: MediaType): Promise<boolean> {
    try {
      const resourceType = mediaType === 'video' || mediaType === 'audio' ? 'video' : 'image';
      await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
      return true;
    } catch (error) {
      console.error('Error deleting from Cloudinary:', error);
      return false;
    }
  }
}

// 2. Local Disk Storage Provider (Ideal for offline/local development or self-hosted deployment)
export class LocalStorageService implements IMediaStorageService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = `${env.CLIENT_URL ? 'http://localhost:' + env.PORT : ''}/uploads`;
  }

  async uploadFile(file: Express.Multer.File, _folder?: string): Promise<UploadResult> {
    const mime = file.mimetype;
    let mediaType: MediaType = 'image';

    if (mime.startsWith('audio/')) {
      mediaType = 'audio';
    } else if (mime.startsWith('video/')) {
      mediaType = 'video';
    }

    const fileName = path.basename(file.path);
    const url = `/uploads/${fileName}`;

    return {
      url,
      publicId: fileName,
      mediaType,
      fileName: file.originalname,
      fileSize: file.size,
      mimeType: mime,
      thumbnailUrl: mediaType === 'image' ? url : '',
      duration: 0,
      metadata: {},
    };
  }

  async deleteFile(publicId: string): Promise<boolean> {
    try {
      const filePath = path.join(env.UPLOAD_DIR, publicId);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      return true;
    } catch (error) {
      console.error('Error deleting local file:', error);
      return false;
    }
  }
}

// Factory to get active media storage service
export const getMediaStorageService = (): IMediaStorageService => {
  if (
    env.STORAGE_PROVIDER === 'cloudinary' &&
    env.CLOUDINARY_CLOUD_NAME &&
    env.CLOUDINARY_API_KEY &&
    env.CLOUDINARY_API_SECRET
  ) {
    return new CloudinaryStorageService();
  }
  return new LocalStorageService();
};
