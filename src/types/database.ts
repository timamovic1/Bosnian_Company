export interface Company {
  id: string;
  name: string;
  sector: string;
  city: string;
  website: string | null;
  description: string | null;
  rating_avg: number;
  reviews_count: number;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface SearchFilters {
  city?: string;
  sector?: string;
  minRating?: number;
  searchText?: string;
}
