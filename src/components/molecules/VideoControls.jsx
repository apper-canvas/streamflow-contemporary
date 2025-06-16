import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const VideoControls = ({ 
  isPlaying, 
  onPlayPause, 
  onFullscreen,
  currentTime = 0,
  duration = 0,
  volume = 1,
  onVolumeChange,
  onSeek,
  onBack,
  title = "",
  isVisible = true
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [tempTime, setTempTime] = useState(currentTime);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const progressRef = useRef(null);

  const formatTime = (timeInSeconds) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleProgressClick = (e) => {
    if (!progressRef.current) return;
    
    const rect = progressRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * duration;
    
    onSeek(newTime);
  };

  const handleProgressDrag = (e) => {
    if (!isDragging || !progressRef.current) return;
    
    const rect = progressRef.current.getBoundingClientRect();
    const dragX = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percentage = dragX / rect.width;
    const newTime = percentage * duration;
    
    setTempTime(newTime);
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    handleProgressClick(e);
  };

  useEffect(() => {
    const handleMouseUp = () => {
      if (isDragging) {
        onSeek(tempTime);
        setIsDragging(false);
      }
    };

    const handleMouseMove = (e) => {
      if (isDragging) {
        handleProgressDrag(e);
      }
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, tempTime, onSeek]);

  useEffect(() => {
    if (!isDragging) {
      setTempTime(currentTime);
    }
  }, [currentTime, isDragging]);

  const displayTime = isDragging ? tempTime : currentTime;
  const progress = duration > 0 ? (displayTime / duration) * 100 : 0;

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Top bar with title and back button */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 to-transparent z-50"
          >
            <div className="flex items-center">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onBack}
                className="text-white hover:text-accent transition-colors mr-4"
              >
                <ApperIcon name="ArrowLeft" size={24} />
              </motion.button>
              <h1 className="text-white text-lg font-semibold">{title}</h1>
            </div>
          </motion.div>

          {/* Center play/pause button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-40"
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onPlayPause}
              className="bg-black/50 text-white rounded-full p-4 pointer-events-auto"
            >
              <ApperIcon 
                name={isPlaying ? "Pause" : "Play"} 
                size={32} 
                fill={isPlaying ? "none" : "currentColor"}
              />
            </motion.button>
          </motion.div>

          {/* Bottom controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent z-50"
          >
            {/* Progress bar */}
            <div className="px-6 pb-2">
              <div
                ref={progressRef}
                className="w-full h-2 bg-white/30 rounded-full cursor-pointer relative"
                onClick={handleProgressClick}
                onMouseDown={handleMouseDown}
              >
                <div
                  className="h-full bg-primary rounded-full relative"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-primary rounded-full opacity-0 hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </div>

            {/* Controls bar */}
            <div className="flex items-center justify-between px-6 pb-4">
              <div className="flex items-center space-x-4">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onPlayPause}
                  className="text-white hover:text-accent transition-colors"
                >
                  <ApperIcon 
                    name={isPlaying ? "Pause" : "Play"} 
                    size={24}
                    fill={isPlaying ? "none" : "currentColor"}
                  />
                </motion.button>

                <div className="flex items-center text-white text-sm">
                  <span>{formatTime(displayTime)}</span>
                  <span className="mx-2">/</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                {/* Volume control */}
                <div 
                  className="relative flex items-center"
                  onMouseEnter={() => setShowVolumeSlider(true)}
                  onMouseLeave={() => setShowVolumeSlider(false)}
                >
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="text-white hover:text-accent transition-colors"
                  >
                    <ApperIcon 
                      name={volume === 0 ? "VolumeX" : volume < 0.5 ? "Volume1" : "Volume2"} 
                      size={20}
                    />
                  </motion.button>

                  <AnimatePresence>
                    {showVolumeSlider && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="absolute right-full mr-2 bg-black/80 rounded-lg p-2"
                      >
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={volume}
                          onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
                          className="w-20 h-2 bg-white/30 rounded-lg appearance-none cursor-pointer"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onFullscreen}
                  className="text-white hover:text-accent transition-colors"
                >
                  <ApperIcon name="Maximize" size={20} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default VideoControls;