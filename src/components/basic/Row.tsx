import styled from 'styled-components';
import { spacing } from '../../styles/spacing';

export const Row = styled.div`
  display: flex;
  flex-direction: row;
  gap: ${spacing.m};
  align-items: flex-start;
  margin-bottom: ${spacing.m};
`;
