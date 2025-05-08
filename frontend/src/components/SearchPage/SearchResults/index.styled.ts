import styled from 'styled-components';

export const ResultsContainer = styled.div`
  position: absolute;
  width: calc(800px + 2rem);
  max-height: 400px;
  overflow-y: auto;
  border: 1px solid #ddd;
  background: white;
  z-index: 1000;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const ResultItem = styled.div`
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f5f5f5;
  }

  &:last-child {
    border-bottom: none;
  }
`;

export const ResultImage = styled.img`
  width: 40px;
  height: 40px;
  margin-right: 1rem;
  object-fit: cover;
  border-radius: 2px;
`;

export const ResultInfo = styled.div`
  flex: 1;
`;

export const ResultTitle = styled.div`
  font-weight: bold;
  margin-bottom: 0.25rem;
`;

export const ResultMeta = styled.div`
  font-size: 0.75rem;
  color: #666;
`;