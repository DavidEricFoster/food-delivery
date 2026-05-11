import { apiClient } from './apiClient';

export type CuisineType =
    | 'italian'
    | 'french'
    | 'chinese'
    | 'japanese'
    | 'indian'
    | 'mexican'
    | 'greek';

export interface Coordinates {
    lat: string;
    lng: string;
}

export interface RestaurantFilters {
    page?: number;
    limit?: number;
    title?: string;
    cuisine?: string;
    owner_uuid?: string;
}

export interface Restaurant {
    uuid: string;
    title: string;
    description: string;
    cuisine: CuisineType;
    location?: Coordinates;
    owner_uuid?: string;
    owner_id?: string;
    coordinates?: Coordinates;
}
export interface CreateRestaurant {
    title: string;
    description: Restaurant['description'];
    cuisine: Restaurant['cuisine'];
    location?: Restaurant['location'];
    owner_uuid?: Restaurant['owner_uuid'];
    owner_id?: Restaurant['owner_id'];
    coordinates?: Restaurant['coordinates'];
}
function normalizeRestaurant(raw: Restaurant): Restaurant {
    return {
        uuid: raw.uuid,
        title: raw.title,
        description: raw.description,
        cuisine: raw.cuisine,
        owner_id: raw.owner_id ?? raw.owner_uuid ?? '',
        location: raw.location ?? raw.coordinates ?? { lat: '0', lng: '0' },
    };
}

export async function createRestaurant(data: {
    title: string;
    description: string;
    cuisine: Restaurant['cuisine'];
    coordinates?: Coordinates | null;
}): Promise<CreateRestaurant> {
    const { coordinates, ...payload } = data;
    const response = await apiClient.post<CreateRestaurant>('/restaurants', data.coordinates
        ? {
            ...payload,
            coordinates: data.coordinates ?? null,
        }
        : {...payload });
    return response.data;
}

export async function updateRestaurant({ uuid, payload }: { uuid:string, payload: any }): Promise<Restaurant> {
    const response = await apiClient.patch<Restaurant>(`/restaurants/${uuid}`, payload);
    return normalizeRestaurant(response.data);
}

export async function fetchRestaurants(filters: RestaurantFilters = {}): Promise<Restaurant[]> {
    const response = await apiClient.get<Restaurant[]>('/restaurants', {
        params: filters,
    });
    return response.data.map(normalizeRestaurant);
}

export async function fetchRestaurant(uuid: string): Promise<Restaurant> {
    const response = await apiClient.get<Restaurant>(`/restaurants/${uuid}`);
    return normalizeRestaurant(response.data);
}
