import { DivideIcon as LucideIcon } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: typeof LucideIcon;
  iconPosition?: 'left' | 'right';
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  className = '',
  type = 'button',
  'aria-label': ariaLabel,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-md transition-colors duration-300';
  
  const variants = {
    primary: 'bg-blue-800 text-white hover:bg-blue-900 focus:ring-2 focus:ring-offset-2 focus:ring-blue-700',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-2 focus:ring-offset-2 focus:ring-gray-500',
    outline: 'border-2 border-gray-700 text-gray-800 hover:bg-gray-50 focus:ring-2 focus:ring-offset-2 focus:ring-gray-600',
    ghost: 'text-gray-800 hover:text-gray-900 hover:bg-gray-100'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <button
      type={type}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      aria-label={ariaLabel || (typeof children === 'string' ? children : undefined)}
      {...props}
    >
      {Icon && iconPosition === 'left' && (
        <Icon className="mr-2 h-5 w-5" aria-hidden="true" />
      )}
      <span>{children}</span>
      {Icon && iconPosition === 'right' && (
        <Icon className="ml-2 h-5 w-5" aria-hidden="true" />
      )}
    </button>
  );
}