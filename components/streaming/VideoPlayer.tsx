'use client';
import dynamic from 'next/dynamic';
import { cn } from '@/lib/utils';
import { isBunnyStreamUrl, toBunnyEmbedUrl } from '@/lib/bunny';

const ReactPlayer = dynamic(() => import('react-player'), { ssr: false });

interface VideoPlayerProps {
  src: string;
  poster?: string;
  className?: string;
  autoPlay?: boolean;
}

/** Supports YouTube, Cloudinary, Bunny.net (play or embed links), and direct files. */
export default function VideoPlayer({ src, poster, className, autoPlay = false }: VideoPlayerProps) {
  if (!src) {
    return (
      <div className={cn('flex items-center justify-center bg-cinema-surface text-ink-muted text-sm', className)}>
        No video source available
      </div>
    );
  }

  if (isBunnyStreamUrl(src)) {
    const embedUrl = toBunnyEmbedUrl(src, autoPlay);
    if (embedUrl) {
      return (
        <div className={cn('relative w-full h-full min-h-[200px] bg-black', className)}>
          <iframe
            src={embedUrl}
            title="Movie player"
            className="absolute inset-0 w-full h-full border-0"
            allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
          />
        </div>
      );
    }
  }

  return (
    <div className={cn('relative w-full h-full min-h-[200px] bg-black', className)}>
      <ReactPlayer
        src={src}
        controls
        playsInline
        playing={autoPlay}
        poster={poster}
        width="100%"
        height="100%"
        style={{ position: 'absolute', top: 0, left: 0 }}
      />
    </div>
  );
}
