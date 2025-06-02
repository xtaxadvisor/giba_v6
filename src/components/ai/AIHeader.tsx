// src/components/ai/AIHeader.tsx
import { Bot, X } from 'lucide-react';
import { Button } from '../ui/Button';

interface AIHeaderProps {
  onClose?: () => void;
  title?: string;
  subtitle?: string;
}

export function AIHeader({
  onClose,
  title = 'Jennifer',
  subtitle = 'Your ProTaxAdvisors Assistant'
}: AIHeaderProps) {
  return (
    <header
      className="flex items-center justify-between p-4 border-b border-gray-200 bg-white rounded-t-lg"
      role="banner"
      aria-label={`${title} assistant header`}
    >
      <div className="flex items-center space-x-2">
        <div className="p-2 bg-blue-100 rounded-full">
          <Bot className="h-5 w-5 text-blue-600" aria-hidden="true" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-gray-900">{title}</h3>
          <p className="text-xs text-gray-500">{subtitle}</p>
        </div>
      </div>

      {onClose && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          icon={X}
          aria-label="Close assistant window"
          className="text-gray-500 hover:text-gray-700 transition-colors"
        />
      )}
    </header>
  );
}