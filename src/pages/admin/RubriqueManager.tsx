import { useEffect, useState } from 'react';
import { getRubriques, createRubrique, updateRubrique, deleteRubrique } from '../../services/api';
import type { Rubrique } from '../../types';
import { Plus, Trash2, Edit, X, Folder } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

export const RubriqueManager = () => {
    const [rubriques, setRubriques] = useState<Rubrique[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRubrique, setEditingRubrique] = useState<Rubrique | null>(null);

    // Form state
    const [libelle, setLibelle] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchRubriques = () => {
        getRubriques().then(setRubriques).catch(() => toast.error("Impossible de charger les rubriques"));
    };

    useEffect(() => {
        fetchRubriques();
    }, []);

    const openModal = (rubrique?: Rubrique) => {
        if (rubrique) {
            setEditingRubrique(rubrique);
            setLibelle(rubrique.libelle);
            setDescription(rubrique.description || '');
        } else {
            setEditingRubrique(null);
            setLibelle('');
            setDescription('');
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingRubrique(null);
        setLibelle('');
        setDescription('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!libelle) return;

        setLoading(true);
        const promise = editingRubrique
            ? updateRubrique(editingRubrique.idRubrique, { libelle, description })
            : createRubrique({ libelle, description });

        toast.promise(promise, {
            loading: editingRubrique ? 'Mise à jour...' : 'Création...',
            success: (data) => {
                fetchRubriques();
                closeModal();
                return editingRubrique
                    ? `Rubrique "${data.libelle}" mise à jour !`
                    : `Rubrique "${data.libelle}" créée !`;
            },
            error: (err) => {
                console.error(err);
                return "Une erreur est survenue.";
            }
        });

        try {
            await promise;
        } catch (error) {
            // Error handled by toast
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        toast.custom((t) => (
            <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-200 w-full max-w-sm">
                <h3 className="font-bold text-slate-800 mb-2">Confirmer la suppression</h3>
                <p className="text-sm text-slate-500 mb-4">Cette action est irréversible. Voulez-vous continuer ?</p>
                <div className="flex justify-end gap-2">
                    <button
                        onClick={() => toast.dismiss(t)}
                        className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-medium"
                    >
                        Annuler
                    </button>
                    <button
                        onClick={() => {
                            toast.dismiss(t);
                            performDelete(id);
                        }}
                        className="px-3 py-1.5 bg-red-600 text-white hover:bg-red-700 rounded-lg text-sm font-medium"
                    >
                        Supprimer
                    </button>
                </div>
            </div>
        ), { duration: Infinity });
    };

    const performDelete = async (id: string) => {
        const promise = deleteRubrique(id);
        toast.promise(promise, {
            loading: 'Suppression...',
            success: () => {
                fetchRubriques();
                return 'Rubrique supprimée avec succès';
            },
            error: 'Erreur lors de la suppression'
        });
    };

    return (
        <div className="space-y-6" style={{ padding: '20px' }}>
            <div className="flex items-center justify-between" style={{ padding: '20px 0 20px 0' }}>
                <h1 className="text-3xl font-black text-slate-900">Gestion des Rubriques</h1>
                <button
                    onClick={() => openModal()}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 cursor-pointer transition-all shadow-lg shadow-blue-600/20"
                    style={{ padding: '10px 20px', color: 'white', backgroundColor: '#2563eb' }}
                >
                    <Plus size={20} />
                    Nouvelle Rubrique
                </button>
            </div>

            <div className="bg-white rounded-3xl overflow-hidden" style={{ padding: '20px 30px 20px 30px' }}>
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200 text-xl font-bold">
                        <tr>
                            <th className="font-semibold text-slate-700" style={{ padding: '10px 20px' }}>Libellé</th>
                            <th className="font-semibold text-slate-700" style={{ padding: '10px 20px' }}>Description</th>
                            <th className="font-semibold text-slate-700 w-48" style={{ padding: '10px 20px' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-lg">
                        {rubriques.map((rubrique) => (
                            <tr key={rubrique.idRubrique} className="hover:bg-slate-50/50 transition-colors">
                                <td className="font-medium text-slate-900" style={{ padding: '10px 20px' }}>{rubrique.libelle}</td>
                                <td className="text-slate-500 max-w-md truncate" style={{ padding: '10px 20px' }}>{rubrique.description}</td>
                                <td className="" style={{ padding: '10px 20px' }}>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => openModal(rubrique)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            title="Modifier"
                                        >
                                            <Edit size={25} />
                                        </button>
                                        <Link
                                            to={`/admin/rubriques/${rubrique.idRubrique}`}
                                            className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                                            title="Gérer les fichiers"
                                        >
                                            <Folder size={25} />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(rubrique.idRubrique)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Supprimer"
                                        >
                                            <Trash2 size={25} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {rubriques.length === 0 && (
                            <tr>
                                <td colSpan={3} className="px-6 py-12 text-center text-slate-500">
                                    Aucune rubrique trouvée. Créez-en une !
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={closeModal}
                            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-3xl shadow-2xl z-50 p-8 border border-slate-200"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-slate-900">
                                    {editingRubrique ? 'Modifier la rubrique' : 'Nouvelle rubrique'}
                                </h2>
                                <button onClick={closeModal} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                                    <X size={20} className="text-slate-500" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Libellé</label>
                                    <input
                                        type="text"
                                        value={libelle}
                                        onChange={(e) => setLibelle(e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                        placeholder="Ex: Ressources Humaines"
                                        autoFocus
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Description</label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all h-32 resize-none"
                                        placeholder="Description courte..."
                                    />
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition-colors"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading || !libelle}
                                        className="flex-1 px-4 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50 shadow-lg shadow-blue-600/20"
                                    >
                                        {loading ? 'Enregistrement...' : 'Enregistrer'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};
