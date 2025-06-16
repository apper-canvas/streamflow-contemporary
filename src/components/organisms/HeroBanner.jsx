import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/atoms/Button';
import Rating from '@/components/atoms/Rating';
import Duration from '@/components/atoms/Duration';
import ApperIcon from '@/components/ApperIcon';

const HeroBanner = ({ content, className = '' }) => {
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);

  if (!content) return null;

  const handlePlay = () => {
    navigate(`/watch/${content.id}`);
  };

  const handleMoreInfo = () => {
    // Could open a content details modal
    navigate(`/watch/${content.id}`);
  };

  return (
    <motion.section
      className={`relative h-[70vh] md:h-[80vh] overflow-hidden ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-surface animate-pulse" />
        )}
        <img
          src={content.backdropImage}
          alt={content.title}
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
        />
{/* Enhanced gradient overlays for wallpaper effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/60 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40" />
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex items-center">
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-xl lg:max-w-2xl"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
{/* Netflix-style wallpaper title */}
            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display font-bold text-white mb-4 leading-tight drop-shadow-2xl"
              style={{
                textShadow: '2px 2px 4px rgba(0,0,0,0.8), 0px 0px 8px rgba(0,0,0,0.5)'
              }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {content.title}
            </motion.h1>

            {/* Metadata */}
            <motion.div
              className="flex items-center space-x-4 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Rating rating={content.rating} />
              <Duration duration={content.duration} type={content.type} className="text-white" />
              <span className="text-white/80">{content.year}</span>
            </motion.div>

            {/* Genre tags */}
            <motion.div
              className="flex flex-wrap gap-2 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              {content.genre.slice(0, 3).map((genre) => (
                <span
                  key={genre}
                  className="px-3 py-1 bg-surface/80 text-accent text-sm rounded-full"
                >
                  {genre}
                </span>
              ))}
            </motion.div>

            {/* Description */}
            <motion.p
              className="text-white/90 text-lg md:text-xl leading-relaxed mb-8 line-clamp-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              {content.description}
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
            >
              <Button
                size="lg"
                onClick={handlePlay}
                icon="Play"
                className="bg-white text-black hover:bg-white/90 font-semibold shadow-lg"
              >
                Play
              </Button>
              
              <Button
                size="lg"
                variant="secondary"
                onClick={handleMoreInfo}
                icon="Info"
                className="bg-surface/80 text-white border-surface/80 hover:bg-surface hover:border-accent/50"
              >
                More Info
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.2 }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="text-white/60"
        >
          <ApperIcon name="ChevronDown" size={24} />
        </motion.div>
      </motion.div>
    </motion.section>
  );
};

export default HeroBanner;