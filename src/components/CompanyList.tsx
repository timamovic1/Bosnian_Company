import { CompanyCard } from './CompanyCard';
import type { Company } from '../types/database';

interface CompanyListProps {
  companies: Company[];
  title?: string;
}

export function CompanyList({ companies, title = 'All Companies' }: CompanyListProps) {
  if (companies.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <p className="text-gray-500">No companies found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {companies.map((company) => (
          <CompanyCard key={company.id} company={company} />
        ))}
      </div>
    </div>
  );
}
