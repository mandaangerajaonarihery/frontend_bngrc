import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { UserRole } from '../types/authTypes';

interface PrivateRouteProps {
    children: React.ReactElement;
    requiredRole?: UserRole;
}

/**
 * PrivateRoute component that protects routes requiring authentication
 * Optionally checks for specific user roles
 */
export const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, requiredRole }) => {
    const { isAuthenticated, isLoading, user } = useAuth();
    const location = useLocation();

    // Show loading state while checking authentication
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400"></div>
                    <p className="mt-4 text-slate-300 text-lg">Chargement...</p>
                </div>
            </div>
        );
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Check role if required
    if (requiredRole && user?.role !== requiredRole) {
        // Redirect to home if user doesn't have required role
        return <Navigate to="/" replace />;
    }

    return children;
};
