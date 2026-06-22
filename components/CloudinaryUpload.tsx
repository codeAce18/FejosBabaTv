'use client';
import { useEffect, useRef } from 'react';
import { Upload, Image as ImageIcon, Film } from 'lucide-react';

interface CloudinaryUploadProps {
  onUpload: (url: string) => void;
  type: 'image' | 'video';
  label: string;
  currentUrl?: string;
}

declare global {
  interface Window {
    cloudinary: any;
  }
}

export default function CloudinaryUpload({
  onUpload,
  type,
  label,
  currentUrl,
}: CloudinaryUploadProps) {
  const widgetRef = useRef<any>(null);

  useEffect(() => {
    // Load Cloudinary widget script
    if (typeof window === 'undefined') return;

    const script = document.createElement('script');
    script.src = 'https://upload-widget.cloudinary.com/global/all.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const openWidget = () => {
    if (typeof window === 'undefined' || !window.cloudinary) {
      alert('Upload widget is loading. Please try again in a moment.');
      return;
    }

    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
        resourceType: type,
        maxFileSize: type === 'video' ? 15_000_000_000 : 10_000_000, // 15GB for video, 10MB for image
        clientAllowedFormats:
          type === 'video'
            ? ['mp4', 'mov', 'avi', 'mkv', 'webm']
            : ['jpg', 'jpeg', 'png', 'webp'],
        folder: type === 'video' ? 'fejosbaba/movies' : 'fejosbaba/thumbnails',
        sources: ['local', 'url', 'google_drive'],
        multiple: false,
        showAdvancedOptions: false,
        cropping: false,
        styles: {
          palette: {
            window: '#14141F',
            windowBorder: '#2A2A3D',
            tabIcon: '#FF7200',
            menuIcons: '#FF7200',
            textDark: '#FFFFFF',
            textLight: '#A0A0BC',
            link: '#FF7200',
            action: '#FF7200',
            inactiveTabIcon: '#606078',
            error: '#ef4444',
            inProgress: '#FF7200',
            complete: '#22c55e',
            sourceBg: '#0E0E18',
          },
        },
      },
      (error: any, result: any) => {
        if (!error && result && result.event === 'success') {
          onUpload(result.info.secure_url);
          widget.close();
        }
        if (error) {
          console.error('Upload error:', error);
        }
      }
    );

    widget.open();
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-ink-secondary mb-1.5">{label}</label>

      <div className="space-y-2">
        {/* Current URL display */}
        {currentUrl && (
          <div className="flex items-center gap-2 bg-cinema-elevated border border-green-500/20 rounded-lg px-3 py-2">
            {type === 'image' ? (
              <ImageIcon size={14} className="text-green-400 flex-shrink-0" />
            ) : (
              <Film size={14} className="text-green-400 flex-shrink-0" />
            )}
            <p className="text-green-400 text-xs truncate flex-1">{currentUrl}</p>
          </div>
        )}

        {/* Upload button */}
        <button
          type="button"
          onClick={openWidget}
          className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-cinema-muted hover:border-brand-orange rounded-xl py-4 transition-all group"
        >
          <Upload size={18} className="text-ink-muted group-hover:text-brand-orange transition-colors" />
          <span className="text-ink-secondary group-hover:text-white text-sm transition-colors">
            {currentUrl
              ? `Replace ${type === 'image' ? 'thumbnail' : 'video'}`
              : `Upload ${type === 'image' ? 'thumbnail' : 'video'} to Cloudinary`}
          </span>
        </button>

        {/* OR paste URL manually */}
        <div className="flex items-center gap-2">
          <div className="flex-1 border-t border-cinema-border" />
          <span className="text-ink-muted text-xs">or paste URL manually</span>
          <div className="flex-1 border-t border-cinema-border" />
        </div>

        <input
          type="url"
          placeholder={`Paste existing Cloudinary ${type} URL...`}
          value={currentUrl || ''}
          onChange={(e) => onUpload(e.target.value)}
          className="w-full bg-cinema-surface border border-cinema-border rounded-lg text-white placeholder:text-ink-muted focus:outline-none focus:border-brand-orange px-4 py-2.5 text-sm"
        />
      </div>
    </div>
  );
}