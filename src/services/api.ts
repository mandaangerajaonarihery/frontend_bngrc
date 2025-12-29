import axios from 'axios';
import type { Rubrique, TypeRubrique, Fichier } from '../types';

const API_URL = 'http://localhost:3001/serviceterritoriale';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Rubriques
export const getRubriques = async (): Promise<Rubrique[]> => {
    const response = await api.get('/rubriques?limit=100');
    // User verified response structure: 
    // { message: "...", data: [...], meta: ... }
    return response.data.data;
};

export const getRubriqueById = async (id: string): Promise<Rubrique> => {
    const response = await api.get(`/rubriques/${id}`);
    return response.data.rubrique;
};

// Helper to get full details (Rubrique + Types + Fichiers)
export const getRubriqueWithDetails = async (id: string): Promise<Rubrique> => {
    const rubrique = await getRubriqueById(id);
    const types = await getTypeRubriques(rubrique.idRubrique);

    // Fetch files for each type
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

// Type Rubriques
export const getTypeRubriques = async (idRubrique: string): Promise<TypeRubrique[]> => {
    const response = await api.get(`/type-rubrique/${idRubrique}?limit=100`);
    return response.data.data;
};

export const createTypeRubrique = async (data: any): Promise<TypeRubrique> => {
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

// Fichiers
export const getFichiers = async (idTypeRubrique: string): Promise<Fichier[]> => {
    const response = await api.get(`/fichier/${idTypeRubrique}`);
    return response.data;
};

export const uploadFichier = async (data: FormData): Promise<Fichier> => {
    const response = await api.post('/fichier', data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
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

export const getDownloadUrl = (idFichier: string) => `${API_URL}/fichier/${idFichier}/telecharger`;

export const getFileContent = async (idFichier: string): Promise<Blob> => {
    const response = await api.get(`/fichier/${idFichier}/telecharger`, {
        responseType: 'blob',
    });
    return response.data;
};
