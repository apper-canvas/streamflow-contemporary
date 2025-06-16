import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const SearchBar = ({ onSearch, placeholder = "Search movies and shows...", className = '' }) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const debouncedSearch = useCallback((searchQuery) => {
    const timeoutId = setTimeout(() => {
      onSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [onSearch]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSearch(value);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <motion.div
      className={`relative ${className}`}
      animate={{ scale: isFocused ? 1.02 : 1 }}
      transition={{ duration: 0.2 }}
    >
      <div className="relative">
        <ApperIcon 
          name="Search" 
          size={20} 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-accent/60"
        />
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="w-full bg-surface border border-secondary/30 rounded-lg pl-10 pr-10 py-3 text-accent placeholder-accent/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all duration-200"
        />
        {query && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-accent/60 hover:text-accent transition-colors duration-200"
          >
            <ApperIcon name="X" size={18} />
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

export default SearchBar;