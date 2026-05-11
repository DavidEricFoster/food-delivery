import React from 'react';
import styled from 'styled-components';
import { alertPalette } from '../../styles/palette';
import { spacing } from '../../styles/spacing';
import type { AlertType } from '../../styles/palette';

const AlertBox = styled.div<{ $type: AlertType }>`
  background-color: ${({ $type }) => alertPalette[$type].bg};
  border: 1px solid ${({ $type }) => alertPalette[$type].border};
  border-radius: 4px;
  padding: 12px ${spacing.m};
  color: ${({ $type }) => alertPalette[$type].color};
  margin-top: ${spacing.m};
  font-size: 0.875rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: inherit;
  font-size: 1rem;
  line-height: 1;
  padding: 0 0 0 ${spacing.s};
`;

interface AlertProps {
    type: AlertType;
    children: React.ReactNode;
    onClose?: () => void;
}

export const Alert: React.FC<AlertProps> = ({ type, children, onClose }) => (
    <AlertBox $type={type}>
        <span>{children}</span>
        {onClose && <CloseButton onClick={onClose} aria-label="close">✕</CloseButton>}
    </AlertBox>
);
