import styled from 'styled-components';
import { colors } from '../../styles/palette';
import { spacing } from '../../styles/spacing';

export const NativeSelect = styled.select`
  width: 100%;
  padding: ${spacing.s} 12px;
  font-size: 1rem;
  border: 1px solid ${colors.borderDefault};
  border-radius: 4px;
  outline: none;
  background-color: ${colors.white};
  cursor: pointer;

  &:focus {
    border-color: ${colors.primary};
    box-shadow: 0 0 0 1px ${colors.primary};
  }
`;
