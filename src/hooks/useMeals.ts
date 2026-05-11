import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../services/queryKeys';
import { fetchMeals, type MealFilters } from '../services/meals';

export function useMeals(restaurantUuid: string, filters?: Omit<MealFilters, 'restaurant_Uuid'>) {
    return useQuery({
        queryKey: queryKeys.restaurantMeals(restaurantUuid, filters),
        queryFn: () => fetchMeals({ ...filters, restaurant_Uuid: restaurantUuid }),
        staleTime: 30_000,
    });
}


