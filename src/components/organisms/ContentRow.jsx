import { motion } from 'framer-motion';
import { useRef, useState } from 'react';
import ContentCard from '@/components/molecules/ContentCard';
import ApperIcon from '@/components/ApperIcon';

const ContentRow = ({ 
  title, 
  content = [], 
  showProgress = false, 
  progressData = {},
  className = '',
  cardSize = 'md'
}) => {
  const isContinueWatchingRow = title === 'Continue Watching';
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const scroll = (direction) => {
    const container = scrollRef.current;
    if (!container) return;

    const scrollAmount = 320; // Adjust based on card width
    const newScrollLeft = container.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
    
    container.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth'
    });
  };

  const handleScroll = () => {
    const container = scrollRef.current;
    if (!container) return;

    setCanScrollLeft(container.scrollLeft > 0);
    setCanScrollRight(
      container.scrollLeft < container.scrollWidth - container.clientWidth - 10
    );
  };

  if (!content.length) return null;

  return (
    <motion.section
      className={`py-6 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
    >
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <motion.h2
          className="text-xl md:text-2xl font-semibold text-white mb-4"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {title}
        </motion.h2>

        {/* Content Row */}
        <div className="relative group">
          {/* Left scroll button */}
          <motion.button
            onClick={() => scroll('left')}
            className={`absolute left-0 top-1/2 transform -translate-y-1/2 z-20 bg-black/60 text-white rounded-full p-2 transition-all duration-200 ${
              canScrollLeft 
                ? 'opacity-0 group-hover:opacity-100 hover:bg-black/80' 
                : 'opacity-0 pointer-events-none'
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ApperIcon name="ChevronLeft" size={20} />
          </motion.button>

          {/* Right scroll button */}
          <motion.button
            onClick={() => scroll('right')}
            className={`absolute right-0 top-1/2 transform -translate-y-1/2 z-20 bg-black/60 text-white rounded-full p-2 transition-all duration-200 ${
              canScrollRight 
                ? 'opacity-0 group-hover:opacity-100 hover:bg-black/80' 
                : 'opacity-0 pointer-events-none'
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ApperIcon name="ChevronRight" size={20} />
          </motion.button>

          {/* Scrollable content */}
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex space-x-4 overflow-x-auto horizontal-scroll pb-2"
            style={{ scrollbarWidth: 'thin' }}
          >
            {content.map((item, index) => (
              <motion.div
                key={item.id}
                className="flex-shrink-0"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.1,
                  ease: "easeOut"
                }}
              >
<ContentCard
                  content={item}
                  progress={progressData[item.id]?.progress || 0}
                  showProgress={showProgress}
                  size={cardSize}
                  isContinueWatching={isContinueWatchingRow}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default ContentRow;