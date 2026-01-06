import { api } from './api';
import type { User } from '../types/authTypes';

export interface UsersResponse {
    data: User[];
    total: number;
    page: number;
    limit: number;
}

export const getUsers = async (page = 1, limit = 10, search = ''): Promise<UsersResponse> => {
    const response = await api.get(`/auth?page=${page}&limit=${limit}&search=${search}`);
    // Assuming backend will be updated to return this structure. 
    // If backend returns just the array in 'data', we might need to adjust.
    // However, I planned to update the backend to return paginated data.
    return response.data; // response.data should contain { data: User[], total, page, limit }
};

export const validateUser = async (id: string): Promise<User> => {
    const response = await api.patch(`/auth/${id}`, { statut: 'ACTIF' });
    return response.data;
};

export const rejectUser = async (id: string): Promise<User> => {
    const response = await api.patch(`/auth/${id}`, { statut: 'REJETER' });
    return response.data;
};

export const deleteUser = async (id: string): Promise<void> => {
    await api.delete(`/auth/${id}`);
};

export const updateUser = async (id: string, data: Partial<User>): Promise<User> => {
    const response = await api.patch(`/auth/${id}`, data);
    return response.data;
};
