import React from 'react';

export interface DocumentFiltersProps {
  filters: Record<string, any>; // Adjust the type as per your filters structure
  onFilterChange: (filters: Record<string, any>) => void;
}
// Removed redundant function definition
export const DocumentFilters: React.FC<DocumentFiltersProps> = ({ onFilterChange }) => {
  return (
    <div className="mb-4">
      <input
        type="text"
        placeholder="Search documents..."
        onChange={(e) => onFilterChange({ search: e.target.value })}
        className="w-full px-3 py-2 border rounded shadow-sm"
      />
    </div>
  );
};