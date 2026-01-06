import React, { useState, useEffect, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import type { AuthContextType, User, LoginCredentials, RegisterCredentials } from '../types/authTypes';
import { UserRole } from '../types/authTypes';
import * as authService from '../services/authService';
import { AxiosError } from 'axios';
import { AuthContext } from './AuthContextDefinition';

// Provider props
interface AuthProviderProps {
    children: ReactNode;
}

/**
 * AuthProvider component that wraps the app and provides authentication state
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    // Check for existing token and fetch user on mount
    useEffect(() => {
        const initAuth = async () => {
            try {
                if (authService.isAuthenticated()) {
                    const currentUser = await authService.getCurrentUser();
                    setUser(currentUser);
                }
            } catch (error) {
                console.error('Failed to fetch user:', error);
                // Clear invalid tokens
                authService.clearTokens();
            } finally {
                setIsLoading(false);
            }
        };

        initAuth();
    }, []);

    /**
     * Login user with credentials
     */
    const login = async (credentials: LoginCredentials): Promise<void> => {
        try {
            const response = await authService.login(credentials);
            setUser(response.user);
            toast.success(`Bienvenue, ${response.user.pseudo}!`);
            console.log(response.user);

            // Redirect based on role
            if (response.user.role === UserRole.ADMIN) {
                console.log('Admin logged in', response.user);
                navigate('/admin');
            } else if (response.user.role === UserRole.CLIENT) {
                console.log('Client logged in', response.user);
                navigate('/');
            } else {
                // Fallback for unknown roles or future roles
                navigate('/');
            }
        } catch (error) {
            const err = error as AxiosError<{ message: string }>;
            const errorMessage = err.response?.data?.message || 'Échec de la connexion. Vérifiez vos identifiants.';
            toast.error(errorMessage);
            throw error;
        }
    };

    /**
     * Register new user
     */
    const register = async (credentials: RegisterCredentials): Promise<void> => {
        try {
            // Validate password confirmation
            if (credentials.password !== credentials.confirmPassword) {
                toast.error('Les mots de passe ne correspondent pas');
                throw new Error('Passwords do not match');
            }

            const response = await authService.register(credentials);
            setUser(response.user);
            toast.success(`Compte créé avec succès! Bienvenue, ${response.user.pseudo}!`);

            // Redirect to dashboard
            // Redirect based on role
            if (response.user.role === UserRole.ADMIN) {
                navigate('/admin');
            } else if (response.user.role === UserRole.CLIENT) {
                navigate('/');
            } else {
                navigate('/');
            }
        } catch (error) {
            const err = error as AxiosError<{ message: string }>;
            const errorMessage = err.response?.data?.message || 'Échec de l\'inscription. Veuillez réessayer.';
            toast.error(errorMessage);
            throw error;
        }
    };

    /**
     * Logout user
     */
    const logout = (): void => {
        authService.logout();
        setUser(null);
        toast.info('Déconnexion réussie');
        navigate('/login');
    };

    /**
     * Refresh user data from backend
     */
    const refreshUser = async (): Promise<void> => {
        try {
            const currentUser = await authService.getCurrentUser();
            setUser(currentUser);
        } catch (error) {
            console.error('Failed to refresh user:', error);
            // If refresh fails, logout user
            logout();
        }
    };

    /**
     * Update user profile
     */
    const updateProfile = async (data: Partial<User> & { motDePasse?: string }, avatarFile?: File): Promise<void> => {
        if (!user) return;
        try {
            const updatedUser = await authService.updateUser(user.idUtilisateur, data, avatarFile);
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
