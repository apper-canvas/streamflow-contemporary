import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import HeroBanner from '@/components/organisms/HeroBanner';
import ContentRow from '@/components/organisms/ContentRow';
import { SkeletonLoader, ContentRowSkeleton, HeroBannerSkeleton } from '@/components/organisms/LoadingStates';
import { ErrorState } from '@/components/organisms/ErrorStates';
import { contentService, watchProgressService } from '@/services';

const Browse = () => {
  const navigate = useNavigate();
  const [featuredContent, setFeaturedContent] = useState(null);
  const [trendingContent, setTrendingContent] = useState([]);
  const [recentContent, setRecentContent] = useState([]);
  const [continueWatchingContent, setContinueWatchingContent] = useState([]);
  const [actionContent, setActionContent] = useState([]);
  const [dramaContent, setDramaContent] = useState([]);
  const [progressData, setProgressData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadBrowseData();
  }, []);

  const loadBrowseData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Load all data concurrently
      const [
        featured,
        trending,
        recent,
        continueWatching,
        action,
        drama,
        progress
      ] = await Promise.all([
        contentService.getFeatured(),
        contentService.getTrending(),
        contentService.getRecentlyAdded(),
        watchProgressService.getContinueWatching(),
        contentService.getByCategory('Action'),
        contentService.getByCategory('Drama'),
        watchProgressService.getAll()
      ]);

      setFeaturedContent(featured);
      setTrendingContent(trending);
      setRecentContent(recent);
      
      // For continue watching, we need to get the actual content
      if (continueWatching.length > 0) {
        const allContent = await contentService.getAll();
        const continueWatchingWithContent = continueWatching
          .map(progress => {
            const content = allContent.find(c => c.id === progress.contentId);
            return content;
          })
          .filter(Boolean);
        setContinueWatchingContent(continueWatchingWithContent);
      }

      setActionContent(action);
      setDramaContent(drama);

      // Create progress data mapping
      const progressMap = {};
      progress.forEach(p => {
        progressMap[p.contentId] = p;
      });
      setProgressData(progressMap);

    } catch (err) {
      setError(err.message || 'Failed to load content');
      toast.error('Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  const handleBrowseMore = () => {
    navigate('/search');
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-background"
      >
        <HeroBannerSkeleton />
        <div className="space-y-8">
          <ContentRowSkeleton />
          <ContentRowSkeleton />
          <ContentRowSkeleton />
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <ErrorState 
          message={error}
          onRetry={loadBrowseData}
        />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-background"
    >
      {/* Hero Banner */}
      {featuredContent && (
        <HeroBanner content={featuredContent} />
      )}

      {/* Content Rows */}
      <div className="space-y-8 pb-8">
        {/* Continue Watching */}
        {continueWatchingContent.length > 0 && (
          <ContentRow
            title="Continue Watching"
            content={continueWatchingContent}
            showProgress={true}
            progressData={progressData}
            cardSize="md"
          />
        )}

        {/* Trending Now */}
        <ContentRow
          title="Trending Now"
          content={trendingContent}
          cardSize="lg"
        />

        {/* Recently Added */}
        <ContentRow
          title="Recently Added"
          content={recentContent}
          cardSize="md"
        />

        {/* Action Movies & Shows */}
        <ContentRow
          title="Action & Adventure"
          content={actionContent}
          cardSize="md"
        />

        {/* Drama Series */}
        <ContentRow
          title="Drama Series"
          content={dramaContent}
          cardSize="md"
        />

        <ContentRow
          title="Popular Movies"
          content={trendingContent.filter(c => c.type === 'movie')}
          cardSize="sm"
        />

        <ContentRow
          title="Binge-Worthy Series"
          content={trendingContent.filter(c => c.type === 'series')}
          cardSize="sm"
        />
      </div>
    </motion.div>
  );
};

export default Browse;