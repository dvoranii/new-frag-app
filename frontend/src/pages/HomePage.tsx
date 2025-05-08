import { useState } from 'react';
import { SearchPage } from '../components/SearchPage';
import { Fragrance } from '../types';
import { selectFragrance } from '../services/fragrance.service';
import { useDebouncedSearch } from '../hooks/useDebouncedSearch';

export const HomePage = () => {
  const { query, setQuery, results, isLoading, error } = useDebouncedSearch();
  const [selectedFragrance, setSelectedFragrance] = useState<Fragrance | null>(null);

  const handleSelect = async (fragrance: Fragrance) => {
    try {
      const { url } = await selectFragrance(fragrance.id);
      setSelectedFragrance({
        ...fragrance,
        url
      });
    } catch (err) {
      console.error('Selection error:', err);
    }
  };

  return (
    <SearchPage
      onSearch={setQuery}
      onSelect={handleSelect}
      results={results}
      isLoading={isLoading}
      error={error}
      selectedFragrance={selectedFragrance}
    />
  );
};