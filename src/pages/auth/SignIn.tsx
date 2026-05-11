import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuthActions, useAuthError } from '../../store/authStore';
import styled from 'styled-components';
import { Card, Container, Title, Alert, Input, FieldGroup, FieldLabel, PrimaryButton } from '../../components/basic';
import { spacing } from '../../styles/spacing';

const AuthWrap = styled.div`
    max-width: 480px;
    margin: 0 auto;
    padding-top: 64px;
`;

const FullWidthButton = styled(PrimaryButton)`
    width: 100%;
    margin-top: ${spacing.m};
    margin-bottom: ${spacing.s};
`;

const CenteredLink = styled.div`
    text-align: center;
    margin-top: ${spacing.s};
`;

export default function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { login } = useAuthActions();
    useAuthError(); // consumed at store level; local error state used for display
    const navigate = useNavigate();
    const location = useLocation();

    // Redirect after login
    const from = location.state?.from?.pathname || '/';

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            await login(email, password);
            navigate(from, { replace: true });
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthWrap>
            <Card>
                <Container>
                    <Title>Sign In</Title>

                    {error && <Alert type="error">{error}</Alert>}

                    <form onSubmit={handleSubmit}>
                        <FieldGroup>
                            <FieldLabel htmlFor="email">Email</FieldLabel>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                autoComplete="email"
                                autoFocus
                            />
                        </FieldGroup>
                        <FieldGroup>
                            <FieldLabel htmlFor="password">Password</FieldLabel>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                autoComplete="current-password"
                            />
                        </FieldGroup>
                        <FullWidthButton type="submit" disabled={isLoading}>
                            {isLoading ? 'Signing In...' : 'Sign In'}
                        </FullWidthButton>
                    </form>

                    <CenteredLink>
                        <Link to="/signup">Don't have an account? Sign Up</Link>
                    </CenteredLink>
                </Container>
            </Card>
        </AuthWrap>
    );
}