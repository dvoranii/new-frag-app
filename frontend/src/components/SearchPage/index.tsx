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
    loadingId: string | null;
    errorId: string | null;
}

export const SearchPage = ({
    onSearch,
    onSelect,
    results,
    isLoading,
    error,
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
            loadingId={loadingId}
            errorId={errorId}
          />
          {error && <S.ErrorMessage>{error}</S.ErrorMessage>}
        </S.Container>
      );
}