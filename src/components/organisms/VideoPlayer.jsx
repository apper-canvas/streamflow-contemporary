import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import VideoControls from '@/components/molecules/VideoControls';

const VideoPlayer = ({ 
  src, 
  title = "", 
  onBack,
  onTimeUpdate,
  initialTime = 0,
  className = '' 
}) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(initialTime);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const hideControlsTimeout = useRef(null);

  // Auto-hide controls
  useEffect(() => {
    const resetHideTimer = () => {
      if (hideControlsTimeout.current) {
        clearTimeout(hideControlsTimeout.current);
      }
      
      setShowControls(true);
      
      if (isPlaying) {
        hideControlsTimeout.current = setTimeout(() => {
          setShowControls(false);
        }, 3000);
      }
    };

    const handleMouseMove = () => resetHideTimer();
    const handleKeyPress = () => resetHideTimer();

    resetHideTimer();

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('keydown', handleKeyPress);

    return () => {
      if (hideControlsTimeout.current) {
        clearTimeout(hideControlsTimeout.current);
      }
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [isPlaying]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e) => {
      switch (e.code) {
        case 'Space':
          e.preventDefault();
          handlePlayPause();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          handleSeek(Math.max(0, currentTime - 10));
          break;
        case 'ArrowRight':
          e.preventDefault();
          handleSeek(Math.min(duration, currentTime + 10));
          break;
        case 'Escape':
          if (isFullscreen) {
            handleFullscreen();
          } else {
            onBack();
          }
          break;
        case 'KeyF':
          e.preventDefault();
          handleFullscreen();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [currentTime, duration, isFullscreen]);

  const handlePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (time) => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = time;
    setCurrentTime(time);
    onTimeUpdate?.(time);
  };

  const handleVolumeChange = (newVolume) => {
    const video = videoRef.current;
    if (!video) return;

    video.volume = newVolume;
    setVolume(newVolume);
  };

  const handleFullscreen = () => {
    const container = videoRef.current?.parentElement;
    if (!container) return;

    if (!isFullscreen) {
      if (container.requestFullscreen) {
        container.requestFullscreen();
      } else if (container.webkitRequestFullscreen) {
        container.webkitRequestFullscreen();
      } else if (container.msRequestFullscreen) {
        container.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;

    setCurrentTime(video.currentTime);
    onTimeUpdate?.(video.currentTime);
  };

  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (!video) return;

    setDuration(video.duration);
    if (initialTime > 0) {
      video.currentTime = initialTime;
      setCurrentTime(initialTime);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('msfullscreenchange', handleFullscreenChange);
    };
  }, []);

  return (
    <motion.div
      className={`relative w-full h-full bg-black ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onClick={handlePlayPause}
        poster="/api/placeholder/1920/1080"
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Loading placeholder */}
      {!duration && (
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          <motion.div
            className="text-white text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <p>Loading video...</p>
          </motion.div>
        </div>
      )}

      {/* Video Controls */}
      <VideoControls
        isPlaying={isPlaying}
        onPlayPause={handlePlayPause}
        onFullscreen={handleFullscreen}
        currentTime={currentTime}
        duration={duration}
        volume={volume}
        onVolumeChange={handleVolumeChange}
        onSeek={handleSeek}
        onBack={onBack}
        title={title}
        isVisible={showControls}
      />
    </motion.div>
  );
};

export default VideoPlayer;