import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

export const ErrorState = ({ 
  message = "Something went wrong", 
  onRetry, 
  className = '' 
}) => {
  return (
    <motion.div
      className={`text-center py-12 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        animate={{ rotate: [0, 5, -5, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="mb-6"
      >
        <ApperIcon name="AlertTriangle" size={48} className="text-error mx-auto" />
      </motion.div>
      
      <h3 className="text-xl font-semibold text-white mb-2">Oops!</h3>
      <p className="text-accent/80 mb-6 max-w-md mx-auto">{message}</p>
      
      {onRetry && (
        <Button onClick={onRetry} variant="secondary" icon="RefreshCw">
          Try Again
        </Button>
      )}
    </motion.div>
  );
};

export const NetworkError = ({ onRetry, className = '' }) => {
  return (
    <motion.div
      className={`text-center py-12 ${className}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="mb-6"
      >
        <ApperIcon name="WifiOff" size={48} className="text-error mx-auto" />
      </motion.div>
      
      <h3 className="text-xl font-semibold text-white mb-2">Connection Lost</h3>
      <p className="text-accent/80 mb-6 max-w-md mx-auto">
        Please check your internet connection and try again.
      </p>
      
      {onRetry && (
        <Button onClick={onRetry} variant="primary" icon="RefreshCw">
          Reconnect
        </Button>
      )}
    </motion.div>
  );
};

export const NotFound = ({ title = "Content Not Found", onGoHome, className = '' }) => {
  return (
    <motion.div
      className={`text-center py-12 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="mb-6"
      >
        <ApperIcon name="FileX" size={48} className="text-accent/50 mx-auto" />
      </motion.div>
      
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-accent/80 mb-6 max-w-md mx-auto">
        The content you're looking for doesn't exist or has been removed.
      </p>
      
      {onGoHome && (
        <Button onClick={onGoHome} variant="primary" icon="Home">
          Go Home
        </Button>
      )}
    </motion.div>
  );
};