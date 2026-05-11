import styled from 'styled-components';
import { useAuthUser, useAuthActions } from '../store/authStore';
import { Link } from 'react-router-dom';
import { OwnerDashboard } from '../components/dashboard/OwnerDashboard';
import {
    PageContainer, Card, Container,
    Title, Row, PrimaryButton, OutlinedButton,
} from '../components/basic';
import { spacing } from '../styles/spacing';

const CardSection = styled(Card)`
    margin-bottom: ${spacing.m};
`;

export default function Dashboard() {
    const user = useAuthUser();
    let name = user?.email.split('@')[0] || 'User';
    name = name.charAt(0).toUpperCase() + name.toLowerCase().slice(1);
    const { logout } = useAuthActions();
    return (
        <PageContainer>
            <h2>Dashboard</h2>
            <CardSection>
                <Container>
                    <Title>Welcome, {name}!</Title>
                    <p><strong>Email:</strong> {user?.email}</p>
                    <p><strong>Role:</strong> {user?.role}</p>
                    <p>
                        <strong>Account Created:</strong>{' '}
                        {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                    </p>
                </Container>
            </CardSection>

            {user?.role === 'customer' && (
                <CardSection>
                    <Container>
                        <Title>Customer Features</Title>
                        <p>Browse restaurants, order meals, view order history</p>
                    </Container>
                </CardSection>
            )}

            {user?.role === 'owner' && (
                <OwnerDashboard />
            )}

            {user?.role === 'admin' && (
                <CardSection>
                    <Container>
                        <Title>Admin Features</Title>
                        <p>Under construction...</p>
                    </Container>
                </CardSection>
            )}

            <Row>
                <OutlinedButton as={Link} to="/">
                    Back to Home
                </OutlinedButton>
                <PrimaryButton as={Link} onClick={logout}>
                    Logout
                </PrimaryButton>
            </Row>
        </PageContainer>
    );
}
