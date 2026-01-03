import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getRubriqueWithDetails, createTypeRubrique, updateTypeRubrique, deleteTypeRubrique, uploadFichier, deleteFichier } from '../../services/api';
import type { Rubrique, TypeRubrique, Fichier } from '../../types';
import { ArrowLeft, Plus, Trash2, Upload, FileText, X, Layers, Edit, Eye, ChevronRight, Folder } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { FileViewer } from '../../components/FileViewer';
import { AdminFileCard } from '../../components/AdminFileCard';

export const RubriqueDetailManager = () => {
    const { id } = useParams<{ id: string }>();
    const [rubrique, setRubrique] = useState<Rubrique | undefined>();
    const [loading, setLoading] = useState(true);
    const [selectedTypeId, setSelectedTypeId] = useState<string | null>(null);

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

    const types = rubrique?.typeRubriques || [];
    const selectedType = types.find(t => t.idTypeRubrique === selectedTypeId);

    if (loading) return <div className="p-10 text-center animate-pulse text-slate-400">Chargement...</div>;
    if (!rubrique) return <div className="p-10 text-center text-red-500">Rubrique non trouvée</div>;

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4" style={{ padding: "20px 0" }}>
                    <Link to="/admin/rubriques" className="p-2 bg-white rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors">
                        <ArrowLeft size={20} className="text-slate-600" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900">{rubrique.libelle}</h1>
                        <nav className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                            <button
                                onClick={() => setSelectedTypeId(null)}
                                className={`hover:text-blue-600 transition-colors ${!selectedTypeId ? 'font-bold text-blue-600' : ''}`}
                            >
                                Catégories
                            </button>
                            {selectedType && (
                                <>
                                    <ChevronRight size={14} />
                                    <span className="font-bold text-blue-600">{selectedType.nomTypeRubrique}</span>
                                </>
                            )}
                        </nav>
                    </div>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {!selectedTypeId ? (
                    <motion.div
                        key="folders"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6"
                        style={{ padding: '20px 30px 20px 30px' }}
                    >
                        {/* New Folder Button */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => openTypeModal()}
                            className="flex flex-col items-center justify-center gap-3 p-4 bg-white rounded-xl border-2 border-dashed border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 transition-all group h-[170px] w-full"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                                <Plus size={28} className="text-slate-400 group-hover:text-blue-600" />
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="text-[14px] font-bold text-slate-500 group-hover:text-blue-600">Nouveau Dossier</span>
                                <span className="text-[11px] text-slate-400 font-medium">Ajouter une catégorie</span>
                            </div>
                        </motion.button>

                        {types.map((type) => (
                            <motion.div
                                key={type.idTypeRubrique}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="relative group"
                            >
                                <div
                                    onClick={() => setSelectedTypeId(type.idTypeRubrique)}
                                    className="flex flex-col w-full bg-white rounded-xl border border-slate-200 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/5 transition-all cursor-pointer overflow-hidden"
                                >
                                    {/* Section 1: Icon Folder */}
                                    <div className="h-[60px] flex items-center bg-white justify-center border-b border-slate-100/50">
                                        <Folder size={38} className="text-blue-600" />
                                    </div>

                                    {/* Section 2: Category Name */}
                                    <div className="h-[70px] flex items-center justify-center px-3">
                                        <span className="text-[13px] font-bold text-slate-700 text-center line-clamp-2 leading-tight uppercase tracking-tight">
                                            {type.nomTypeRubrique}
                                        </span>
                                    </div>

                                    {/* Section 3: File Statistics */}
                                    <div className="h-[40px] flex items-center justify-center bg-slate-50/50 border-t border-slate-100/50">
                                        <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                                            {type.fichiers?.length || 0} fichiers
                                        </span>
                                    </div>
                                </div>

                                {/* Actions Overlay */}
                                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); openTypeModal(type); }}
                                        className="p-1.5 bg-white/90 backdrop-blur shadow-sm rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                                    >
                                        <Edit size={20} />
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleDeleteType(type.idTypeRubrique); }}
                                        className="p-1.5 bg-white/90 backdrop-blur shadow-sm rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <motion.div
                        key="files"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden"
                        style={{ padding: '20px 30px 20px 30px' }}
                    >
                        <div className="p-6 border-b border-slate-100 flex" style={{ padding: '20px 0px' }}>


                            <label className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 cursor-pointer transition-all shadow-lg shadow-blue-600/20" style={{ padding: '20px 30px' }}>
                                {uploadingState[selectedTypeId] ? (
                                    <span className="flex items-center gap-2"><Upload size={18} className="animate-bounce" />...</span>
                                ) : (
                                    <>
                                        <Upload size={18} /> Ajouter des fichiers
                                    </>
                                )}
                                <input
                                    type="file"
                                    className="hidden"
                                    onChange={(e) => handleFileUpload(selectedTypeId, e)}
                                    disabled={uploadingState[selectedTypeId]}
                                />
                            </label>
                        </div>

                        <div style={{ padding: '20px 0px' }}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                                {selectedType?.fichiers?.map(file => (
                                    <AdminFileCard
                                        key={file.idFichier}
                                        fichier={file}
                                        onView={openFileViewer}
                                        onDelete={handleDeleteFile}
                                    />
                                ))}

                                {(!selectedType?.fichiers || selectedType.fichiers.length === 0) && (
                                    <div className="col-span-full py-20 text-center">
                                        <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-dashed border-slate-200">
                                            <FileText className="text-slate-300" size={32} />
                                        </div>
                                        <p className="text-slate-400 italic">Ce dossier est vide</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Type Rubrique Modal */}
            <AnimatePresence>
                {isTypeModalOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={closeTypeModal}
                            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60]"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-white rounded-3xl shadow-2xl z-[70] p-8 border border-slate-200"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-slate-900">
                                    {editingType ? 'Modifier le dossier' : 'Nouveau dossier'}
                                </h2>
                                <button onClick={closeTypeModal} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                                    <X size={20} className="text-slate-500" />
                                </button>
                            </div>

                            <form onSubmit={handleSaveType} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Nom du dossier</label>
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
