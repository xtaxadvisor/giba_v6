import { Search, Filter } from 'lucide-react';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';

interface FormSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  selectedYear: string;
  onYearChange: (value: string) => void;
}

export function FormSearch({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedYear,
  onYearChange
}: FormSearchProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8">
      <div className="flex-1">
        <Input
          placeholder="Search forms..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          icon={Search}
        />
      </div>
      <div className="flex gap-4">
        <Select
          value={selectedCategory}
          onChange={onCategoryChange}
          icon={Filter}
          options={[
            { value: 'all', label: 'All Categories' },
            { value: 'individual', label: 'Individual' },
            { value: 'business', label: 'Business' },
            { value: 'employment', label: 'Employment' },
          ]}
        />
        <Select
          value={selectedYear}
          onChange={onYearChange}
          options={[
            { value: '2023', label: '2023' },
            { value: '2022', label: '2022' },
            { value: '2021', label: '2021' },
          ]}
        />
      </div>
    </div>
  );
}