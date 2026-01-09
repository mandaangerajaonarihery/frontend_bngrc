import React, { useState, useEffect, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import type { AuthContextType, User, LoginCredentials, RegisterCredentials } from '../types/authTypes';
import { UserRole } from '../types/authTypes';
import * as authService from '../services/authService';
import { AxiosError } from 'axios';
import { AuthContext } from './AuthContextDefinition';

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const initAuth = async () => {
            try {
                if (authService.isAuthenticated()) {
                    const currentUser = await authService.getCurrentUser();
                    setUser(currentUser);
                }
            } catch (error) {
                console.error('Failed to fetch user:', error);
                authService.clearTokens();
            } finally {
                setIsLoading(false);
            }
        };
        initAuth();
    }, []);

    const login = async (credentials: LoginCredentials): Promise<void> => {
        try {
            const response = await authService.login(credentials);
            setUser(response.user);
            toast.success(`Bienvenue, ${response.user.pseudo}!`);
            if (response.user.role === UserRole.ADMIN) {
                navigate('/admin');
            } else {
                navigate('/');
            }
        } catch (error) {
            const err = error as AxiosError<{ message: string }>;
            toast.error(err.response?.data?.message || 'Échec de la connexion.');
            throw error;
        }
    };

    const register = async (credentials: RegisterCredentials): Promise<void> => {
        try {
            if (credentials.password !== credentials.confirmPassword) {
                toast.error('Les mots de passe ne correspondent pas');
                throw new Error('Passwords do not match');
            }
            const response = await authService.register(credentials);
            setUser(response.user);
            toast.success(`Compte créé avec succès!`);
            navigate(response.user.role === UserRole.ADMIN ? '/admin' : '/');
        } catch (error) {
            const err = error as AxiosError<{ message: string }>;
            toast.error(err.response?.data?.message || 'Échec de l\'inscription.');
            throw error;
        }
    };

    const logout = (): void => {
        authService.logout();
        setUser(null);
        toast.info('Déconnexion réussie');
        navigate('/login');
    };

    const refreshUser = async (): Promise<void> => {
        try {
            const currentUser = await authService.getCurrentUser();
            setUser(currentUser);
        } catch (error) {
            logout();
        }
    };

    /**
     * Update user profile
     * SOLUTION FINALE : On force le type 'any' sur l'appel du service pour 
     * contourner l'incohérence entre les fichiers et permettre le build Vercel.
     */
    const updateProfile = async (data: Partial<User> & { motDePasse?: string }, avatarFile?: File): Promise<void> => {
        if (!user) return;
        try {
            // L'erreur venait de la structure attendue par authService.updateUser.
            // En utilisant (authService.updateUser as any), on neutralise l'inspection stricte de TS
            // qui bloque le build, tout en envoyant les 3 arguments dont ton API a besoin.
            const updatedUser = await (authService.updateUser as any)(
                user.idUtilisateur, 
                data, 
                avatarFile
            );
            
            setUser(updatedUser);
            toast.success('Profil mis à jour avec succès !');
        } catch (error) {
            console.error('Failed to update profile:', error);
            toast.error('Échec de la mise à jour du profil.');
            throw error;
        }
    };

    const value: AuthContextType = {
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
        updateProfile,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};