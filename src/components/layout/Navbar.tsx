import React, { useState } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthActions, useAuthUser } from '../../store/authStore';
import logo from '../../assets/logo.png';
import { colors } from '../../styles/palette';
import { spacing } from '../../styles/spacing';

const MOBILE = '@media (max-width: 899px)';

const Bar = styled.nav`
    position: sticky;
    top: 0;
    z-index: 1100;
    background-color: ${colors.secondaryDark};
    color: ${colors.white};
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

const ToolbarInner = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
    display: flex;
    align-items: center;
    padding: ${spacing.xs} ${spacing.m};
    min-height: 56px;
    box-sizing: border-box;
`;

const BrandLink = styled(Link)`
    display: flex;
    align-items: center;
    gap: ${spacing.xs};
    text-decoration: none;
    color: inherit;
    font-weight: bold;
    font-size: 1.25rem;
    flex-shrink: 0;
`;

const LogoImg = styled.img`
    width: 32px;
    height: 32px;
    object-fit: contain;
`;

const Welcome = styled.div`
    flex: 1;
    text-align: center;
    font-size: 1rem;
    font-weight: 500;
`;

const DesktopNav = styled.div`
    display: flex;
    align-items: center;
    gap: ${spacing.xs};
    ${MOBILE} { display: none; }
`;

const NavLinkButton = styled(Link)`
    background: none;
    border: none;
    color: inherit;
    cursor: pointer;
    font-size: 0.8rem;
    font-weight: 700;
    padding: ${spacing.xs} ${spacing.s};
    border-radius: 4px;
    text-decoration: none;
    &:hover { background-color: rgba(255, 255, 255, 0.1); }
`;

const NavActionButton = styled.button`
    background: none;
    border: none;
    color: inherit;
    cursor: pointer;
    font-size: 0.8rem;
    font-weight: 700;
    padding: ${spacing.xs} ${spacing.s};
    border-radius: 4px;
    &:hover { background-color: rgba(255, 255, 255, 0.1); }
`;

const HamburgerButton = styled.button`
    display: none;
    background: none;
    border: none;
    color: inherit;
    cursor: pointer;
    padding: ${spacing.xs};
    border-radius: 4px;
    ${MOBILE} {
        display: flex;
        align-items: center;
        justify-content: center;
    }
`;

const Overlay = styled.div<{ $open: boolean }>`
    display: ${({ $open }) => ($open ? 'block' : 'none')};
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1200;
`;

const DrawerPanel = styled.div<{ $open: boolean }>`
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    width: 240px;
    background-color: ${colors.white};
    color: #000;
    z-index: 1201;
    transform: ${({ $open }) => ($open ? 'translateX(0)' : 'translateX(100%)')};
    transition: transform 0.2s ease;
    display: flex;
    flex-direction: column;
`;

const DrawerList = styled.ul`
    list-style: none;
    margin: 0;
    padding: ${spacing.s} 0;
`;

const DrawerNavLink = styled(Link)`
    display: block;
    padding: ${spacing.s} ${spacing.m};
    color: #000;
    text-decoration: none;
    &:hover { background-color: rgba(0, 0, 0, 0.05); }
`;

const DrawerActionButton = styled.button`
    display: block;
    width: 100%;
    padding: ${spacing.s} ${spacing.m};
    background: none;
    border: none;
    text-align: left;
    cursor: pointer;
    font-size: 1rem;
    color: #000;
    &:hover { background-color: rgba(0, 0, 0, 0.05); }
`;

const DrawerDivider = styled.hr`
    margin: 0;
    border: none;
    border-top: 1px solid ${colors.borderLight};
`;

export const Navbar: React.FC = () => {
    const { logout } = useAuthActions();
    const { email, role } = useAuthUser() || {};
    const isAuthenticated = !!email;
    const name = email ? email.split('@')[0] : 'User';
    const navigate = useNavigate();
    const [drawerOpen, setDrawerOpen] = useState(false);

    let navItems: { label: string; to: string }[] = [
        { label: 'Browse Restaurants', to: '/restaurants' },
    ];
    switch (role) {
        case 'customer':
            navItems = [
                { label: 'Browse Restaurants', to: '/' },
                { label: 'Cart', to: '/cart' },
                { label: 'Placed Orders', to: '/orders' },
            ];
            break;
        case 'owner':
            navItems = [
                { label: 'Dashboard', to: '/dashboard' },
                { label: 'Orders', to: '/restaurant-orders' },
            ];
            break;
        case 'admin':
            navItems = [
                { label: 'Admin Dashboard', to: '/admin' },
                { label: 'User Management', to: '/admin/users' },
                { label: 'Restaurant Management', to: '/admin/restaurants' },
            ];
            break;
    }

    const handleSignOut = () => {
        setDrawerOpen(false);
        logout();
        navigate('/signin');
    };

    return (
        <Bar>
            <ToolbarInner>
                {/* Brand */}
                <BrandLink to="/">
                    <LogoImg src={logo} alt="Logo" />
                    Food Delivery
                </BrandLink>

                {/* Centred welcome text */}
                <Welcome>Welcome, {name}!</Welcome>

                {/* Desktop nav */}
                <DesktopNav>
                    {navItems.map(({ label, to }) => (
                        <NavLinkButton key={to} to={to}>{label}</NavLinkButton>
                    ))}
                    {isAuthenticated ? (
                        <NavActionButton onClick={handleSignOut}>Sign Out</NavActionButton>
                    ) : (
                        <NavLinkButton to="/signin">Sign In</NavLinkButton>
                    )}
                </DesktopNav>

                {/* Mobile hamburger */}
                <HamburgerButton
                    aria-label="open navigation menu"
                    onClick={() => setDrawerOpen(true)}
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <rect y="4" width="24" height="2" />
                        <rect y="11" width="24" height="2" />
                        <rect y="18" width="24" height="2" />
                    </svg>
                </HamburgerButton>
            </ToolbarInner>

            {/* Drawer */}
            <Overlay $open={drawerOpen} onClick={() => setDrawerOpen(false)} />
            <DrawerPanel $open={drawerOpen}>
                <DrawerList>
                    {navItems.map(({ label, to }) => (
                        <li key={to}>
                            <DrawerNavLink to={to} onClick={() => setDrawerOpen(false)}>
                                {label}
                            </DrawerNavLink>
                        </li>
                    ))}
                </DrawerList>
                <DrawerDivider />
                <DrawerList>
                    <li>
                        {isAuthenticated ? (
                            <DrawerActionButton onClick={handleSignOut}>Sign Out</DrawerActionButton>
                        ) : (
                            <DrawerNavLink to="/signin" onClick={() => setDrawerOpen(false)}>Sign In</DrawerNavLink>
                        )}
                    </li>
                </DrawerList>
            </DrawerPanel>
        </Bar>
    );
};
