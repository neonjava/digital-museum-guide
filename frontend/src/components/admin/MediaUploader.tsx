import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  FileAudio,
  FileVideo,
  FileImage,
  Loader2,
  X,
} from 'lucide-react';
import { api } from '../../services/api';
import { MediaItem } from '../../types';

interface MediaUploaderProps {
  onUploadSuccess: (media: MediaItem) => void;
  accept?: string;
  mediaTypeLabel?: string;
  museumId?: string;
}

export const MediaUploader: React.FC<MediaUploaderProps> = ({
  onUploadSuccess,
  accept = 'image/*,audio/*,video/*',
  mediaTypeLabel = 'image, audio narration or video file',
  museumId,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset status
    setErrorMessage(null);
    setUploadSuccess(false);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      if (museumId) {
        formData.append('museumId', museumId);
      }

      const res = await api.post('/media/upload', formData);

      if (res.success && res.data) {
        setUploadSuccess(true);
        onUploadSuccess(res.data);
        setTimeout(() => setUploadSuccess(false), 3000);
      }
    } catch (err: any) {
      console.error('File upload failed:', err);
      setErrorMessage(err.message || 'Upload failed. Please check file size and format.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="w-full">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={accept}
        className="hidden"
      />

      <div
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center space-y-2 ${
          isUploading
            ? 'border-museum-primary bg-museum-light/30 opacity-80 cursor-wait'
            : 'border-museum-border hover:border-museum-primary hover:bg-museum-light/20 bg-white'
        }`}
      >
        {isUploading ? (
          <div className="flex flex-col items-center space-y-2 text-museum-primary">
            <Loader2 className="w-8 h-8 animate-spin" />
            <span className="text-xs font-semibold">Uploading to dedicated media storage...</span>
          </div>
        ) : uploadSuccess ? (
          <div className="flex flex-col items-center space-y-1 text-emerald-600">
            <CheckCircle2 className="w-8 h-8" />
            <span className="text-xs font-bold">Uploaded successfully!</span>
          </div>
        ) : (
          <>
            <div className="w-12 h-12 rounded-xl bg-museum-light flex items-center justify-center text-museum-primary mb-1">
              <UploadCloud className="w-6 h-6" />
            </div>
            <div>
              <span className="text-sm font-bold text-museum-text block">
                Click to upload {mediaTypeLabel}
              </span>
              <span className="text-xs text-museum-muted">
                Images (PNG/JPG/WEBP), Audio (MP3/WAV/M4A), or Video (MP4) up to 100MB
              </span>
            </div>
          </>
        )}
      </div>

      {errorMessage && (
        <div className="mt-2 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button onClick={() => setErrorMessage(null)} className="text-red-500 hover:text-red-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
