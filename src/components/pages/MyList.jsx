import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ContentCard from '@/components/molecules/ContentCard';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import { SkeletonLoader } from '@/components/organisms/LoadingStates';
import { ErrorState } from '@/components/organisms/ErrorStates';
import { EmptyWatchlist } from '@/components/organisms/EmptyStates';
import { userProfileService, contentService, watchProgressService } from '@/services';

const MyList = () => {
  const navigate = useNavigate();
  const [watchlistContent, setWatchlistContent] = useState([]);
  const [progressData, setProgressData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, movies, series
  const [sortBy, setSortBy] = useState('added'); // added, title, year

  useEffect(() => {
    loadWatchlist();
  }, []);

  const loadWatchlist = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [watchlistIds, allContent, progress] = await Promise.all([
        userProfileService.getWatchlist(),
        contentService.getAll(),
        watchProgressService.getAll()
      ]);

      // Get content for watchlist items
      const watchlistItems = watchlistIds
        .map(id => allContent.find(content => content.id === id))
        .filter(Boolean);

      // Create progress data mapping
      const progressMap = {};
      progress.forEach(p => {
        progressMap[p.contentId] = p;
      });

      setWatchlistContent(watchlistItems);
      setProgressData(progressMap);
    } catch (err) {
      setError(err.message || 'Failed to load watchlist');
      toast.error('Failed to load watchlist');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWatchlist = async (contentId) => {
    try {
      await userProfileService.removeFromWatchlist(contentId);
      setWatchlistContent(prev => prev.filter(item => item.id !== contentId));
      toast.success('Removed from your list');
    } catch (err) {
      toast.error('Failed to remove from list');
    }
  };

  const handleBrowseContent = () => {
    navigate('/');
  };

  const getFilteredAndSortedContent = () => {
    let filtered = [...watchlistContent];

    // Apply filter
    if (filter === 'movies') {
      filtered = filtered.filter(item => item.type === 'movie');
    } else if (filter === 'series') {
      filtered = filtered.filter(item => item.type === 'series');
    }

    // Apply sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'year':
          return b.year - a.year;
        case 'added':
        default:
          return 0; // Keep original order for "added"
      }
    });

    return filtered;
  };

  const filteredContent = getFilteredAndSortedContent();

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-background"
      >
        <div className="container mx-auto px-4 py-8">
          <div className="h-8 bg-surface rounded w-48 mb-8 animate-pulse" />
          <SkeletonLoader count={6} />
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <ErrorState 
          message={error}
          onRetry={loadWatchlist}
        />
      </div>
    );
  }

  if (watchlistContent.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <EmptyWatchlist onBrowse={handleBrowseContent} />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-background"
    >
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">
            My List
          </h1>
          <p className="text-accent/80">
            {watchlistContent.length} {watchlistContent.length === 1 ? 'item' : 'items'} saved
          </p>
        </motion.div>

        {/* Filters and Sort */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 mb-8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {/* Filter buttons */}
          <div className="flex gap-2">
            {[
              { id: 'all', label: 'All' },
              { id: 'movies', label: 'Movies' },
              { id: 'series', label: 'Series' }
            ].map((filterOption) => (
              <button
                key={filterOption.id}
                onClick={() => setFilter(filterOption.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  filter === filterOption.id
                    ? 'bg-primary text-white'
                    : 'bg-surface text-accent hover:bg-surface/80'
                }`}
              >
                {filterOption.label}
              </button>
            ))}
          </div>

          {/* Sort dropdown */}
          <div className="flex items-center gap-2">
            <ApperIcon name="ArrowUpDown" size={16} className="text-accent/60" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-surface text-accent border border-secondary/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/50"
            >
              <option value="added">Recently Added</option>
              <option value="title">Title A-Z</option>
              <option value="year">Year (Newest)</option>
            </select>
          </div>
        </motion.div>

        {/* Content Grid */}
        {filteredContent.length > 0 ? (
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {filteredContent.map((content, index) => (
              <motion.div
                key={content.id}
                className="relative group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.5 }}
              >
                <ContentCard
                  content={content}
                  progress={progressData[content.id]?.progress || 0}
                  showProgress={!!progressData[content.id]?.progress}
                  size="md"
                />
                
                {/* Remove button */}
                <motion.button
                  className="absolute top-2 right-2 bg-black/70 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-error"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFromWatchlist(content.id);
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ApperIcon name="X" size={14} />
                </motion.button>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <ApperIcon name="Filter" size={48} className="text-accent/30 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No {filter} found</h3>
            <p className="text-accent/80 mb-6">
              Try adjusting your filters to see more content.
            </p>
            <Button
              onClick={() => setFilter('all')}
              variant="secondary"
              icon="RotateCcw"
            >
              Reset Filters
            </Button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default MyList;