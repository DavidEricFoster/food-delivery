import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthActions, useAuthError } from '../../store/authStore';
import styled from 'styled-components';
import {
    Card, Container, Title, Alert, Input,
    FieldGroup, FieldLabel, NativeSelect, PrimaryButton,
} from '../../components/basic';
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

export default function SignUp() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState<'customer' | 'owner' | 'admin'>('customer');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { register } = useAuthActions();
    useAuthError(); // consumed at store level; local error state used for display
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            setIsLoading(false);
            return;
        }

        try {
            await register(email, password, role);
            navigate('/dashboard', { replace: true });
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
                    <Title>Sign Up</Title>

                    {error && <Alert type="error">{error}</Alert>}

                    <form onSubmit={handleSubmit}>
                        <FieldGroup>
                            <FieldLabel htmlFor="email">Email</FieldLabel>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
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
                                onChange={e => setPassword(e.target.value)}
                                required
                                autoComplete="new-password"
                            />
                        </FieldGroup>
                        <FieldGroup>
                            <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
                            <Input
                                id="confirm-password"
                                type="password"
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
                                required
                                autoComplete="new-password"
                            />
                        </FieldGroup>
                        <FieldGroup>
                            <FieldLabel htmlFor="role">Role</FieldLabel>
                            <NativeSelect
                                id="role"
                                value={role}
                                onChange={e => setRole(e.target.value as 'customer' | 'owner' | 'admin')}
                            >
                                <option value="customer">Customer</option>
                                <option value="owner">Restaurant Owner</option>
                            </NativeSelect>
                        </FieldGroup>
                        <FullWidthButton type="submit" disabled={isLoading}>
                            {isLoading ? 'Creating Account...' : 'Sign Up'}
                        </FullWidthButton>
                    </form>

                    <CenteredLink>
                        <Link to="/signin">Already have an account? Sign In</Link>
                    </CenteredLink>
                    <CenteredLink>
                        <Link to="/">Back to Home</Link>
                    </CenteredLink>
                </Container>
            </Card>
        </AuthWrap>
    );
}