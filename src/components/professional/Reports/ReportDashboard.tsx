// Removed unused imports from 'lucide-react'
import { FinancialReport } from './FinancialReport';
import { ClientReport } from './ClientReport';
import { PerformanceReport } from './PerformanceMetrics';
import { useReports } from '../../../hooks/useReports';
import { ReportFilters } from './ReportFilters';
import { ReportExport } from './ReportExport';

export function ReportDashboard() {
  const {
    dateRange,
    setDateRange,
    reportType,
    setReportType,
    isLoading,
    exportReport
  } = useReports();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
        <div className="flex items-center space-x-4">
          <ReportFilters
            dateRange={dateRange}
            setDateRange={setDateRange}
            reportType={reportType}
            setReportType={setReportType}
          />
          <ReportExport onExport={exportReport} />
        </div>
      </div>

      {reportType === 'financial' && (
        <FinancialReport isLoading={isLoading} />
      )}
      
      {reportType === 'client' && (
        <ClientReport isLoading={isLoading} />
      )}
      
      {reportType === 'performance' && (
        <PerformanceReport dateRange={dateRange} isLoading={isLoading} />
      )}
    </div>
  );
}