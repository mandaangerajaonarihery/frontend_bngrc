import axios from 'axios';
import type { Rubrique, TypeRubrique, Fichier } from '../types';
import { getAccessToken, refreshToken, clearTokens } from './authService';

const API_URL = import.meta.env.VITE_API_URL;

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Intercepteur de REQUÊTE : Ajoute le token JWT
api.interceptors.request.use(
    (config) => {
        const token = getAccessToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Intercepteur de RÉPONSE : Gère le rafraîchissement du token (401)
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const newToken = await refreshToken();
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                clearTokens();
                if (!window.location.pathname.includes('/login')) {
                    window.location.href = '/login';
                }
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

/**
 * SERVICES : RUBRIQUES
 */
export const getRubriques = async (): Promise<Rubrique[]> => {
    const response = await api.get('/rubriques?limit=100');
    return response.data.data;
};

export const getRubriqueById = async (id: string): Promise<Rubrique> => {
    const response = await api.get(`/rubriques/${id}`);
    return response.data.rubrique;
};

export const getRubriqueWithDetails = async (id: string): Promise<Rubrique> => {
    const rubrique = await getRubriqueById(id);
    const types = await getTypeRubriques(rubrique.idRubrique);

    const typesWithFiles = await Promise.all(types.map(async (type) => {
        const fichiers = await getFichiers(type.idTypeRubrique);
        return { ...type, fichiers };
    }));

    return { ...rubrique, typeRubriques: typesWithFiles };
};

export const createRubrique = async (data: Omit<Rubrique, 'idRubrique' | 'typeRubriques'>): Promise<Rubrique> => {
    const response = await api.post('/rubriques', data);
    return response.data.rubrique;
};

export const updateRubrique = async (id: string, data: Partial<Rubrique>): Promise<Rubrique> => {
    const response = await api.patch(`/rubriques/${id}`, data);
    return response.data.rubrique;
};

export const deleteRubrique = async (id: string): Promise<void> => {
    await api.delete(`/rubriques/${id}`);
};

/**
 * SERVICES : TYPES DE RUBRIQUES
 */
export const getTypeRubriques = async (idRubrique: string): Promise<TypeRubrique[]> => {
    const response = await api.get(`/type-rubrique/${idRubrique}?limit=100`);
    return response.data.data;
};

export const createTypeRubrique = async (data: Record<string, unknown>): Promise<TypeRubrique> => {
    const response = await api.post('/type-rubrique', data);
    return response.data.typeRubrique;
};

export const updateTypeRubrique = async (id: string, data: Partial<TypeRubrique>): Promise<TypeRubrique> => {
    const response = await api.patch(`/type-rubrique/${id}`, data);
    return response.data.typeRubrique;
};

export const deleteTypeRubrique = async (id: string): Promise<void> => {
    await api.delete(`/type-rubrique/${id}`);
};

/**
 * SERVICES : FICHIERS
 */
export const getFichiers = async (idTypeRubrique: string): Promise<Fichier[]> => {
    const response = await api.get(`/fichier/${idTypeRubrique}`);
    return response.data;
};

export const uploadFichier = async (data: FormData): Promise<Fichier> => {
    const response = await api.post('/fichier', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};

export const deleteFichier = async (id: string): Promise<void> => {
    await api.delete(`/fichier/${id}`);
};

export const getFichierDetails = async (id: string): Promise<Fichier> => {
    const response = await api.get(`/fichier/${id}/visualiser`);
    return response.data;
};

// Utilisé pour les liens directs ou les iframes (Attention au 401 si non géré par le navigateur)
export const getDownloadUrl = (idFichier: string) => `${API_URL}/fichier/${idFichier}/telecharger`;

/**
 * 🚀 RÉCUPÉRATION DU CONTENU (BLOB)
 * Cette fonction est la plus sûre pour le téléchargement car elle utilise 
 * l'instance Axios configurée avec le token Authorization.
 */
export const getFileContent = async (idFichier: string): Promise<Blob> => {
    try {
        const response = await api.get(`/fichier/${idFichier}/telecharger`, {
            responseType: 'blob', // Important pour recevoir des données binaires
        });
        return response.data;
    } catch (error: any) {
        // Cas particulier : Si Axios reçoit un Blob alors que c'est une erreur 401 (JSON)
        if (error.response?.data instanceof Blob && error.response.data.type === 'application/json') {
            const text = await error.response.data.text();
            const errorData = JSON.parse(text);
            console.error("Erreur API cachée dans le Blob:", errorData);
            
            if (errorData.statusCode === 401) {
                clearTokens();
                window.location.href = '/login';
            }
        }
        throw error;
    }
};