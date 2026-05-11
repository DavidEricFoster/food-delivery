import styled from 'styled-components';
import { colors } from '../../styles/palette';
import { spacing } from '../../styles/spacing';

export const Textarea = styled.textarea`
  width: 100%;
  padding: ${spacing.s} 12px;
  font-size: 1rem;
  font-family: inherit;
  border: 1px solid ${colors.borderDefault};
  border-radius: 4px;
  outline: none;
  box-sizing: border-box;
  resize: vertical;

  &:focus {
    border-color: ${colors.primary};
    box-shadow: 0 0 0 1px ${colors.primary};
  }

  &::placeholder {
    color: ${colors.textDisabled};
  }
`;
