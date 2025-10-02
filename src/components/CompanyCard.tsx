import { ExternalLink, Star } from 'lucide-react';
import type { Company } from '../types/database';

interface CompanyCardProps {
  company: Company;
}

export function CompanyCard({ company }: CompanyCardProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        className={i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
      />
    ));
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">{company.name}</h3>
          <p className="text-sm text-gray-600 mt-1">
            {company.sector} • {company.city}
          </p>
        </div>
        {company.website && (
          <a
            href={company.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ExternalLink size={20} />
          </a>
        )}
      </div>

      <p className="text-gray-700 mb-4">{company.description}</p>

      <div className="flex items-center gap-2">
        <div className="flex gap-1">{renderStars(company.rating_avg)}</div>
        <span className="text-sm font-medium text-gray-700">{company.rating_avg.toFixed(1)}</span>
        <span className="text-sm text-gray-500">({company.reviews_count} reviews)</span>
      </div>
    </div>
  );
}
