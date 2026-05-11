import React from 'react';
import styled from 'styled-components';
import { colors } from '../../styles/palette';
import { spacing } from '../../styles/spacing';

const FooterBar = styled.footer`
    background-color: ${colors.secondaryDark};
    color: ${colors.white};
    text-align: center;
    padding: ${spacing.xs} ${spacing.m};
    font-size: 0.875rem;
    margin-top: ${spacing.m};
`;

export const Footer: React.FC = () => {
    return (
        <FooterBar>Toptal Food Delivery</FooterBar>
    );
};
