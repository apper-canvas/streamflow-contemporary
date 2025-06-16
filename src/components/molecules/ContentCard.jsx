import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Duration from '@/components/atoms/Duration';
import Rating from '@/components/atoms/Rating';
import ProgressBar from '@/components/atoms/ProgressBar';

const ContentCard = ({ content, progress = 0, showProgress = false, size = 'md', className = '', isContinueWatching = false }) => {
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const sizeClasses = {
    sm: 'w-32 h-48',
    md: 'w-40 h-60',
    lg: 'w-48 h-72',
    xl: 'w-56 h-84'
  };

  const handlePlayClick = (e) => {
    e.stopPropagation();
    navigate(`/watch/${content.id}`);
  };

  const handleCardClick = () => {
    // Could open content details modal or navigate to watch
    navigate(`/watch/${content.id}`);
  };

return (
    <motion.div
      className={`${sizeClasses[size]} relative rounded-lg overflow-hidden cursor-pointer group ${className} ${
        isContinueWatching ? 'ring-2 ring-primary/50 shadow-lg shadow-primary/20' : ''
      }`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleCardClick}
      layout
    >
      {/* Thumbnail Image */}
      <div className="w-full h-full relative">
        {!imageError ? (
          <>
            {/* Loading placeholder */}
            {!imageLoaded && (
              <div className="absolute inset-0 bg-surface animate-pulse flex items-center justify-center">
                <ApperIcon name="Image" size={24} className="text-accent/30" />
              </div>
            )}
            
            <img
              src={content.thumbnail}
              alt={content.title}
              className={`w-full h-full object-cover transition-all duration-300 group-hover:brightness-75 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
          </>
        ) : (
          /* Error state */
          <div className="w-full h-full bg-surface flex flex-col items-center justify-center">
            <ApperIcon name="ImageOff" size={24} className="text-accent/30 mb-2" />
            <span className="text-xs text-accent/50 text-center px-2">{content.title}</span>
          </div>
)}

        {/* Movie title overlay on hover */}
        <motion.div
          className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
        >
          <h3 className="text-white font-bold text-sm md:text-base drop-shadow-lg">
            {content.title}
          </h3>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handlePlayClick}
            className="bg-white/20 backdrop-blur-sm text-white rounded-full p-2 shadow-lg border border-white/30 mt-2 self-start"
          >
            <ApperIcon name="Play" size={16} fill="currentColor" />
          </motion.button>
        </motion.div>

        {/* Rating badge */}
        <div className="absolute top-2 left-2">
          <Rating rating={content.rating} />
        </div>

        {/* Continue Watching badge */}
        {isContinueWatching && (
          <div className="absolute top-2 left-2 mt-8">
            <div className="bg-primary/90 text-white text-xs px-2 py-1 rounded-full font-medium shadow-lg">
              Continue Watching
            </div>
          </div>
        )}

        {/* Duration badge */}
        <div className="absolute top-2 right-2 bg-black/70 rounded px-2 py-1">
          <Duration duration={content.duration} type={content.type} className="text-xs text-white" />
        </div>
        
        {/* Progress bar */}
        {showProgress && progress > 0 && (
          <div className="absolute bottom-0 left-0 right-0 px-2 pb-2">
            <ProgressBar progress={progress} />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ContentCard;