import { InputContainer, StyledInput, LoadingIndicator } from './index.styled';

interface SearchBarProps {
  value: string;
  onChange: (query: string) => void;
  isLoading: boolean;
}

export const SearchBar = ({ value, onChange, isLoading }: SearchBarProps) => {
  return (
    <InputContainer>
      <StyledInput
        type="text"
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        placeholder="Search for perfumes..."
      />
      {isLoading && <LoadingIndicator />}
    </InputContainer>
  );
};