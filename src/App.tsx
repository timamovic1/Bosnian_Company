import { useEffect, useState } from 'react';
import { Building2 } from 'lucide-react';
import { supabase } from './lib/supabase';
import { CompanyList } from './components/CompanyList';
import { ChatBox } from './components/ChatBox';
import type { Company, ChatMessage, SearchFilters } from './types/database';

const CITIES = ['sarajevo', 'mostar', 'tuzla', 'banja luka', 'zenica', 'bihać', 'visoko', 'tešanj', 'čapljina', 'brčko'];
const SECTORS = ['it', 'energy', 'healthcare', 'finance', 'retail', 'manufacturing'];

function App() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [listTitle, setListTitle] = useState('All Companies');

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    // --- DEBUG: Using mock data to isolate frontend ---
    // The Supabase data fetching has been temporarily disabled for debugging.
    // Uncomment the block below to restore live data fetching from Supabase.

    /*
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('rating_avg', { ascending: false });

      if (error) throw error;

      if (data) {
        setCompanies(data);
        setFilteredCompanies(data);
      }
    } catch (error) {
      console.error('Error loading companies:', error);
    }
    */

    // --- MOCK DATA: High-fidelity mock matching the exact Company type structure ---
    const mockCompaniesData: Company[] = [
      {
        id: 'mock-uuid-001',
        name: 'BH Telecom',
        sector: 'IT',
        city: 'Sarajevo',
        website: 'https://www.bhtelecom.ba',
        description: 'Leading telecom operator',
        rating_avg: 4.2,
        reviews_count: 132,
        created_at: '2024-01-15T10:00:00Z',
        updated_at: '2024-01-15T10:00:00Z'
      },
      {
        id: 'mock-uuid-002',
        name: 'Energoinvest',
        sector: 'Energy',
        city: 'Sarajevo',
        website: 'https://www.energoinvest.ba',
        description: 'Energy & engineering',
        rating_avg: 4.0,
        reviews_count: 58,
        created_at: '2024-01-15T10:00:00Z',
        updated_at: '2024-01-15T10:00:00Z'
      },
      {
        id: 'mock-uuid-003',
        name: 'Bosnalijek',
        sector: 'Healthcare',
        city: 'Sarajevo',
        website: 'https://www.bosnalijek.com',
        description: 'Pharmaceuticals',
        rating_avg: 4.3,
        reviews_count: 91,
        created_at: '2024-01-15T10:00:00Z',
        updated_at: '2024-01-15T10:00:00Z'
      },
      {
        id: 'mock-uuid-004',
        name: 'UniCredit Bank d.d.',
        sector: 'Finance',
        city: 'Mostar',
        website: 'https://www.unicredit.ba',
        description: 'Banking services',
        rating_avg: 4.1,
        reviews_count: 75,
        created_at: '2024-01-15T10:00:00Z',
        updated_at: '2024-01-15T10:00:00Z'
      },
      {
        id: 'mock-uuid-005',
        name: 'Bingo',
        sector: 'Retail',
        city: 'Tuzla',
        website: 'https://bingobih.ba',
        description: 'Retail chain',
        rating_avg: 4.4,
        reviews_count: 201,
        created_at: '2024-01-15T10:00:00Z',
        updated_at: '2024-01-15T10:00:00Z'
      },
      {
        id: 'mock-uuid-006',
        name: 'Telemach',
        sector: 'IT',
        city: 'Sarajevo',
        website: 'https://telemach.ba',
        description: 'Telecom & cable TV',
        rating_avg: 4.1,
        reviews_count: 120,
        created_at: '2024-01-15T10:00:00Z',
        updated_at: '2024-01-15T10:00:00Z'
      },
      {
        id: 'mock-uuid-007',
        name: 'BBI Centar',
        sector: 'Retail',
        city: 'Sarajevo',
        website: 'https://www.bbicentar.ba',
        description: 'Shopping center',
        rating_avg: 4.5,
        reviews_count: 245,
        created_at: '2024-01-15T10:00:00Z',
        updated_at: '2024-01-15T10:00:00Z'
      },
      {
        id: 'mock-uuid-008',
        name: 'M:tel',
        sector: 'IT',
        city: 'Banja Luka',
        website: 'https://mtel.ba',
        description: 'Telecommunications',
        rating_avg: 4.0,
        reviews_count: 156,
        created_at: '2024-01-15T10:00:00Z',
        updated_at: '2024-01-15T10:00:00Z'
      }
    ];

    // Wire up the mock data to component state (same as live data would be)
    setCompanies(mockCompaniesData);
    setFilteredCompanies(mockCompaniesData);
  };

  const parseUserIntent = (input: string): SearchFilters & { companyName?: string } => {
    const lowerInput = input.toLowerCase();

    const intent: SearchFilters & { companyName?: string } = {};

    for (const city of CITIES) {
      if (lowerInput.includes(city)) {
        intent.city = city;
        break;
      }
    }

    for (const sector of SECTORS) {
      if (lowerInput.includes(sector)) {
        intent.sector = sector;
        break;
      }
    }

    const ratingMatch = lowerInput.match(/(\d+\.?\d*)\s*\+?\s*stars?/);
    if (ratingMatch) {
      intent.minRating = parseFloat(ratingMatch[1]);
    } else if (lowerInput.includes('4+') || lowerInput.includes('4 +')) {
      intent.minRating = 4.0;
    }

    if (lowerInput.includes('how is') || lowerInput.includes('about') || lowerInput.includes('tell me')) {
      const possibleName = companies.find(c =>
        lowerInput.includes(c.name.toLowerCase())
      );
      if (possibleName) {
        intent.companyName = possibleName.name;
      }
    }

    return intent;
  };

  const filterCompanies = (filters: SearchFilters & { companyName?: string }) => {
    let filtered = [...companies];

    if (filters.companyName) {
      const company = filtered.find(c => c.name === filters.companyName);
      return company ? [company] : [];
    }

    if (filters.city) {
      filtered = filtered.filter(c => c.city.toLowerCase() === filters.city);
    }

    if (filters.sector) {
      filtered = filtered.filter(c => c.sector.toLowerCase() === filters.sector);
    }

    if (filters.minRating) {
      filtered = filtered.filter(c => c.rating_avg >= filters.minRating!);
    }

    return filtered.sort((a, b) => b.rating_avg - a.rating_avg);
  };

  const generateTitle = (filters: SearchFilters) => {
    const parts: string[] = [];

    if (filters.sector) {
      parts.push(filters.sector.toUpperCase());
    }

    parts.push('Companies');

    if (filters.city) {
      parts.push(`in ${filters.city.charAt(0).toUpperCase() + filters.city.slice(1)}`);
    }

    if (filters.minRating) {
      parts.push(`(${filters.minRating}+ stars)`);
    }

    return parts.join(' ');
  };

  const generateResponse = (filters: SearchFilters & { companyName?: string }, results: Company[]) => {
    if (filters.companyName && results.length === 1) {
      const company = results[0];
      return `${company.name} is a ${company.sector} company based in ${company.city}. ${company.description} They have an average rating of ${company.rating_avg.toFixed(1)} stars from ${company.reviews_count} reviews.`;
    }

    if (results.length === 0) {
      return 'No companies found matching your criteria. Try: "companies in Sarajevo" or "IT companies" or "4+ stars retail"';
    }

    const parts: string[] = ['Found'];
    parts.push(results.length.toString());

    if (filters.sector) {
      parts.push(filters.sector.toUpperCase());
    }

    parts.push(results.length === 1 ? 'company' : 'companies');

    if (filters.city) {
      parts.push(`in ${filters.city.charAt(0).toUpperCase() + filters.city.slice(1)}`);
    }

    if (filters.minRating) {
      parts.push(`with ${filters.minRating}+ star ratings`);
    }

    return parts.join(' ') + '. Check the results below!';
  };

  const handleSendMessage = async (userInput: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: userInput,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const intent = parseUserIntent(userInput);
      const results = filterCompanies(intent);

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateResponse(intent, results),
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setFilteredCompanies(results);

      if (results.length > 0) {
        setListTitle(generateTitle(intent));
      }
    } catch (error) {
      console.error('Error processing message:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, there was an error processing your request. Please try again.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Building2 size={48} className="text-blue-600" />
            <h1 className="text-5xl font-bold text-gray-900">Bosnia Companies</h1>
          </div>
          <p className="text-xl text-gray-600">Discover the best companies in Bosnia and Herzegovina</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <CompanyList companies={filteredCompanies} title={listTitle} />
          </div>
          <div>
            <ChatBox
              messages={messages}
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
