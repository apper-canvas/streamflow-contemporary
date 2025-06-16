import { motion } from 'framer-motion';

export const SkeletonLoader = ({ count = 3, className = '' }) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {[...Array(count)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="animate-pulse"
        >
          <div className="bg-surface rounded-lg p-6">
            <div className="flex space-x-4">
              <div className="w-16 h-16 bg-secondary rounded-lg flex-shrink-0" />
              <div className="flex-1 space-y-3">
                <div className="h-4 bg-secondary rounded w-3/4" />
                <div className="h-4 bg-secondary rounded w-1/2" />
                <div className="h-4 bg-secondary rounded w-2/3" />
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export const ContentRowSkeleton = ({ className = '' }) => {
  return (
    <div className={`py-6 ${className}`}>
      <div className="container mx-auto px-4">
        {/* Title skeleton */}
        <div className="h-6 bg-surface rounded w-48 mb-4 animate-pulse" />
        
        {/* Cards skeleton */}
        <div className="flex space-x-4 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="flex-shrink-0 w-40 h-60 bg-surface rounded-lg animate-pulse"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export const HeroBannerSkeleton = ({ className = '' }) => {
  return (
    <div className={`h-[70vh] md:h-[80vh] bg-surface animate-pulse ${className}`}>
      <div className="absolute inset-0 flex items-center">
        <div className="container mx-auto px-4 max-w-xl lg:max-w-2xl">
          <div className="space-y-4">
            <div className="h-12 md:h-16 bg-secondary rounded w-3/4" />
            <div className="flex space-x-4">
              <div className="h-6 bg-secondary rounded w-20" />
              <div className="h-6 bg-secondary rounded w-24" />
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-secondary rounded w-full" />
              <div className="h-4 bg-secondary rounded w-5/6" />
              <div className="h-4 bg-secondary rounded w-4/6" />
            </div>
            <div className="flex space-x-4 pt-4">
              <div className="h-12 bg-secondary rounded w-32" />
              <div className="h-12 bg-secondary rounded w-32" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};