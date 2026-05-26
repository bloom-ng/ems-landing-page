import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  isLoading = false,
  className = '',
  disabled,
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-bold transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed rounded-default border-[0.5px] border-border shadow-border active:border-[1px] relative';
  
  const variants = {
    primary: 'bg-primary text-white border-primary/20 hover:bg-primary/95',
    secondary: 'bg-white text-foreground hover:bg-slate-50',
    outline: 'bg-transparent text-primary border-primary/40 hover:bg-primary/5',
    ghost: 'border-transparent text-muted hover:bg-foreground/5 shadow-none',
    danger: 'bg-error text-white border-error/20 hover:bg-error/90',
  };

  const sizes = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-current/20 border-t-current rounded-full animate-spin" />
        </div>
      ) : (
        children
      )}
    </button>
  );
};
