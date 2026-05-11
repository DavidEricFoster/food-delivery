import React from 'react';
import styled from 'styled-components';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

const Wrapper = styled.div`
    min-height: 100vh;
    display: flex;
    flex-direction: column;
`;

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <Wrapper>
            <Navbar />
            <main style={{ flex: 1 }}>{children}</main>
            <Footer />
        </Wrapper>
    );
};
