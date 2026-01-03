import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Folder, Settings, LogOut } from 'lucide-react';

export const AdminLayout = () => {
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="flex h-screen bg-slate-50">
            {/* Sidebar */}
            <aside className="w-64 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 text-white flex flex-col shadow-xl gap-4" style={{ padding: '10px 20px' }}>
                <div className="p-8 border-b border-slate-800" style={{ padding: '20px 0 20px 0' }}>
                    <h1 className="text-xl font-black tracking-tight text-blue-400">
                        BNGRC MENABE
                    </h1>
                    <p className="text-xs text-slate-400 mt-1">Gestion Documentaire</p>
                </div>

                <nav className="flex-1 overflow-y-auto ">
                    <Link to="/admin" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive('/admin') ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`} style={{ padding: '10px 15px 10px 15px' }}>
                        <LayoutDashboard size={20} />
                        <span className="font-semibold text-sm">Tableau de bord</span>
                    </Link>

                    <Link to="/admin/rubriques" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive('/admin/rubriques') ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`} style={{ padding: '10px 15px 10px 15px' }}>
                        <Folder size={20} />
                        <span className="font-semibold text-sm">Rubriques</span>
                    </Link>

                    {/* Placeholder for future sections */}
                    <Link to="/admin/settings" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive('/admin/settings') ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`} style={{ padding: '10px 15px 10px 15px' }}>
                        <Settings size={20} />
                        <span className="font-semibold text-sm">Paramètres</span>
                    </Link>
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <Link to="/" className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-200" style={{ padding: '10px 15px 10px 15px' }}>
                        <LogOut size={20} />
                        <span className="font-semibold text-sm">Quitter Admin</span>
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto bg-slate-50">
                <div className="w-full mx-auto" style={{ padding: '20px' }}>
                    <Outlet />
                </div>
            </main>
        </div>
    );
};
