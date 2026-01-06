import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Bell, LogOut, Shield } from 'lucide-react';
import { UserProfile } from './UserProfile';
import { useAuth } from '../hooks/useAuth';
import { UserRole } from '../types/authTypes';
import { ConfirmLogoutModal } from './ConfirmLogoutModal';

/**
 * Composant Layout Principal (Client)
 * 
 * Ce composant sert de conteneur global pour toutes les pages de la partie client.
 * Il ne retient plus aucune contrainte de marge ou de padding pour permettre aux pages
 * de gérer elles-mêmes leur mise en page (ex: Hero section en pleine largeur).
 */
export const Layout = () => {
    const { user, logout } = useAuth();
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header Standard Full Width */}
            <header className="sticky top-0 z-50 w-full flex items-center justify-between backdrop-blur-md shadow-sm" style={{ padding: "24px" }}>
                {/* Logo / Brand - Top Left */}
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20 group-hover:scale-110 transition-transform">
                        <span className="text-white font-bold text-lg">BN</span>
                    </div>
                    <div>
                        <h1 className="text-slate-800 font-bold text-sm tracking-tight uppercase">BNGRC</h1>
                        <p className="text-[10px] text-slate-500 font-medium uppercase tracking-widest">Plateforme</p>
                    </div>
                </Link>

                {/* Header Actions - Top Right */}
                <div className="flex items-center gap-4">
                    {/* Notification Bell */}
                    <button className="relative p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-all">
                        <Bell size={20} />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
                    </button>

                    {/* User Profile Component */}
                    <UserProfile />

                    {/* Switch to Admin button (for admins only) */}
                    {user?.role === UserRole.ADMIN && (
                        <Link
                            to="/admin"
                            className="p-2 rounded-xl text-slate-500 hover:bg-blue-50 hover:text-blue-600 transition-all"
                            title="Accéder à l'Administration"
                        >
                            <Shield size={20} />
                        </Link>
                    )}

                    {/* Logout Icon */}
                    <button
                        onClick={() => setShowLogoutConfirm(true)}
                        className="p-2 rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all"
                        title="Déconnexion"
                    >
                        <LogOut size={20} />
                    </button>
                </div>
            </header>

            {/* Contenu Principal */}
            <main className="flex-1">
                <Outlet />
            </main>

            <ConfirmLogoutModal
                isOpen={showLogoutConfirm}
                onClose={() => setShowLogoutConfirm(false)}
                onConfirm={() => {
                    logout();
                    setShowLogoutConfirm(false);
                }}
            />
        </div>
    );
};