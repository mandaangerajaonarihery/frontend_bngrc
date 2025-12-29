import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FolderOpen, Settings, LogOut } from 'lucide-react';

export const AdminLayout = () => {
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="flex h-screen bg-slate-50">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-white flex flex-col shadow-xl">
                <div className="p-8 border-b border-slate-800">
                    <h1 className="text-xl font-black tracking-tight text-blue-400">
                        BNGRC MENABE ADMIN
                    </h1>
                    <p className="text-xs text-slate-400 mt-1">Gestion Documentaire</p>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    <Link to="/admin" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive('/admin') ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
                        <LayoutDashboard size={20} />
                        <span className="font-semibold text-sm">Tableau de bord</span>
                    </Link>

                    <Link to="/admin/rubriques" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive('/admin/rubriques') ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
                        <FolderOpen size={20} />
                        <span className="font-semibold text-sm">Rubriques</span>
                    </Link>

                    {/* Placeholder for future sections */}
                    <Link to="/admin/settings" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive('/admin/settings') ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
                        <Settings size={20} />
                        <span className="font-semibold text-sm">Paramètres</span>
                    </Link>
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <Link to="/" className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-200">
                        <LogOut size={20} />
                        <span className="font-semibold text-sm">Quitter Admin</span>
                    </Link>
                </div>
            </aside>
            
            {/* Main Content */}
            <main className="flex-1 overflow-y-auto bg-slate-50">
                <div className="max-w-7xl mx-auto p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};
