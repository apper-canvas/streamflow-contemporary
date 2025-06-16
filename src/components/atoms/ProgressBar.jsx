import { motion } from 'framer-motion';

const ProgressBar = ({ progress = 0, className = '', showLabel = false }) => {
  return (
    <div className={`w-full ${className}`}>
      <div className="w-full bg-secondary/30 rounded-full h-1">
        <motion.div
          className="bg-primary h-1 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      </div>
      {showLabel && (
        <div className="text-xs text-accent/70 mt-1">
          {Math.round(progress)}% complete
        </div>
      )}
    </div>
  );
};

export default ProgressBar;