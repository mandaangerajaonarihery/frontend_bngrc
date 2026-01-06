import { createContext } from 'react';
import type { AuthContextType } from '../types/authTypes';

// Create the context
export const AuthContext = createContext<AuthContextType | undefined>(undefined);
