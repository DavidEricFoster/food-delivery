import styled, { keyframes } from 'styled-components';
import { colors } from '../../styles/palette';

export const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

export const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid ${colors.primary};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;
