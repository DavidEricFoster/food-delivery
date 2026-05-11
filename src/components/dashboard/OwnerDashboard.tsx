import { useState } from 'react';
import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useRestaurants } from '../../hooks/useRestaurants';
import { useEditingIds } from '../../hooks/useEditingIds';
import { capitalize } from '../../utils/capitalize';
import { RestaurantForm } from './owner/RestaurantForm';
import { Alert, Card, Container, OutlinedButton, Row, Spinner, Subtitle } from '../basic';
import { colors } from '../../styles/palette';
import { spacing } from '../../styles/spacing';

const RestaurantList = styled.ul`
    list-style: none;
    margin: 0;
    padding: 0;
`;

const RestaurantItem = styled.li<{ $even: boolean }>`
    display: flex;
    align-items: center;
    padding: ${spacing.xs} ${spacing.m};
    background-color: ${({ $even }) => $even ? 'rgba(0, 0, 0, 0.04)' : 'transparent'};
    gap: ${spacing.s};
`;

const Divider = styled.hr`
    margin: ${spacing.m} 0;
    border: none;
    border-top: 1px solid ${colors.borderLight};
`;

const SpinnerWrap = styled.div`
    padding: ${spacing.xs} 0;
`;

export const OwnerDashboard: React.FC = () => {
    const { data: restaurants, isPending, isError } = useRestaurants();
    const [isAddingRestaurant, setIsAddingRestaurant] = useState(false);
    const editing = useEditingIds();

    return (
        <Card style={{ marginTop: spacing.m }}>
            <Container>
                <Subtitle>Your restaurants</Subtitle>

                {isPending && (
                    <SpinnerWrap>
                        <Spinner style={{ width: 24, height: 24, borderWidth: 3 }} />
                    </SpinnerWrap>
                )}

                {isError && (
                    <Alert type="error">Failed to load your restaurants.</Alert>
                )}

                {!isPending && !isError && (
                    restaurants?.length ? (
                        <RestaurantList>
                            {restaurants.map((r, i) => (
                                <RestaurantItem key={r.uuid} $even={i % 2 === 1}>
                                    {editing.has(r.uuid) ? (
                                        <RestaurantForm
                                            restaurantId={r.uuid}
                                            setEditingRestaurantIds={() => editing.remove(r.uuid)}
                                            setIsAddingRestaurant={setIsAddingRestaurant}
                                        />
                                    ) : (
                                        <Row style={{ width: '100%' }}>
                                            <div style={{ flex: 3 }}>
                                                <h3>{r.title}</h3>
                                                <p>{capitalize(r.cuisine)}</p>
                                            </div>
                                            <Row  style={{ flex: 2 }}>
                                                <OutlinedButton as={Link} onClick={() => editing.add(r.uuid)}>
                                                    Edit Restaurant
                                                </OutlinedButton>
                                                <OutlinedButton as={Link} to={`/owner/menu/${r.uuid}`}>
                                                    Edit Menu
                                                </OutlinedButton>
                                            </Row>
                                        </Row>
                                    )}
                                </RestaurantItem>
                            ))}
                        </RestaurantList>
                    ) : (
                        <p>You have no restaurants yet.</p>
                    )
                )}

                <Divider />

                {isAddingRestaurant && <RestaurantForm setIsAddingRestaurant={setIsAddingRestaurant} />}
                {!isAddingRestaurant && (
                    <OutlinedButton onClick={() => setIsAddingRestaurant((prev) => !prev)}>
                        Add New Restaurant
                    </OutlinedButton>
                )}
            </Container>
        </Card>
    );
};
