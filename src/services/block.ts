import { apiClient } from './apiClient';

export async function blockUser(userUuid: string): Promise<any> {
    const response = await apiClient.post(`/block/${userUuid}`);
    return response.data;
};
