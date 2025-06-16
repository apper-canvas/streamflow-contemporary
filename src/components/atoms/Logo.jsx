import { motion } from 'framer-motion';

const Logo = ({ className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl'
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`font-display font-bold text-primary cursor-pointer ${sizeClasses[size]} ${className}`}
    >
      StreamFlow
    </motion.div>
  );
};

export default Logo;