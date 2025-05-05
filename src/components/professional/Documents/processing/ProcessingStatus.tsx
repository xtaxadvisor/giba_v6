import { Clock, CheckCircle, XCircle } from 'lucide-react';
import { formatTimeAgo } from '../../../../utils/date';
import { calculateProcessingTime } from '../../../../utils/documents/processing';
import type { ProcessingStep } from '../../../../types/documents';

interface ProcessingStatusProps {
  steps: ProcessingStep[];
  startTime: string;
}

export function ProcessingStatus({ steps, startTime }: ProcessingStatusProps) {
  const processingTime = calculateProcessingTime(startTime);

  const completedSteps = steps.filter(step => step.status === 'completed').length;
  const progressPercent = Math.round((completedSteps / steps.length) * 100);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-500">Processing Time</span>
        <span className="text-sm text-gray-900">{processingTime}</span>
      </div>

      <div>
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-gray-500">Progress</span>
          <span className="text-sm text-gray-700">{progressPercent}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="relative">
        {steps.map((step) => (
          <div key={step.id} className="flex items-center mb-4">
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
              step.status === 'completed' ? 'bg-green-100' :
              step.status === 'processing' ? 'bg-blue-100' :
              step.status === 'error' ? 'bg-red-100' : 'bg-gray-100'
            }`}>
              {step.status === 'completed' ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : step.status === 'processing' ? (
                <Clock className="h-5 w-5 text-blue-600" />
              ) : step.status === 'error' ? (
                <XCircle className="h-5 w-5 text-red-600" />
              ) : (
                <Clock className="h-5 w-5 text-gray-400" />
              )}
            </div>
            <div className="ml-4 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">{step.name}</span>
                {step.completedAt && (
                  <span className="text-xs text-gray-500">
                    {formatTimeAgo(step.completedAt)}
                  </span>
                )}
              </div>
              {step.error && (
                <p className="mt-1 text-sm text-red-600">{step.error}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}