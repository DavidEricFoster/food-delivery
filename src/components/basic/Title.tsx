import styled from 'styled-components';
import { colors } from '../../styles/palette';
import { spacing } from '../../styles/spacing';

export const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0 0 ${spacing.xs} 0;
  color: ${colors.secondaryDark};
`;
