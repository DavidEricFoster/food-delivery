import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRestaurants } from '../hooks/useRestaurants';
import { useMeals } from '../hooks/useMeals';
import { useEditingIds } from '../hooks/useEditingIds';
import { capitalize } from '../utils/capitalize';
import { MealForm } from '../components/dashboard/owner/MealForm';
import {
    Card, Column, Container,
    OutlinedButton, PageContainer,
    Subtitle, Title,
} from '../components/basic';

export const MenuEditor: React.FC = () => {
    const { data: restaurants, isPending, isError } = useRestaurants();
    const { rid = '' } = useParams();
    const { title, cuisine = '' } = restaurants?.find(r => rid && r.uuid === rid) || {};
    const { data: meals } = useMeals(rid);

    const [isAddingMeal, setIsAddingMeal] = useState(false);
    const editing = useEditingIds();

    const navigate = useNavigate();

    useEffect(() => {
        if (!isPending && !isError && !title) {
            navigate('/unauthorized', { replace: true });
        }
    }, [isPending, isError, title]);

    return (
        <PageContainer>
            <Title>{title}</Title>
            <Subtitle>{capitalize(cuisine)} cuisine</Subtitle>
            {meals?.length ? (
                <Column>
                    {meals.map((meal) => (
                        editing.has(meal.uuid) ? (
                            <MealForm
                                key={meal.uuid}
                                rid={rid!}
                                meal={meal}
                                onCancel={() => editing.remove(meal.uuid)}
                                onComplete={() => editing.remove(meal.uuid)}
                            />
                        ) : (
                            <Card key={meal.uuid}>
                                <Container>
                                    <Title>{meal.title} — ${(meal.price / 100).toFixed(2)}</Title>
                                    <Subtitle>{meal.section}</Subtitle>
                                    <p>{meal.description}</p>
                                    <OutlinedButton type="button" onClick={() => editing.add(meal.uuid)}>
                                        Edit Item
                                    </OutlinedButton>
                                </Container>
                            </Card>
                        )
                    ))}
                </Column>
            ) : (
                <p>No meals found for this restaurant.</p>
            )}
            {isAddingMeal && (
                <MealForm
                    rid={rid!}
                    onCancel={() => setIsAddingMeal(false)}
                    onComplete={() => setIsAddingMeal(false)}
                />
            )}
            {!isAddingMeal && (
                <OutlinedButton onClick={() => setIsAddingMeal(true)}>
                    Add Menu Item
                </OutlinedButton>
            )}
        </PageContainer>
    );
};
