// Authentication-related TypeScript interfaces and types

export const UserRole = {
    ADMIN: 'ADMIN',
    CLIENT: 'CLIENT',
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];

export interface User {
    idUtilisateur: string;
    pseudo: string;
    email: string;
    role: UserRole;
    avatar?: string;
    statut?: 'ATTENTE' | 'ACTIF' | 'REJETER';
    dateCreation?: string;
    dateModification?: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials {
    pseudo: string;
    email: string;
    password: string;
    confirmPassword: string;
    avatar?: File | null;
}

export interface AuthResponse {
    access_token: string;
    refresh_token?: string;
    user: User;
}

export interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (credentials: LoginCredentials) => Promise<void>;
    register: (credentials: RegisterCredentials) => Promise<void>;
    logout: () => void;
    refreshUser: () => Promise<void>;
    updateProfile: (data: UpdateProfileData, avatarFile?: File) => Promise<void>;
}

export interface UpdateProfileData extends Partial<User> {
    motDePasse?: string;
}

export interface TokenStorage {
    accessToken: string;
    refreshToken?: string;
}
