import { Fragrance } from '../../../types';
import * as S from './index.styled';

interface SearchResultsProps {
  results: Fragrance[];
  onSelect: (fragrance: Fragrance) => void;
  selectedId: string | null;
  loadingId: string | null;
  errorId: string | null;
}

export const SearchResults = ({ results, onSelect, selectedId, loadingId, errorId }: SearchResultsProps) => {
  
    if (results.length === 0) return null;


    return (
        <S.ResultsContainer>
          {results.map((result) => {
            const isLoading = loadingId === result.id;
            const isError = errorId === result.id;
            const isSelected = selectedId === result.id;
    
            return (
              <S.ResultItem 
                key={result.id} 
                onClick={() => onSelect(result)}
                data-loading={isLoading}
                data-error={isError}
                data-selected={isSelected}
              >
                <S.ResultImage src={result.image} alt={result.title} />
                <S.ResultInfo>
                  <S.ResultTitle>{result.title}</S.ResultTitle>
                  <S.ResultMeta>
                    {result.brand} • {result.year || 'N/A'} • {result.gender || 'N/A'}
                    {isLoading && <span> (Loading...)</span>}
                    {isError && <span> (Failed - click to retry)</span>}
                  </S.ResultMeta>
                </S.ResultInfo>
              </S.ResultItem>
            );
          })}
        </S.ResultsContainer>
      );
};