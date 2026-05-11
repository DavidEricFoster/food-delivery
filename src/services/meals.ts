import { apiClient } from './apiClient';

export interface MealFilters {
    page?: number;
    limit?: number;
    restaurant_Uuid: string;
}
export async function fetchMeals(filters: MealFilters): Promise<Meal[]> {
    const { restaurant_Uuid, ...paginationParams } = filters;
    const response = await apiClient.get<Meal[]>(`/restaurants/${restaurant_Uuid}/meals`, {
        params: paginationParams,
    });

    return response.data;
}

export interface MealPayload {
    title: string;
    description: string;
    price: number;
    section: MealSection;
    restaurant_uuid: string;
}
export interface AddMealInput extends Omit<MealPayload, 'restaurant_uuid'> {
    restaurantUuid: string;
}
export async function addMeal(meal: AddMealInput): Promise<Meal> {
    const { restaurantUuid, ...payload } = meal;
    const response = await apiClient.post<Meal>(`/restaurants/${restaurantUuid}/meals`, {
        ...payload,
        restaurant_uuid: restaurantUuid,
    });

    return response.data;
}

export type MealSection = 'breakfast' | 'lunch' | 'dinner' | 'appetizers' | 'dessert';
export interface Meal {
    uuid: string;
    title: string;
    description: string;
    price: number;          // integer cents per API spec (minimum: 1)
    section: MealSection;
    restaurant_uuid?: string;
    created_at?: string;
}
export async function updateMeal(meal: Meal): Promise<Meal> {
    const { uuid, ...payload } = meal;
    const response = await apiClient.patch<Meal>(`/meals/${uuid}`, {
        ...payload,
    });

    return response.data;
}


