import { Fragrance } from '../../../types';
import { 
  ResultsContainer, 
  ResultItem, 
  ResultImage, 
  ResultInfo, 
  ResultTitle, 
  ResultMeta 
} from './index.styled';

interface SearchResultsProps {
  results: Fragrance[];
  onSelect: (fragrance: Fragrance) => void;
}

export const SearchResults = ({ results, onSelect }: SearchResultsProps) => {
  if (results.length === 0) return null;

  return (
    <ResultsContainer>
      {results.map((result) => (
        <ResultItem key={result.id} onClick={() => onSelect(result)}>
          <ResultImage src={result.image} alt={result.title} />
          <ResultInfo>
            <ResultTitle>{result.title}</ResultTitle>
            <ResultMeta>
              {result.brand} • {result.year || 'N/A'} • {result.gender || 'N/A'}
            </ResultMeta>
          </ResultInfo>
        </ResultItem>
      ))}
    </ResultsContainer>
  );
};