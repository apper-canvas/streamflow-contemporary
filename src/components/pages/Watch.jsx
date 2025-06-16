import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import VideoPlayer from '@/components/organisms/VideoPlayer';
import { ErrorState, NotFound } from '@/components/organisms/ErrorStates';
import ApperIcon from '@/components/ApperIcon';
import { contentService, watchProgressService, userProfileService } from '@/services';

const Watch = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState(null);
  const [watchProgress, setWatchProgress] = useState(null);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadWatchData();
  }, [id]);

  const loadWatchData = async () => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const [contentData, progressData, watchlistIds] = await Promise.all([
        contentService.getById(id),
        watchProgressService.getByContentId(id),
        userProfileService.getWatchlist()
      ]);

      if (!contentData) {
        setError('Content not found');
        return;
      }

      setContent(contentData);
      setWatchProgress(progressData);
      setIsInWatchlist(watchlistIds.includes(id));
    } catch (err) {
      setError(err.message || 'Failed to load content');
      toast.error('Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleTimeUpdate = async (currentTime) => {
    if (!content || !currentTime) return;

    try {
      const progressPercentage = (currentTime / (content.duration * 60)) * 100;
      const isCompleted = progressPercentage >= 90; // Mark as completed at 90%

      await watchProgressService.updateProgress(
        content.id,
        Math.round(progressPercentage),
        isCompleted
      );

      setWatchProgress(prev => ({
        ...prev,
        progress: Math.round(progressPercentage),
        completed: isCompleted
      }));

      if (isCompleted && !watchProgress?.completed) {
        toast.success('Video completed!');
      }
    } catch (err) {
      // Don't show error for progress updates as they're not critical
      console.warn('Failed to update watch progress:', err);
    }
  };

  const handleToggleWatchlist = async () => {
    if (!content) return;

    try {
      if (isInWatchlist) {
        await userProfileService.removeFromWatchlist(content.id);
        setIsInWatchlist(false);
        toast.success('Removed from your list');
      } else {
        await userProfileService.addToWatchlist(content.id);
        setIsInWatchlist(true);
        toast.success('Added to your list');
      }
    } catch (err) {
      toast.error('Failed to update watchlist');
    }
  };

  if (loading) {
    return (
      <div className="h-screen bg-black flex items-center justify-center">
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
          <p>Loading content...</p>
        </motion.div>
      </div>
    );
  }

  if (error === 'Content not found') {
    return (
      <div className="h-screen bg-background flex items-center justify-center">
        <NotFound 
          title="Video Not Found"
          onGoHome={() => navigate('/')}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen bg-background flex items-center justify-center">
        <ErrorState 
          message={error}
          onRetry={loadWatchData}
        />
      </div>
    );
  }

  if (!content) {
    return null;
  }

  // Calculate initial playback time from progress
  const initialTime = watchProgress?.progress 
    ? (watchProgress.progress / 100) * (content.duration * 60)
    : 0;

  return (
    <motion.div
      className="h-screen bg-black relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Video Player */}
      <VideoPlayer
        src={`https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4`} // Demo video
        title={content.title}
        onBack={handleBack}
        onTimeUpdate={handleTimeUpdate}
        initialTime={initialTime}
        className="w-full h-full"
      />

      {/* Additional Controls Overlay */}
      <motion.div
        className="absolute top-4 right-4 z-50 flex items-center space-x-2"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
      >
        {/* Add to Watchlist Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleToggleWatchlist}
          className={`p-2 rounded-full transition-colors ${
            isInWatchlist 
              ? 'bg-primary text-white' 
              : 'bg-black/60 text-white hover:bg-black/80'
          }`}
          title={isInWatchlist ? 'Remove from My List' : 'Add to My List'}
        >
          <ApperIcon 
            name={isInWatchlist ? 'BookmarkCheck' : 'Bookmark'} 
            size={20} 
          />
        </motion.button>

        {/* Content Info Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
          title="Content Information"
        >
          <ApperIcon name="Info" size={20} />
        </motion.button>
      </motion.div>

      {/* Progress Indicator */}
      {watchProgress?.progress > 0 && (
        <motion.div
          className="absolute bottom-16 right-4 bg-black/80 text-white px-3 py-1 rounded-full text-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          {watchProgress.progress}% watched
        </motion.div>
      )}
    </motion.div>
  );
};

export default Watch;