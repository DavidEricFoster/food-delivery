import { useRestaurants } from '../hooks/useRestaurants';
import {
    Spinner, LoadingContainer, LoadingStack, PageContainer,
    Card, Title, Subtitle, Alert, Link, Column
} from '../components/basic';

export const Restaurants: React.FC = () => {
    const {
        data: restaurants,
        isPending,
        isError,
        error,
    } = useRestaurants({ page: 0, limit: 20 });

    if (isPending) {
        return (
            <LoadingContainer>
                <LoadingStack>
                    <Spinner />
                </LoadingStack>
            </LoadingContainer>
        );
    }

    if (isError) {
        return (
            <PageContainer>
                <Alert type="error">
                    {(error as Error)?.message || 'Failed to load restaurants'}
                </Alert>
            </PageContainer>
        );
    }

    return (
        <PageContainer>
            {!restaurants?.length ? (
                <p>No restaurants found.</p>
            ) : (
                <Column>
                    {restaurants.map(({ uuid, title, cuisine, description }) => (
                        <Card key={uuid}>
                            <Link to={`/menu/${uuid}`}>
                                <Title>{title}</Title>
                                <Subtitle>
                                    {cuisine}
                                </Subtitle>
                                <p>{description}</p>
                            </Link>
                        </Card>
                    ))}
                </Column>
            )}
        </PageContainer>
    );
};