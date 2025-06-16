import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import SearchBar from '@/components/molecules/SearchBar';
import ContentCard from '@/components/molecules/ContentCard';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import { SkeletonLoader } from '@/components/organisms/LoadingStates';
import { ErrorState } from '@/components/organisms/ErrorStates';
import { EmptySearchResults } from '@/components/organisms/EmptyStates';
import { contentService, watchProgressService } from '@/services';

const Search = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState([]);
  const [progressData, setProgressData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [filter, setFilter] = useState('all'); // all, movies, series
  const [sortBy, setSortBy] = useState('relevance'); // relevance, title, year

  useEffect(() => {
    const urlQuery = searchParams.get('q');
    if (urlQuery && urlQuery !== query) {
      setQuery(urlQuery);
      performSearch(urlQuery);
    }
  }, [searchParams]);

  useEffect(() => {
    loadProgressData();
  }, []);

  const loadProgressData = async () => {
    try {
      const progress = await watchProgressService.getAll();
      const progressMap = {};
      progress.forEach(p => {
        progressMap[p.contentId] = p;
      });
      setProgressData(progressMap);
    } catch (err) {
      // Progress data is optional, don't show error
      console.warn('Failed to load progress data:', err);
    }
  };

  const performSearch = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    setLoading(true);
    setError(null);
    setHasSearched(true);
    
    try {
      const searchResults = await contentService.searchContent(searchQuery);
      setResults(searchResults);
      
      // Update URL without triggering navigation
      setSearchParams({ q: searchQuery });
    } catch (err) {
      setError(err.message || 'Search failed');
      toast.error('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchQuery) => {
    setQuery(searchQuery);
    performSearch(searchQuery);
  };

  const handleClearSearch = () => {
    setQuery('');
    setResults([]);
    setHasSearched(false);
    setSearchParams({});
  };

  const getFilteredAndSortedResults = () => {
    let filtered = [...results];

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
        case 'relevance':
        default:
          // Keep original order for relevance
          return 0;
      }
    });

    return filtered;
  };

  const filteredResults = getFilteredAndSortedResults();
  const showEmptyState = hasSearched && results.length === 0 && !loading;
  const showNoFilterResults = hasSearched && results.length > 0 && filteredResults.length === 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-background"
    >
      <div className="container mx-auto px-4 py-8">
        {/* Header with Search */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">
            Search
          </h1>
          <SearchBar 
            onSearch={handleSearch}
            placeholder="Search for movies, shows, actors..."
            className="max-w-2xl"
          />
        </motion.div>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <SkeletonLoader count={8} />
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ErrorState 
                message={error}
                onRetry={() => performSearch(query)}
              />
            </motion.div>
          ) : showEmptyState ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <EmptySearchResults 
                query={query}
                onClearSearch={handleClearSearch}
              />
            </motion.div>
          ) : hasSearched && results.length > 0 ? (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Results header with filters */}
              <motion.div
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-semibold text-white">
                    {filteredResults.length} results for "{query}"
                  </h2>
                  {query && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleClearSearch}
                      icon="X"
                    >
                      Clear
                    </Button>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
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
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
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
                      className="bg-surface text-accent border border-secondary/30 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-primary/50"
                    >
                      <option value="relevance">Most Relevant</option>
                      <option value="title">Title A-Z</option>
                      <option value="year">Year (Newest)</option>
                    </select>
                  </div>
                </div>
              </motion.div>

              {/* Results Grid */}
              {showNoFilterResults ? (
                <motion.div
                  className="text-center py-16"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <ApperIcon name="Filter" size={48} className="text-accent/30 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">No {filter} found</h3>
                  <p className="text-accent/80 mb-6">
                    Try adjusting your filters or search for something else.
                  </p>
                  <Button
                    onClick={() => setFilter('all')}
                    variant="secondary"
                    icon="RotateCcw"
                  >
                    Show All Results
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {filteredResults.map((content, index) => (
                    <motion.div
                      key={content.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ 
                        delay: 0.1 * (index % 12), // Stagger by 12 items max
                        duration: 0.5 
                      }}
                    >
                      <ContentCard
                        content={content}
                        progress={progressData[content.id]?.progress || 0}
                        showProgress={!!progressData[content.id]?.progress}
                        size="md"
                      />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </motion.div>
          ) : !hasSearched ? (
            <motion.div
              key="initial"
              className="text-center py-16"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="mb-8"
              >
                <ApperIcon name="Search" size={64} className="text-accent/30 mx-auto" />
              </motion.div>
              
              <h3 className="text-2xl font-semibold text-white mb-4">
                Find Your Next Watch
              </h3>
              <p className="text-accent/80 mb-8 max-w-md mx-auto text-lg">
                Search through thousands of movies and TV shows to discover something perfect for you.
              </p>
              
              <Button onClick={() => navigate('/')} variant="secondary" icon="Compass">
                Browse Popular Content
              </Button>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Search;