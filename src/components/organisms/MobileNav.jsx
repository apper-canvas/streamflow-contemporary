import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import { routes } from '@/config/routes';

const MobileNav = () => {
  const location = useLocation();
  
  // Don't show mobile nav on watch page
  if (location.pathname.startsWith('/watch')) {
    return null;
  }

  const navItems = Object.values(routes).filter(route => !route.hideInNav);

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <motion.nav
      className="md:hidden fixed bottom-0 left-0 right-0 bg-surface/95 backdrop-blur-md border-t border-secondary/20 z-40"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-around h-16 px-4">
        {navItems.map((item) => {
          const active = isActive(item.path);
          
          return (
            <Link
              key={item.id}
              to={item.path}
              className={`flex flex-col items-center justify-center min-w-0 flex-1 py-2 px-1 transition-colors duration-200 ${
                active ? 'text-primary' : 'text-accent/70 hover:text-accent'
              }`}
            >
              <motion.div
                whileTap={{ scale: 0.9 }}
                className="relative"
              >
                <ApperIcon name={item.icon} size={20} />
                {active && (
                  <motion.div
                    className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full"
                    layoutId="mobileActiveTab"
                    initial={false}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </motion.div>
              <span className="text-xs mt-1 truncate">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </motion.nav>
  );
};

export default MobileNav;