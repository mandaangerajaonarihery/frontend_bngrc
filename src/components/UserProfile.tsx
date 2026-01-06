import React, { useState } from 'react';
import { Shield } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { UserRole } from '../types/authTypes';
import { ProfileModal } from './ProfileModal';

export const UserProfile: React.FC = () => {
    const { user } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (!user) return null;

    const getInitials = (pseudo: string) => {
        if (!pseudo) return '??';
        return pseudo
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const isAdmin = user.role === UserRole.ADMIN;

    return (
        <>
            <div className="relative">
                {/* Profile Button */}
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-3 px-3 py-1.5 rounded-xl hover:bg-slate-100 transition-all group"
                >
                    {/* Avatar */}
                    <div className="relative">
                        {user.avatar ? (
                            <img
                                src={user.avatar}
                                alt={user.pseudo}
                                className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                            />
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm shadow-sm border-2 border-white">
                                {getInitials(user.pseudo)}
                            </div>
                        )}
                        {/* Role Badge */}
                        {isAdmin && (
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-blue-600 border-2 border-white flex items-center justify-center">
                                <Shield className="w-3 h-3 text-white" />
                            </div>
                        )}
                    </div>

                    {/* User Info */}
                    <div className="hidden md:block text-left">
                        <p className="text-sm font-bold text-slate-700 group-hover:text-blue-600 transition-colors">{user.pseudo}</p>
                        <p className="text-xs text-slate-500 capitalize">{user.role}</p>
                    </div>
                </button>
            </div>

            <ProfileModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    );
};
