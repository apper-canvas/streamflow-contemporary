import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Logo from '@/components/atoms/Logo';
import SearchBar from '@/components/molecules/SearchBar';
import ApperIcon from '@/components/ApperIcon';
import { routes } from '@/config/routes';

const Header = ({ isScrolled = false }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const mainNavItems = Object.values(routes).filter(route => !route.hideInNav);

  const handleSearch = (query) => {
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled ? 'bg-background/95 backdrop-blur-md border-b border-secondary/20' : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <Logo size="md" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {mainNavItems.map((item) => (
              <Link
                key={item.id}
                to={item.path}
                className={`text-sm font-medium transition-colors duration-200 relative ${
                  isActive(item.path)
                    ? 'text-primary'
                    : 'text-accent hover:text-primary'
                }`}
              >
                {item.label}
                {isActive(item.path) && (
                  <motion.div
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary"
                    layoutId="activeTab"
                    initial={false}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* Search Bar - Desktop */}
          <div className="hidden md:block flex-1 max-w-md ml-8">
            <SearchBar onSearch={handleSearch} />
          </div>

          {/* Profile & Mobile Menu */}
          <div className="flex items-center space-x-4">
            {/* Search Icon - Mobile */}
            <Link
              to="/search"
              className="md:hidden text-accent hover:text-primary transition-colors"
            >
              <ApperIcon name="Search" size={20} />
            </Link>

            {/* Profile */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-8 h-8 rounded-full bg-primary flex items-center justify-center cursor-pointer"
            >
              <ApperIcon name="User" size={16} className="text-white" />
            </motion.div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden text-accent hover:text-primary transition-colors"
            >
              <ApperIcon name={showMobileMenu ? "X" : "Menu"} size={20} />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <motion.div
          initial={false}
          animate={{ height: showMobileMenu ? 'auto' : 0, opacity: showMobileMenu ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden overflow-hidden"
        >
          <div className="py-4 space-y-4 border-t border-secondary/20">
            {/* Mobile Search */}
            <SearchBar onSearch={handleSearch} />
            
            {/* Mobile Navigation Links */}
            <nav className="space-y-2">
              {mainNavItems.map((item) => (
                <Link
                  key={item.id}
                  to={item.path}
                  onClick={() => setShowMobileMenu(false)}
                  className={`flex items-center space-x-3 py-2 px-3 rounded-lg transition-colors ${
                    isActive(item.path)
                      ? 'bg-primary/10 text-primary'
                      : 'text-accent hover:bg-surface hover:text-primary'
                  }`}
                >
                  <ApperIcon name={item.icon} size={18} />
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>
        </motion.div>
      </div>
    </motion.header>
  );
};

export default Header;