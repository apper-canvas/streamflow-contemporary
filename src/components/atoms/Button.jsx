import { motion } from 'framer-motion';
import { forwardRef } from 'react';
import ApperIcon from '@/components/ApperIcon';

const Button = forwardRef(({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon, 
  iconPosition = 'left',
  disabled = false,
  className = '',
  ...props 
}, ref) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50';
  
  const variantClasses = {
    primary: 'bg-primary text-white hover:bg-primary/90 shadow-lg hover:shadow-xl',
    secondary: 'bg-surface text-accent border border-secondary hover:border-accent hover:bg-secondary/20',
    ghost: 'text-accent hover:bg-surface/50',
    danger: 'bg-error text-white hover:bg-error/90'
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
    xl: 'px-8 py-4 text-xl'
  };

  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : '';

  const iconSize = {
    sm: 16,
    md: 18,
    lg: 20,
    xl: 22
  };

  return (
    <motion.button
      ref={ref}
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`}
      disabled={disabled}
      {...props}
    >
      {icon && iconPosition === 'left' && (
        <ApperIcon name={icon} size={iconSize[size]} className="mr-2" />
      )}
      {children}
      {icon && iconPosition === 'right' && (
        <ApperIcon name={icon} size={iconSize[size]} className="ml-2" />
      )}
    </motion.button>
  );
});

Button.displayName = 'Button';

export default Button;