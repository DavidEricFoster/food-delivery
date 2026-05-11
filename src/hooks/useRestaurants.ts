import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../services/queryKeys';
import { fetchRestaurants } from '../services/restaurants';
import type { RestaurantFilters } from '../services/restaurants';

export function useRestaurants(filters: RestaurantFilters = {}) {
    return useQuery({
        queryKey: queryKeys.restaurants(filters),
        queryFn: () => fetchRestaurants(filters),
        staleTime: 30_000,
    });
}