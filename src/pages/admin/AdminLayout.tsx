import  { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Folder, Settings,  LogOut, Search } from 'lucide-react';
import { UserProfile } from '../../components/UserProfile';
import { useAuth } from '../../hooks/useAuth';
import { ConfirmLogoutModal } from '../../components/ConfirmLogoutModal';

export const AdminLayout = () => {
    const location = useLocation();
    const { logout } = useAuth();
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    const isActive = (path: string) => location.pathname === path;

    const getPageTitle = () => {
        if (location.pathname === '/admin') return 'Tableau de bord';
        if (location.pathname.startsWith('/admin/rubriques')) return 'Gestion des Rubriques';
        if (location.pathname === '/admin/settings') return 'Paramètres';
        return 'Administration';
    };

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden">
            {/* Sidebar */}
            <aside className="hidden lg:flex w-64 bg-slate-900 text-white flex-col shadow-xl">
                <div className="border-b border-slate-800" style={{ padding: '24px' }}>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                            <span className="font-bold text-white text-xs">BN</span>
                        </div>
                        <div>
                            <h1 className="text-sm font-bold tracking-tight text-white uppercase">
                                BNGRC Menabe
                            </h1>
                            <p className="text-[10px] text-slate-400 font-medium">Administration</p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 space-y-1" style={{ padding: '16px' }}>
                    <Link to="/admin" className={`flex items-center gap-3  rounded-xl transition-all duration-200 ${isActive('/admin') ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}
                        style={{ padding: '12px 16px' }}
                    >
                        <LayoutDashboard size={18} />
                        <span className="font-semibold text-sm">Tableau de bord</span>
                    </Link>

                    <Link to="/admin/rubriques" className={`flex items-center gap-3 rounded-xl transition-all duration-200 ${isActive('/admin/rubriques') ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`} style={{ padding: '12px 16px' }}>
                        <Folder size={18} />
                        <span className="font-semibold text-sm">Rubriques</span>
                    </Link>

                    <Link to="/admin/settings" className={`flex items-center gap-3 rounded-xl transition-all duration-200 ${isActive('/admin/settings') ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`} style={{ padding: '12px 16px' }}>
                        <Settings size={18} />
                        <span className="font-semibold text-sm">Paramètres</span>
                    </Link>
                </nav>

                <div className="border-t border-slate-800" style={{ padding: '16px' }}>
                    <div className="rounded-2xl bg-blue-600/10 border border-blue-500/20" style={{ padding: '16px' }}>
                        <p className="text-xs text-blue-400 font-medium uppercase tracking-wider" style={{ marginBottom: '8px' }}>Espace Public</p>
                        <Link
                            to="/"
                            className="flex items-center justify-center gap-2 w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-blue-600/20"
                            style={{ padding: "10px 0px" }}
                        >
                            <LayoutDashboard size={14} />
                            Voir le site client
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Header */}
                <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between z-30" style={{ padding: '0 32px' }}    >
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">{getPageTitle()}</h2>
                        <p className="text-xs text-slate-500 font-medium">Panel de contrôle administrateur</p>
                    </div>

                    <div className="flex items-center gap-6">
                        {/* Search Bar Placeholder */}
                        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-xl border border-transparent focus-within:border-blue-500/50 focus-within:bg-white transition-all" style={{ padding: '8px 16px' }}>
                            <Search size={18} className="text-slate-400" />
                            <input
                                type="text"
                                placeholder="Rechercher..."
                                className="bg-transparent border-none outline-none ring-0 focus:outline-none focus:ring-0 focus:border-none"
                            />
                        </div>

                        <div className="flex items-center gap-4 border-r border-slate-200" style={{ padding: '0 16px' }}>
                            {/* User Profile Component (now between Bell and Logout) */}
                            <UserProfile />

                            {/* Standalone Logout Button */}
                            <button
                                onClick={() => setShowLogoutConfirm(true)}
                                className="p-2 rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all group"
                                title="Déconnexion"
                            >
                                <LogOut size={20} />
                            </button>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-8">
                    <div className="mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>

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
