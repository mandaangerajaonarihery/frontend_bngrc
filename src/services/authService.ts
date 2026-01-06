import axios from 'axios';
import { api } from './api';
import type { LoginCredentials, RegisterCredentials, AuthResponse, User } from '../types/authTypes';

const AUTH_API_URL = 'http://localhost:3001/serviceterritoriale/auth';
const TOKEN_KEY = 'bngrc_access_token';
const REFRESH_TOKEN_KEY = 'bngrc_refresh_token';
const USER_ID_KEY = 'bngrc_user_id';

// Create a separate axios instance for auth to avoid circular dependencies
const authApi = axios.create({
    baseURL: AUTH_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add interceptors for debugging
authApi.interceptors.request.use(request => {
    console.log('Auth API Request:', request.method?.toUpperCase(), request.url);
    // Log headers (be careful not to log sensitive tokens in production, but here we need to debug)
    console.log('Auth API Headers:', request.headers);
    return request;
});

authApi.interceptors.response.use(
    response => {
        console.log('Auth API Response:', response.status, response.data);
        return response;
    },
    error => {
        console.error('Auth API Error:', error.response?.status, error.response?.data);
        return Promise.reject(error);
    }
);

/**
 * Login user with credentials
 */
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const payload = {
        email: credentials.email,
        motDePasse: credentials.password,
    };
    // Use any to bypass type check for raw response wrapper
    const response = await authApi.post<any>('/connexion', payload);
    const result = response.data;

    if (!result.data || !result.data.accessToken) {
        throw new Error('Invalid response from server');
    }

    const { accessToken, refreshToken, utilisateur } = result.data;

    // Persist tokens and user ID
    setTokens(accessToken, refreshToken);
    if (utilisateur?.idUtilisateur) {
        localStorage.setItem(USER_ID_KEY, utilisateur.idUtilisateur);
    }

    return {
        access_token: accessToken,
        refresh_token: refreshToken,
        user: utilisateur,
    };
};

/**
 * Register a new user
 */
export const register = async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const formData = new FormData();
    formData.append('pseudo', credentials.pseudo);
    formData.append('email', credentials.email);
    formData.append('motDePasse', credentials.password);
    if (credentials.confirmPassword) {
        formData.append('confirmationMotDePasse', credentials.confirmPassword);
    }

    // Append avatar if present
    if (credentials.avatar) {
        formData.append('avatar', credentials.avatar);
    }

    const response = await authApi.post<any>('', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    const result = response.data;

    // Register might return 201 with data, similar to login
    if (!result.data || !result.data.accessToken) {
        // If auto-login after register is not supported by backend, we might need to handle it.
        // But backend `inscription` returns `this.formatUserResponse(savedUser)` in data?? 
        // Wait, backend inscription DOES NOT generate tokens in the code I saw!
        // It returns data: formatUserResponse(savedUser). No tokens.
        // So we cannot return AuthResponse (which requires tokens).
        // Checks backend auth.service.ts again...
        // `inscription` returns { message, status, data: userWithoutPassword }. NO TOKENS.
        // So we must LOGIN after register or return a partial response. 
        // Frontend expects AuthResponse.
        // I will trigger a login after successful registration automatically.

        return login({ email: credentials.email, password: credentials.password });
    }

    // If backend DOES return tokens (unlikely based on my read), handle it:
    const { accessToken, refreshToken, utilisateur } = result.data;
    setTokens(accessToken, refreshToken);
    if (utilisateur?.idUtilisateur) {
        localStorage.setItem(USER_ID_KEY, utilisateur.idUtilisateur);
    }

    return {
        access_token: accessToken,
        refresh_token: refreshToken,
        user: utilisateur,
    };
};

/**
 * Logout user and clear tokens
 */
export const logout = (): void => {
    clearTokens();
};

/**
 * Get current authenticated user
 */
export const getCurrentUser = async (): Promise<User> => {
    const token = getAccessToken();

    console.log('getCurrentUser: Token found:', token ? 'Yes (length: ' + token.length + ')' : 'No');

    if (!token) {
        throw new Error('No access token found');
    }

    try {
        const response = await authApi.get<any>('/me', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        // Backend returns { data: user, message: "...", status: 200 }
        if (response.data && response.data.data) {
            return response.data.data;
        }

        // Fallback for different response structure
        return response.data;
    } catch (error) {
        console.error('getCurrentUser: Error fetching user:', error);
        throw error;
    }
};

/**
 * Update user profile
 */
export const updateUser = async (userId: string, data: Partial<User> & { motDePasse?: string }, avatarFile?: File): Promise<User> => {
    // Note: userId is ignored as we use the authenticated user's token via /auth/profile endpoint
    const token = getAccessToken();
    if (!token) throw new Error('No access token found');

    const formData = new FormData();
    // Append all text fields
    Object.entries(data).forEach(([key, value]) => {
        // Only append if value is not null, undefined, AND not an empty string
        if (value !== undefined && value !== null && value !== '') {
            formData.append(key, String(value));
        }
    });

    // Append avatar file if present
    if (avatarFile) {
        formData.append('avatar', avatarFile);
    }

    // Always use /auth/profile with multipart/form-data because the backend uses FileInterceptor
    const response = await api.patch<any>('/auth/profile', formData);

    const result = response.data;
    // Handle both { data: user } and direct user formats
    if (result && result.data) {
        return result.data;
    }
    return result;
};

/**
 * Refresh access token using refresh token
 */
export const refreshToken = async (): Promise<string> => {
    const refreshTokenValue = getRefreshToken();
    const userId = localStorage.getItem(USER_ID_KEY);

    if (!refreshTokenValue || !userId) {
        throw new Error('No refresh token or user ID found');
    }

    // Backend expects /refresh-token/:id with JwtAuthGuard
    // We try to send refresh token as Bearer to pass the guard
    const response = await authApi.post<any>(`/refresh-token/${userId}`, {}, {
        headers: {
            Authorization: `Bearer ${refreshTokenValue}`,
        },
    });

    if (response.data && response.data.data && response.data.data.accessToken) {
        const newAccessToken = response.data.data.accessToken;
        const newRefreshToken = response.data.data.refreshToken; // Backend rotates refresh token too
        setTokens(newAccessToken, newRefreshToken || refreshTokenValue);
        return newAccessToken;
    }

    throw new Error('Failed to refresh token');
};

/**
 * Get stored access token
 */
export const getAccessToken = (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
};

/**
 * Get stored refresh token
 */
export const getRefreshToken = (): string | null => {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
};

/**
 * Store tokens in localStorage
 */
export const setTokens = (accessToken: string, refreshToken?: string): void => {
    localStorage.setItem(TOKEN_KEY, accessToken);
    if (refreshToken) {
        localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }
};

/**
 * Clear all tokens from localStorage
 */
export const clearTokens = (): void => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_ID_KEY);
};

/**
 * Check if user is authenticated (has valid token)
 */
export const isAuthenticated = (): boolean => {
    return !!getAccessToken();
};
