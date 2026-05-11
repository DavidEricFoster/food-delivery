import styled from 'styled-components';
import { colors } from '../../styles/palette';
import { spacing } from '../../styles/spacing';

export const Input = styled.input`
  width: 100%;
  padding: ${spacing.s} 12px;
  font-size: 1rem;
  border: 1px solid ${colors.borderDefault};
  border-radius: 4px;
  outline: none;
  box-sizing: border-box;

  &:focus {
    border-color: ${colors.primary};
    box-shadow: 0 0 0 1px ${colors.primary};
  }

  &::placeholder {
    color: ${colors.textDisabled};
  }
`;

export const InputRow = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid ${colors.borderDefault};
  border-radius: 4px;

  &:focus-within {
    border-color: ${colors.primary};
    box-shadow: 0 0 0 1px ${colors.primary};
  }

  ${Input} {
    border: none;
    box-shadow: none;

    &:focus {
      border: none;
      box-shadow: none;
    }
  }
`;
