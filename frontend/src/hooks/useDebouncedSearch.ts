import { useState, useEffect } from 'react';
import { searchFragrances } from '../services/fragrance.service';
import { Fragrance } from '../types';

export const useDebouncedSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Fragrance[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);



  useEffect(() => {
    const handler = setTimeout(async () => {
      if (query.trim().length < 2) {
        setResults([]);
        return;
      }
      
      console.log(query);

      setIsLoading(true);
      setError(null);
      
      try {
        const data = await searchFragrances(query);
        setResults(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Search failed');
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 1000); 

    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  return {
    query,
    setQuery,
    results,
    isLoading,
    error
  };
};