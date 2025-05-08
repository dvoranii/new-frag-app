import { useState } from "react";
import {SearchBar} from "./SearchBar/index";
import {SearchResults} from "./SearchResults/index";
import { Fragrance } from "../../types";
import * as S from "./index.styled";

interface SearchPageProps {
    onSearch: (query: string) => void | Promise<void>;
    onSelect: (fragrance: Fragrance) => Promise<void>;
    results: Fragrance[];
    isLoading: boolean;
    error: string | null;
    selectedFragrance: Fragrance | null;
    loadingId: string | null;
    errorId: string | null;
}

export const SearchPage = ({
    onSearch,
    onSelect,
    results,
    isLoading,
    error,
    selectedFragrance,
    loadingId,
    errorId
}: SearchPageProps) => {
    const [query, setQuery] = useState("");


    const handleSearch = (searchQuery: string) => {
        setQuery(searchQuery);
        onSearch(searchQuery);
    };

      return (
        <S.Container>
          <S.Title>Fragrantica Search</S.Title>
          <SearchBar
            value={query}
            onChange={handleSearch}
            isLoading={isLoading}
          />
          <SearchResults 
            results={results}
            onSelect={onSelect}
            selectedId={selectedFragrance?.id || null}
            loadingId={loadingId}
            errorId={errorId}
          />
          {error && <S.ErrorMessage>{error}</S.ErrorMessage>}
          {selectedFragrance && (
            <S.SelectedFragrance>
              <p>Selected fragrance: <strong>{selectedFragrance.title}</strong></p>
              <p>
                <a href={selectedFragrance.url} target="_blank" rel="noopener noreferrer">
                  View on Fragrantica
                </a>
              </p>
            </S.SelectedFragrance>
          )}
        </S.Container>
      );
}