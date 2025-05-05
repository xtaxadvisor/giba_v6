import { FileText, AlertTriangle, CheckCircle } from 'lucide-react';
import { Button } from '../../ui/Button';

interface AIDocumentAnalysisProps {
  findings?: string[];
  recommendations?: string[];
}

export function AIDocumentAnalysis({
  findings = ['All required tax forms present', 'Potential discrepancy in reported income'],
  recommendations = ['Request missing W-2 form from employer', 'Verify reported business expenses']
}: AIDocumentAnalysisProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">AI Document Analysis</h3>

      <div className="space-y-4">
        <div className="border rounded-lg p-4">
          <h4 className="font-medium text-gray-900">Key Findings</h4>
          <div className="mt-2 space-y-2">
            {findings.map((finding, index) => (
              <div key={index} className="flex items-start space-x-2">
                {finding.toLowerCase().includes('discrepancy') ? (
                  <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                ) : (
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                )}
                <span className="text-gray-600">{finding}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="border rounded-lg p-4">
          <h4 className="font-medium text-gray-900">Recommendations</h4>
          <ul className="mt-2 space-y-2 text-gray-600">
            {recommendations.map((rec, index) => (
              <li key={index} className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-blue-500" />
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>

        <Button variant="primary" className="w-full">
          Generate Detailed Report
        </Button>
      </div>
    </div>
  );
}