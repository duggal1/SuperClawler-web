// components/VideoPlayer.tsx
import React, { useRef, useEffect } from 'react';
import { useTheme } from 'next-themes';

interface VideoPlayerProps {
  src: string;
  className?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, className = '' }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { theme } = useTheme();
  
  useEffect(() => {
    const videoElement = videoRef.current;
    
    if (videoElement) {
      const playVideo = async () => {
        try {
          await videoElement.play();
        } catch (error) {
          console.warn('Auto-play was prevented:', error);
          // Add retry logic or user interaction prompt if needed
        }
      };
      
      playVideo();
      
      // Set video properties
      videoElement.muted = true;
      videoElement.playsInline = true;
      videoElement.loop = true;
    }
    
    return () => {
      if (videoElement) {
        videoElement.pause();
        videoElement.currentTime = 0;
      }
    };
  }, []);

  const isDarkMode = theme === 'dark';
  
  return (
    <div className={`video-container rounded-lg overflow-hidden ${isDarkMode ? 'bg-black' : 'bg-white'} ${className}`}>
      <video 
        ref={videoRef}
        loop
        muted
        playsInline
        autoPlay
        className="w-full h-full object-cover"
      >
        <source src={src} type="video/mp4" /> {/* Fixed video MIME type */}
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoPlayer;