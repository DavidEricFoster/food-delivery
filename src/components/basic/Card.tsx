import styled from 'styled-components';
import { colors } from '../../styles/palette';
import { spacing } from '../../styles/spacing';

export const Card = styled.div`
  border: 1px solid ${colors.borderLight};
  border-radius: 4px;
  background-color: ${colors.white};
  box-shadow: 0 2px 1px -1px rgba(0, 0, 0, 0.2), 0 1px 1px 0 rgba(0, 0, 0, 0.14), 0 1px 3px 0 rgba(0, 0, 0, 0.12);
  margin-bottom: ${spacing.m};
  color: ${colors.secondaryDark};
  padding: ${spacing.m};
`;
