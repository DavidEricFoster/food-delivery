import styled from 'styled-components';
import { colors } from '../../styles/palette';

import { spacing } from '../../styles/spacing';

export const Subtitle = styled.p`
  color: ${colors.textMuted};
  font-size: 0.875rem;
  text-transform: capitalize;
  margin: 0 0 ${spacing.s} 0;
`;
