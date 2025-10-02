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
