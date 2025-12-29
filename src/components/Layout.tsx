import { Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, Settings, Menu, Shield, X, User, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const Sidebar = ({ isOpen, toggle, isCollapsed, toggleCollapse }: {
    isOpen: boolean;
    toggle: () => void;
    isCollapsed: boolean;
    toggleCollapse: () => void;
}) => {
    const location = useLocation();

    const menuItems = [
        { icon: LayoutDashboard, label: 'Tableau de bord', path: '/' },
        { icon: FileText, label: 'Documents', path: '/rubriques' },
        { icon: Settings, label: 'Paramètres', path: '/settings' },
    ];

    return (
        <>
            {/* Desktop Sidebar - Collapsible */}
            <aside className={`hidden md:flex fixed left-0 top-0 h-full bg-white/90 backdrop-blur-xl border-r border-gray-200/80 z-50 flex-col shadow-xl transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'
                }`}>
                {/* Toggle Button */}
                <button
                    onClick={toggleCollapse}
                    className="absolute -right-3 top-6 w-6 h-6 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 shadow-md z-10 group"
                    aria-label={isCollapsed ? "Ouvrir la sidebar" : "Fermer la sidebar"}
                >
                    {isCollapsed ? (
                        <ChevronRight size={14} className="text-slate-600 group-hover:text-blue-600" strokeWidth={2.5} />
                    ) : (
                        <ChevronLeft size={14} className="text-slate-600 group-hover:text-blue-600" strokeWidth={2.5} />
                    )}
                </button>

                {/* Header */}
                <div className={`p-6 flex items-center border-b border-gray-100 transition-all duration-300 ${isCollapsed ? 'justify-center' : 'justify-between'
                    }`}>
                    <div className={`flex items-center gap-3 ${isCollapsed ? 'flex-col' : ''}`}>
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/40 ring-2 ring-blue-100">
                            <Shield size={20} strokeWidth={2.5} />
                        </div>
                        {!isCollapsed && (
                            <motion.span
                                initial={{ opacity: 0, width: 0 }}
                                animate={{ opacity: 1, width: 'auto' }}
                                exit={{ opacity: 0, width: 0 }}
                                transition={{ duration: 0.2 }}
                                className="font-bold text-xl tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent whitespace-nowrap"
                            >
                                BNGRC MENABE
                            </motion.span>
                        )}
                    </div>
                </div>

                {/* Navigation */}
                <nav className={`mt-6 px-4 flex flex-col gap-1 flex-1 ${isCollapsed ? 'items-center' : ''}`}>
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`relative flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group ${isCollapsed ? 'justify-center w-12' : 'justify-start'
                                    } ${isActive
                                        ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-600/30'
                                        : 'text-slate-600 hover:bg-blue-50/80 hover:text-blue-700'
                                    }`}
                                title={isCollapsed ? item.label : ''}
                            >
                                <item.icon
                                    size={20}
                                    className={`transition-transform duration-300 flex-shrink-0 ${isActive ? 'text-white scale-110' : 'text-slate-500 group-hover:text-blue-600 group-hover:scale-110'
                                        }`}
                                    strokeWidth={2.5}
                                />
                                {!isCollapsed && (
                                    <motion.span
                                        initial={{ opacity: 0, width: 0 }}
                                        animate={{ opacity: 1, width: 'auto' }}
                                        exit={{ opacity: 0, width: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="font-semibold text-sm whitespace-nowrap"
                                    >
                                        {item.label}
                                    </motion.span>
                                )}
                                {isActive && !isCollapsed && (
                                    <motion.div
                                        layoutId="active-indicator"
                                        className="absolute right-2 w-1.5 h-8 bg-white/40 rounded-full"
                                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                    />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-gray-100">
                    <div className={`p-4 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white shadow-xl relative overflow-hidden transition-all duration-300 ${isCollapsed ? 'flex justify-center' : ''
                        }`}>
                        <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/20 rounded-full blur-2xl"></div>
                        <div className={`relative z-10 flex items-center gap-3 ${isCollapsed ? 'flex-col' : ''}`}>
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-lg ring-2 ring-white/20 flex-shrink-0">
                                <User size={18} />
                            </div>
                            {!isCollapsed && (
                                <motion.div
                                    initial={{ opacity: 0, width: 0 }}
                                    animate={{ opacity: 1, width: 'auto' }}
                                    exit={{ opacity: 0, width: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="flex-1"
                                >
                                    <p className="text-xs text-slate-400 mb-0.5 whitespace-nowrap">Connecté en tant que</p>
                                    <p className="font-bold text-sm whitespace-nowrap">Administrateur</p>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </div>
            </aside>

            {/* Mobile Sidebar - Animated */}
            <AnimatePresence>
                {isOpen && (
                    <motion.aside
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        className="md:hidden fixed left-0 top-0 h-full bg-white/95 backdrop-blur-xl border-r border-gray-200 z-50 w-72 flex flex-col shadow-2xl"
                    >
                        <div className="p-6 flex items-center justify-between border-b border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/40 ring-2 ring-blue-100">
                                    <Shield size={20} strokeWidth={2.5} />
                                </div>
                                <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">BNGRC MENABE</span>
                            </div>
                            <button
                                onClick={toggle}
                                className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                                aria-label="Fermer le menu"
                            >
                                <X size={20} className="text-slate-600" />
                            </button>
                        </div>

                        <nav className="mt-6 px-4 flex flex-col gap-1 flex-1">
                            {menuItems.map((item) => {
                                const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
                                return (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        onClick={toggle}
                                        className={`relative flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group ${isActive
                                            ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-600/30'
                                            : 'text-slate-600 hover:bg-blue-50/80 hover:text-blue-700'
                                            }`}
                                    >
                                        <item.icon
                                            size={20}
                                            className={`transition-transform duration-300 ${isActive ? 'text-white scale-110' : 'text-slate-500 group-hover:text-blue-600 group-hover:scale-110'
                                                }`}
                                            strokeWidth={2.5}
                                        />
                                        <span className="font-semibold text-sm">{item.label}</span>
                                    </Link>
                                );
                            })}
                        </nav>

                        <div className="p-4 border-t border-gray-100">
                            <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white shadow-xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/20 rounded-full blur-2xl"></div>
                                <div className="relative z-10 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-lg ring-2 ring-white/20">
                                        <User size={18} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-slate-400 mb-0.5">Connecté en tant que</p>
                                        <p className="font-bold text-sm">Administrateur</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>
        </>
    );
};

export const Layout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
        // Load from localStorage
        const saved = localStorage.getItem('sidebarCollapsed');
        return saved ? JSON.parse(saved) : false;
    });

    // Save to localStorage when changed
    useEffect(() => {
        localStorage.setItem('sidebarCollapsed', JSON.stringify(sidebarCollapsed));
    }, [sidebarCollapsed]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
            <Sidebar
                isOpen={sidebarOpen}
                toggle={() => setSidebarOpen(!sidebarOpen)}
                isCollapsed={sidebarCollapsed}
                toggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
            />

            <style>{`
                @media (min-width: 768px) {
                    .content-wrapper {
                        margin-left: ${sidebarCollapsed ? '80px' : '256px'};
                        transition: margin-left 300ms ease-in-out;
                    }
                }
            `}</style>

            <div className="content-wrapper">
                <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-200/60 px-4 sm:px-6 py-4 flex items-center justify-between md:justify-end shadow-sm">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="md:hidden p-2.5 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                        aria-label="Ouvrir le menu"
                    >
                        <Menu size={24} strokeWidth={2} />
                    </button>

                    <div className="flex items-center gap-4">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 border-2 border-blue-300/50 shadow-sm"></div>
                    </div>
                </header>

                <main className="p-6 md:p-8 lg:p-10 max-w-7xl mx-auto">
                    <AnimatePresence mode="wait">
                        <Outlet />
                    </AnimatePresence>
                </main>
            </div>

            {/* Overlay for mobile */}
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};
