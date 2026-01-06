import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Loader2, User as UserIcon } from 'lucide-react';
import type { User } from '../../../types/authTypes';

interface EditUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (id: string, data: Partial<User>) => Promise<void>;
    user: User | null;
}

export const EditUserModal = ({ isOpen, onClose, onSave, user }: EditUserModalProps) => {
    const [pseudo, setPseudo] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState<'ADMIN' | 'CLIENT'>('CLIENT');
    const [statut, setStatut] = useState<'ATTENTE' | 'ACTIF' | 'REJETER'>('ATTENTE');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (user) {
            setPseudo(user.pseudo);
            setEmail(user.email);
            setRole(user.role);
            setStatut(user.statut || 'ATTENTE');
        }
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        try {
            setIsSaving(true);
            await onSave(user.idUtilisateur, {
                pseudo,
                email,
                role,
                statut
            });
            onClose();
        } catch (error) {
            console.error('Error saving user:', error);
            // Ideally handle error display here
        } finally {
            setIsSaving(false);
        }
    };

    if (!isOpen || !user) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ padding: '16px' }}>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-lg bg-white rounded-3xl shadow-xl overflow-hidden"
                >
                    <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50" style={{ padding: '16px 24px' }}>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 text-blue-600 rounded-xl" style={{ padding: '8px' }}>
                                <UserIcon size={20} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-800">Modifier l'utilisateur</h3>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-600 transition-colors"
                            style={{ padding: '8px' }}
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-4" style={{ padding: '24px' }}>
                        <div className="flex flex-col gap-2">
                            <label className="text-md font-semibold text-slate-600">Pseudo</label>
                            <input
                                type="text"
                                value={pseudo}
                                onChange={(e) => setPseudo(e.target.value)}
                                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                                style={{ padding: '8px 16px' }}
                                disabled
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-md font-semibold text-slate-600">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                                style={{ padding: '8px 16px' }}
                                disabled
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-2">
                                <label className="text-md font-semibold text-slate-600">Rôle</label>
                                <select
                                    value={role}
                                    onChange={(e) => setRole(e.target.value as 'ADMIN' | 'CLIENT')}
                                    className="w-full rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-white"
                                    style={{ padding: '8px 16px' }}
                                >
                                    <option value="CLIENT">Client</option>
                                    <option value="ADMIN">Administrateur</option>
                                </select>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-md font-semibold text-slate-600">Statut</label>
                                <select
                                    value={statut}
                                    onChange={(e) => setStatut(e.target.value as 'ATTENTE' | 'ACTIF' | 'REJETER')}
                                    className="w-full rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-white"
                                    style={{ padding: '8px 16px' }}
                                >
                                    <option value="ATTENTE">En attente</option>
                                    <option value="ACTIF">Actif</option>
                                    <option value="REJETER">Rejeté</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3" style={{ paddingTop: '16px' }}>
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-slate-600 font-semibold hover:bg-slate-50 rounded-xl transition-colors"
                                style={{ padding: '8px 16px', backgroundColor: '#e7e3e3ff' }}
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-600/20"
                                style={{ padding: '8px 16px', backgroundColor: '#0055d4ff' }}
                            >
                                {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                                Enregistrer
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};