import styled from 'styled-components';
import { colors } from '../../styles/palette';
import { spacing } from '../../styles/spacing';

export const PrimaryButton = styled.button`
  background-color: ${colors.primary};
  color: ${colors.white};
  border: none;
  border-radius: 4px;
  padding: ${spacing.s} 22px;
  font-size: 0.875rem;
  font-weight: 500;
  letter-spacing: 0.02857em;
  text-transform: uppercase;
  text-decoration: none;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover:not(:disabled) {
    background-color: ${colors.primaryDark};
  }

  &:disabled {
    background-color: ${colors.disabledBg};
    color: ${colors.disabledText};
    cursor: not-allowed;
  }
`;
