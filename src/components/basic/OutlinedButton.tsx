import styled from 'styled-components';
import { colors } from '../../styles/palette';
import { spacing } from '../../styles/spacing';

export const OutlinedButton = styled.button`
  background-color: transparent;
  color: ${colors.primary};
  border: 1px solid ${colors.secondaryDark};
  border-radius: 4px;
  padding: ${spacing.s} 22px;
  font-size: 0.875rem;
  font-weight: 500;
  letter-spacing: 0.02857em;
  text-decoration: none;
  text-transform: uppercase;
  cursor: pointer;
  transition: background-color 0.2s, border-color 0.2s;

  &:hover {
    color: ${colors.white};
  }

  &:hover:not(:disabled) {
    border-color: ${colors.white};
    background-color: ${colors.primary}};
  }

  &:disabled {
    color: ${colors.disabledText};
    border-color: ${colors.disabledBg};
    background-color: transparent;
    cursor: not-allowed;
  }
`;
