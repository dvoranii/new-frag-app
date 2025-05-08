import { useState } from 'react';
import { SearchPage } from '../components/SearchPage';
import { Fragrance } from '../types';
import { selectFragrance } from '../services/fragrance.service';
import { useDebouncedSearch } from '../hooks/useDebouncedSearch';

export const HomePage = () => {
  const { query, setQuery, results, isLoading, error } = useDebouncedSearch();
//   const [selectedFragrance, setSelectedFragrance] = useState<Fragrance | null>(null);
  const [selectionState, setSelectionState] = useState<{
    loadingId: string | null;
    errorId: string | null;
  }>({
    loadingId: null,
    errorId: null
  })


const handleSelect = async (fragrance: Fragrance) => {
    setSelectionState({
        loadingId: fragrance.id,
        errorId: null
    });

    try {
        const response = await selectFragrance(fragrance);
        console.log("SFragrance URL:", response);

        setSelectionState(prev => ({
            ...prev,
            loadingId: null
        }));
    } catch (error) {
        console.error("Selection failed:", error);
        setSelectionState({
            loadingId: null,
            errorId: fragrance.id
        });
    }
};

  return (
    <SearchPage
      onSearch={setQuery}
      onSelect={handleSelect}
      results={results}
      isLoading={isLoading}
      error={error}
      loadingId={selectionState.loadingId}
      errorId={selectionState.errorId}
    />
  );
};