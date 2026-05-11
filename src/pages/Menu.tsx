import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../services/queryKeys';
import { fetchMeals } from '../services/meals';
import { useCartActions } from '../store/cartStore';
import { FormFeedback } from '../components/basic';
import { spacing } from '../styles/spacing';
import {
    Container,
    Card,
    Title,
    Subtitle,
    OutlinedButton
} from '../components/basic';

export const Menu: React.FC = () => {
    const [addedItems, setAddedItems] = useState<string[]>([]); // Track added items for feedback
    const { rid = '' } = useParams();
    const { data: menuItems } = useQuery({
        queryKey: [queryKeys.restaurantMeals(rid)], 
        queryFn: () => fetchMeals({
            restaurant_Uuid: rid,
        })
    });

    const { addItem } = useCartActions();
    const handleAddItem = (uuid: string) => {
        addItem(uuid, rid);
        setAddedItems([...addedItems, uuid]);
    };
    const handleClearSuccess = (uuid: string) => {
        setAddedItems(prev => prev.filter(id => id !== uuid))
    };

    return (
        <div>
            <Container>
                {addedItems.map((uuid, i) => {
                    const { title } = menuItems?.find(item => item.uuid === uuid) || { title: 'Item' };
                    return (
                        <div key={`${uuid}-${i}`} style={{ marginBottom: `${spacing.m}` }}>
                            <FormFeedback
                                successMessage={`${title} added to cart!`}
                                onClearSuccess={() => handleClearSuccess(uuid)}
                            />
                        </div>
                    );
                })}
                {menuItems?.map(({ uuid, title, price, description }) => (
                    <Card key={uuid}>
                        <Title>{title}</Title>
                        <Subtitle>
                            {description} - ${(price/100).toFixed(2)}
                        </Subtitle>
                        {/* This button needs to add to the cart (not the backend) */}
                        <OutlinedButton onClick={() => handleAddItem(uuid)}>Add to Order</OutlinedButton>
                    </Card>
                ))}
        </Container>
        </div>
    );
};
