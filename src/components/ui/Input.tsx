import { DivideIcon as LucideIcon } from 'lucide-react';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  icon?: typeof LucideIcon;
  helperText?: string;
  multiline?: boolean;
  rows?: number;
}

export function Input({
  label,
  error,
  icon: Icon,
  helperText,
  className = '',
  multiline = false,
  rows = 4,
  id,
  name,
  'aria-label': ariaLabel,
  ...props
}: InputProps) {
  // Generate a unique ID if none provided
  const inputId = id || name || `input-${Math.random().toString(36).substr(2, 9)}`;
  const labelText = label || ariaLabel;
  
  const baseClasses = `
    block w-full rounded-md shadow-sm
    ${Icon ? 'pl-10' : 'pl-3'} pr-3 py-2
    ${error
      ? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500'
      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-gray-900'
    }
    ${className}
  `;

  return (
    <div className="w-full">
      {labelText && (
        <label 
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {labelText}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
        )}
        {multiline ? (
          <textarea
            id={inputId}
            name={name}
            rows={rows}
            className={baseClasses}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? `${inputId}-error` : undefined}
            {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
          />
        ) : (
          <input
            id={inputId}
            name={name}
            className={baseClasses}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? `${inputId}-error` : undefined}
            {...props}
          />
        )}
      </div>
      {(error || helperText) && (
        <p 
          className={`mt-1 text-sm ${error ? 'text-red-600' : 'text-gray-500'}`}
          id={error ? `${inputId}-error` : undefined}
        >
          {error || helperText}
        </p>
      )}
    </div>
  );
}