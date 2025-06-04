import { Copy, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface AIResponseActionsProps {
  onCopy: () => void;
  onFeedback: (isPositive: boolean) => void;
}

export function AIResponseActions({ onCopy, onFeedback }: AIResponseActionsProps) {
  return (
    <div className="flex items-center space-x-2 mt-2">
      {/* Copy Button */}
      <Button
        variant="ghost"
        size="sm"
        icon={Copy}
        onClick={onCopy}
        aria-label="Copy response"
        className="text-gray-500 hover:text-gray-700"
      >
        Copy
      </Button>

      {/* Feedback Buttons */}
      <div className="flex items-center space-x-1">
        <Button
          variant="ghost"
          size="sm"
          icon={ThumbsUp}
          aria-label="Thumbs up"
          onClick={() => onFeedback(true)}
          className="text-gray-500 hover:text-green-600"
        />
        <Button
          variant="ghost"
          size="sm"
          icon={ThumbsDown}
          aria-label="Thumbs down"
          onClick={() => onFeedback(false)}
          className="text-gray-500 hover:text-red-600"
        />
      </div>
    </div>
  );
}