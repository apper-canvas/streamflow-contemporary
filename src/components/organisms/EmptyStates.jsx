import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

export const EmptyWatchlist = ({ onBrowse, className = '' }) => {
  return (
    <motion.div
      className={`text-center py-16 ${className}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="mb-8"
      >
        <ApperIcon name="Bookmark" size={64} className="text-accent/30 mx-auto" />
      </motion.div>
      
      <h3 className="text-2xl font-semibold text-white mb-4">Your List is Empty</h3>
      <p className="text-accent/80 mb-8 max-w-lg mx-auto text-lg">
        Start building your personal collection by adding movies and shows you want to watch later.
      </p>
      
      {onBrowse && (
        <Button onClick={onBrowse} size="lg" icon="Compass">
          Discover Content
        </Button>
      )}
    </motion.div>
  );
};

export const EmptySearchResults = ({ query, onClearSearch, className = '' }) => {
  return (
    <motion.div
      className={`text-center py-16 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="mb-8"
      >
        <ApperIcon name="SearchX" size={64} className="text-accent/30 mx-auto" />
      </motion.div>
      
      <h3 className="text-2xl font-semibold text-white mb-4">No Results Found</h3>
      <p className="text-accent/80 mb-2 text-lg">
        We couldn't find anything matching
      </p>
      <p className="text-primary font-semibold mb-8 text-xl">"{query}"</p>
      <p className="text-accent/70 mb-8 max-w-md mx-auto">
        Try different keywords or browse our categories to discover something new.
      </p>
      
      {onClearSearch && (
        <Button onClick={onClearSearch} variant="secondary" icon="X">
          Clear Search
        </Button>
      )}
    </motion.div>
  );
};

export const EmptyCategory = ({ category, onBrowse, className = '' }) => {
  return (
    <motion.div
      className={`text-center py-16 ${className}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="mb-8"
      >
        <ApperIcon name="Film" size={64} className="text-accent/30 mx-auto" />
      </motion.div>
      
      <h3 className="text-2xl font-semibold text-white mb-4">Nothing Here Yet</h3>
      <p className="text-accent/80 mb-8 max-w-md mx-auto text-lg">
        We're still adding content to the {category} category. Check back soon for updates!
      </p>
      
      {onBrowse && (
        <Button onClick={onBrowse} variant="secondary" icon="ArrowLeft">
          Back to Browse
        </Button>
      )}
    </motion.div>
  );
};

export const GenericEmpty = ({ 
  title = "Nothing to show", 
  description = "There's no content here right now.",
  icon = "Package",
  actionLabel,
  onAction,
  className = '' 
}) => {
  return (
    <motion.div
      className={`text-center py-16 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="mb-8"
      >
        <ApperIcon name={icon} size={64} className="text-accent/30 mx-auto" />
      </motion.div>
      
      <h3 className="text-2xl font-semibold text-white mb-4">{title}</h3>
      <p className="text-accent/80 mb-8 max-w-md mx-auto text-lg">
        {description}
      </p>
      
      {actionLabel && onAction && (
        <Button onClick={onAction} icon="Plus">
          {actionLabel}
        </Button>
      )}
    </motion.div>
  );
};