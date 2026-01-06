import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, CheckCircle, XCircle, Trash2, ChevronLeft, ChevronRight, Loader2, Shield, User as UserIcon, Edit2 } from 'lucide-react';
import { getUsers, validateUser, rejectUser, deleteUser, updateUser } from '../../../services/userService';
import type { User } from '../../../types/authTypes';
import { EditUserModal } from './EditUserModal';

export const UserList = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [limit] = useState(10);
    const [error, setError] = useState<string | null>(null);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchUsers();
        }, 500);

        return () => clearTimeout(timer);
    }, [search, page]);

    const fetchUsers = async () => {
        try {
            setIsLoading(true);
            const response = await getUsers(page, limit, search);

            // Handle different response structures gracefully
            if (response && Array.isArray(response.data)) {
                setUsers(response.data);
                if (response.total) {
                    setTotalPages(Math.ceil(response.total / limit));
                } else {
                    // If no total returned, we can't do proper pagination, 
                    // assume 1 page or rely on data length
                    setTotalPages(1);
                }
            } else if (Array.isArray(response)) {
                // Fallback if backend returns direct array
                setUsers(response);
                setTotalPages(1);
            }
        } catch (err) {
            console.error(err);
            setError('Impossible de charger les utilisateurs');
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (user: User) => {
        setEditingUser(user);
        setIsEditModalOpen(true);
    };

    const handleSaveUser = async (id: string, data: Partial<User>) => {
        try {
            await updateUser(id, data);
            fetchUsers();
            // Optional: Show success message/toast
        } catch (err) {
            console.error('Error updating user:', err);
            // Optional: Show error
        }
    };

    const handleValidate = async (id: string) => {
        try {
            await validateUser(id);
            fetchUsers();
        } catch (err) {
            console.error('Error validating user:', err);
        }
    };

    const handleReject = async (id: string) => {
        try {
            await rejectUser(id);
            fetchUsers();
        } catch (err) {
            console.error('Error rejecting user:', err);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) return;
        try {
            await deleteUser(id);
            fetchUsers();
        } catch (err) {
            console.error('Error deleting user:', err);
        }
    };

    const getStatusBadge = (status?: string) => {
        switch (status) {
            case 'ACTIF':
                return <span className="rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200" style={{padding: '4px 12px'}}>Actif</span>;
            case 'ATTENTE':
                return <span className="rounded-full text-xs font-bold bg-yellow-100 text-yellow-700 border border-yellow-200" style={{padding: '4px 12px'}}>En attente</span>;
            case 'REJETER':
                return <span className="rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-200">Rejeté</span>;
            default:
                return <span className="rounded-full text-xs font-bold bg-gray-100 text-gray-700 border border-gray-200" style={{padding: '4px 12px'}}>Inconnu</span>;
        }
    };

    const getAvatarUrl = (path?: string) => {
        if (!path) return null;
        if (path.startsWith('http')) return path;

        // Normalize path separators (win vs linux)
        const cleanPath = path.replace(/\\/g, '/');

        // Ensure path doesn't start with slash if we're appending to base
        const relativePath = cleanPath.startsWith('/') ? cleanPath.substring(1) : cleanPath;

        // If path already includes 'storage/', use it as is, otherwise assume it needs prefix?
        // Based on backend config: prefix is /storage, db path is storage/avatar/...
        // So http://localhost:3001/storage/avatar/img.jpg

        return `http://localhost:3001/${relativePath}`;
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white  rounded-2xl shadow-sm border border-slate-200" style={{ padding: '16px' }}>
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Rechercher un utilisateur..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-none transition-all"
                        style={{ padding: '16px 40px 8px' }}
                    />
                </div>
                <div className="text-md text-slate-500 font-medium">
                    Page {page} sur {totalPages}
                </div>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 rounded-xl border border-red-200" style={{ padding: '16px' }}>
                    {error}
                </div>
            )}

            <div className="bg-white rounded-xl overflow-hidden" style={{ padding: '16px' }}>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider" style={{ padding: '16px 24px' }}>Utilisateur</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider" style={{ padding: '16px 24px' }}>Email</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider" style={{ padding: '16px 24px' }}>Rôle</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider" style={{ padding: '16px 24px' }}>Statut</th>
                                <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider" style={{ padding: '16px 24px' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            <AnimatePresence>
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={5} className="p-8 text-center text-slate-500" style={{ padding: '32px' }}>
                                            <div className="flex justify-center items-center gap-2">
                                                <Loader2 className="animate-spin" size={20} />
                                                Chargement...
                                            </div>
                                        </td>
                                    </tr>
                                ) : users.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="text-center text-slate-500" style={{ padding: '32px' }}>
                                            Aucun utilisateur trouvé.
                                        </td>
                                    </tr>
                                ) : (
                                    users.map((user) => (
                                        <motion.tr
                                            key={user.idUtilisateur}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="hover:bg-slate-50/50 transition-colors"
                                        >
                                            <td style={{ padding: '16px 24px' }}>
                                                <div className="flex items-center gap-3">
                                                    {user.avatar ? (
                                                        <img src={getAvatarUrl(user.avatar) || ''} alt={user.pseudo} className="w-10 h-10 rounded-full object-cover border-2 border-slate-100 shadow-sm" />
                                                    ) : (
                                                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 border-2 border-slate-200">
                                                            <UserIcon size={20} />
                                                        </div>
                                                    )}
                                                    <span className="font-bold text-slate-700">{user.pseudo}</span>
                                                </div>
                                            </td>
                                            <td className="text-slate-600 font-medium text-sm" style={{ padding: '16px 24px' }}>
                                                {user.email}
                                            </td>
                                            <td style={{ padding: '16px 24px' }}>
                                                <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                                                    {user.role === 'ADMIN' && <Shield size={16} className="text-purple-500" />}
                                                    {user.role}
                                                </div>
                                            </td>
                                            <td style={{ padding: '16px 24px' }}>
                                                {getStatusBadge(user.statut)}
                                            </td>
                                            <td className="text-right" style={{ padding: '16px 24px' }}>
                                                <div className="flex items-center justify-end gap-2">
                                                    {user.statut === 'ATTENTE' && (
                                                        <button
                                                            onClick={() => handleValidate(user.idUtilisateur)}
                                                            className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 hover:scale-105 transition-all"
                                                            title="Valider"
                                                        >
                                                            <CheckCircle size={18} />
                                                        </button>
                                                    )}
                                                    {user.statut !== 'REJETER' && (
                                                        <button
                                                            onClick={() => handleReject(user.idUtilisateur)}
                                                            className="p-2 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 hover:scale-105 transition-all"
                                                            title="Rejeter"
                                                        >
                                                            <XCircle size={18} />
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleEdit(user)}
                                                        className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 hover:scale-105 transition-all"
                                                        title="Modifier"
                                                    >
                                                        <Edit2 size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(user.idUtilisateur)}
                                                        className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 hover:scale-105 transition-all"
                                                        title="Supprimer"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))
                                )}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-6">
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <div className="flex gap-2">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                            <button
                                key={pageNum}
                                onClick={() => setPage(pageNum)}
                                className={`w-10 h-10 rounded-xl font-bold transition-all shadow-sm ${page === pageNum
                                    ? 'bg-blue-600 text-white shadow-blue-600/20 scale-105'
                                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                                    }`}
                            >
                                {pageNum}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            )}

            <EditUserModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSave={handleSaveUser}
                user={editingUser}
            />
        </div>
    );
};
