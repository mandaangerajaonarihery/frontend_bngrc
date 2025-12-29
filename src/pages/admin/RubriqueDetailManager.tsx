import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getRubriqueWithDetails, createTypeRubrique, updateTypeRubrique, deleteTypeRubrique, uploadFichier, deleteFichier } from '../../services/api';
import type { Rubrique, TypeRubrique, Fichier } from '../../types';
import { ArrowLeft, Plus, Trash2, Upload, FileText, X, Layers, Edit, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { FileViewer } from '../../components/FileViewer';

export const RubriqueDetailManager = () => {
    const { id } = useParams<{ id: string }>();
    const [rubrique, setRubrique] = useState<Rubrique | undefined>();
    const [loading, setLoading] = useState(true);

    // Type Modal State
    const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);
    const [editingType, setEditingType] = useState<TypeRubrique | null>(null);
    const [typeName, setTypeName] = useState('');
    const [isSubmittingType, setIsSubmittingType] = useState(false);



    // File Viewer State
    const [isViewerOpen, setIsViewerOpen] = useState(false);
    const [viewingFile, setViewingFile] = useState<Fichier | null>(null);

    const [uploadingState, setUploadingState] = useState<{ [key: string]: boolean }>({});

    const fetchDetails = () => {
        if (id) {
            getRubriqueWithDetails(id).then(data => {
                setRubrique(data);
                setLoading(false);
            }).catch(err => {
                console.error(err);
                toast.error("Impossible de charger les détails dela rubrique");
                setLoading(false);
            });
        }
    };

    useEffect(() => {
        fetchDetails();
    }, [id]);

    // Modal Helpers
    const openTypeModal = (type?: TypeRubrique) => {
        if (type) {
            setEditingType(type);
            setTypeName(type.nomTypeRubrique);
        } else {
            setEditingType(null);
            setTypeName('');
        }
        setIsTypeModalOpen(true);
    };

    const closeTypeModal = () => {
        setIsTypeModalOpen(false);
        setEditingType(null);
        setTypeName('');
    };

    // File Modal Helpers




    const openFileViewer = (file: Fichier) => {
        setViewingFile(file);
        setIsViewerOpen(true);
    };

    const closeFileViewer = () => {
        setIsViewerOpen(false);
        setViewingFile(null);
    };

    const handleSaveType = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!typeName || !id) return;

        setIsSubmittingType(true);
        try {
            if (editingType) {
                await updateTypeRubrique(editingType.idTypeRubrique, { nomTypeRubrique: typeName });
                toast.success(`Catégorie "${typeName}" mise à jour`);
            } else {
                await createTypeRubrique({
                    nomTypeRubrique: typeName,
                    idRubrique: id
                });
                toast.success(`Catégorie "${typeName}" créée`);
            }
            closeTypeModal();
            fetchDetails();
        } catch (error) {
            console.error(error);
            toast.error("Erreur lors de l'enregistrement de la catégorie");
        } finally {
            setIsSubmittingType(false);
        }
    };

    const handleDeleteType = async (typeId: string) => {
        toast.custom((t) => (
            <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-200 w-full max-w-sm">
                <h3 className="font-bold text-slate-800 mb-2">Supprimer la catégorie ?</h3>
                <p className="text-sm text-slate-500 mb-4">Cela supprimera également tous les fichiers associés.</p>
                <div className="flex justify-end gap-2">
                    <button
                        onClick={() => toast.dismiss(t)}
                        className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-medium"
                    >
                        Annuler
                    </button>
                    <button
                        onClick={async () => {
                            toast.dismiss(t);
                            const promise = deleteTypeRubrique(typeId);
                            toast.promise(promise, {
                                loading: 'Suppression...',
                                success: () => {
                                    fetchDetails();
                                    return 'Catégorie supprimée';
                                },
                                error: 'Erreur lors de la suppression'
                            });
                        }}
                        className="px-3 py-1.5 bg-red-600 text-white hover:bg-red-700 rounded-lg text-sm font-medium"
                    >
                        Supprimer
                    </button>
                </div>
            </div>
        ));
    };

    const handleFileUpload = async (typeId: string, event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files || event.target.files.length === 0) return;

        const file = event.target.files[0];
        const formData = new FormData();
        formData.append('file', file);
        formData.append('idTypeRubrique', typeId);

        setUploadingState(prev => ({ ...prev, [typeId]: true }));

        const promise = uploadFichier(formData);
        toast.promise(promise, {
            loading: 'Téléchargement du fichier...',
            success: () => {
                fetchDetails();
                return 'Fichier téléchargé avec succès';
            },
            error: 'Erreur lors du téléchargement',
        });

        try {
            await promise;
        } finally {
            setUploadingState(prev => ({ ...prev, [typeId]: false }));
            event.target.value = '';
        }
    };

    const handleDeleteFile = async (fileId: string) => {
        toast.custom((t) => (
            <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-200 w-full max-w-sm">
                <h3 className="font-bold text-slate-800 mb-2">Supprimer le fichier ?</h3>
                <div className="flex justify-end gap-2 mt-4">
                    <button onClick={() => toast.dismiss(t)} className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-medium">Annuler</button>
                    <button
                        onClick={async () => {
                            toast.dismiss(t);
                            await deleteFichier(fileId);
                            fetchDetails();
                            toast.success('Fichier supprimé');
                        }}
                        className="px-3 py-1.5 bg-red-600 text-white hover:bg-red-700 rounded-lg text-sm font-medium"
                    >
                        Supprimer
                    </button>
                </div>
            </div>
        ));
    };

    if (loading) return <div className="p-10 text-center animate-pulse text-slate-400">Chargement...</div>;
    if (!rubrique) return <div className="p-10 text-center text-red-500">Rubrique non trouvée</div>;

    const types = rubrique.typeRubriques || [];

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <Link to="/admin/rubriques" className="p-2 bg-white rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors">
                    <ArrowLeft size={20} className="text-slate-600" />
                </Link>
                <div>
                    <h1 className="text-3xl font-black text-slate-900">{rubrique.libelle}</h1>
                    <p className="text-slate-500">Gestion des catégories et des fichiers</p>
                </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <Layers className="text-blue-500" /> Catégories
                    </h2>
                    <button
                        onClick={() => openTypeModal()}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl font-semibold hover:bg-blue-100 transition-colors shadow-sm hover:shadow-md"
                    >
                        <Plus size={18} /> Ajouter une catégorie
                    </button>
                </div>

                <div className="space-y-6">
                    {types.map((type) => (
                        <div key={type.idTypeRubrique} className="border border-slate-200 rounded-2xl p-6 bg-slate-50/30 hover:bg-slate-50 hover:border-blue-200 transition-all">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-slate-800">{type.nomTypeRubrique}</h3>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => openTypeModal(type)}
                                        className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                                        title="Modifier le nom"
                                    >
                                        <Edit size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteType(type.idTypeRubrique)}
                                        className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Supprimer la catégorie"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {type.fichiers?.map(file => (
                                    <div key={file.idFichier} className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 shadow-sm group hover:border-blue-200 transition-colors">
                                        <div className="flex items-center gap-3 overflow-hidden cursor-pointer flex-1"
                                            onClick={() => openFileViewer(file)}
                                        >
                                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg inline-block mr-3">
                                                <FileText size={18} />
                                            </div>
                                            <div className="truncate inline-block align-middle">
                                                <p className="text-sm font-semibold text-slate-700 truncate">{file.nomFichier}</p>
                                                <p className="text-xs text-slate-400">{file.typeFichier} • {file.tailleFichier ? (file.tailleFichier / (1024 * 1024)).toFixed(2) + ' MB' : '0 MB'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() => openFileViewer(file)}
                                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Visualiser"
                                            >
                                                <Eye size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteFile(file.idFichier)}
                                                className="p-1.5 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                                title="Supprimer le fichier"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}

                                {(!type.fichiers || type.fichiers.length === 0) && (
                                    <p className="text-sm text-slate-400 italic text-center py-4 bg-slate-50 border border-dashed border-slate-200 rounded-xl">
                                        Aucun fichier
                                    </p>
                                )}

                                <div className="mt-4 pt-3">
                                    <label className="flex items-center justify-center gap-2 w-full py-2.5 bg-white border border-slate-300 border-dashed rounded-xl text-slate-500 text-sm font-medium hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 cursor-pointer transition-all shadow-sm">
                                        {uploadingState[type.idTypeRubrique] ? (
                                            <span className="animate-pulse flex items-center gap-2"><Upload size={16} className="animate-bounce" /> Téléchargement...</span>
                                        ) : (
                                            <>
                                                <Upload size={16} /> Ajouter un fichier
                                            </>
                                        )}
                                        <input
                                            type="file"
                                            className="hidden"
                                            onChange={(e) => handleFileUpload(type.idTypeRubrique, e)}
                                            disabled={uploadingState[type.idTypeRubrique]}
                                        />
                                    </label>
                                </div>
                            </div>
                        </div>
                    ))}

                    {types.length === 0 && (
                        <div className="text-center py-12 text-slate-500 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                            <Layers className="mx-auto text-slate-300 mb-3" size={48} strokeWidth={1.5} />
                            <p className="font-medium">Aucune catégorie définie</p>
                            <p className="text-sm opacity-75">Commencez par ajouter une nouvelle catégorie</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Type Rubrique Modal */}
            <AnimatePresence>
                {isTypeModalOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={closeTypeModal}
                            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-white rounded-3xl shadow-2xl z-50 p-8 border border-slate-200"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-slate-900">
                                    {editingType ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
                                </h2>
                                <button onClick={closeTypeModal} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                                    <X size={20} className="text-slate-500" />
                                </button>
                            </div>

                            <form onSubmit={handleSaveType} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Nom de la catégorie</label>
                                    <input
                                        type="text"
                                        value={typeName}
                                        onChange={(e) => setTypeName(e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                        placeholder="Ex: Rapports d'activité"
                                        autoFocus
                                    />
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={closeTypeModal}
                                        className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition-colors"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmittingType || !typeName}
                                        className="flex-1 px-4 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50 shadow-lg shadow-blue-600/20"
                                    >
                                        {isSubmittingType ? 'Enregistrement...' : 'Enregistrer'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* File Viewer */}
            <FileViewer
                file={viewingFile}
                isOpen={isViewerOpen}
                onClose={closeFileViewer}
            />


        </div>
    );
};
