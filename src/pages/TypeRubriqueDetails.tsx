import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getTypeRubriques, getFichiers, getRubriqueById } from '../services/api';
import type { TypeRubrique, Fichier, Rubrique } from '../types';
import { FileCard } from '../components/FileCard';
import { FileViewer } from '../components/FileViewer';
import { ChevronRight, ArrowLeft, Layers, FileX } from 'lucide-react';
import { motion } from 'framer-motion';

export const TypeRubriqueDetails = () => {
    const { rubriqueId, typeId } = useParams<{ rubriqueId: string; typeId: string }>();
    const [typeRubrique, setTypeRubrique] = useState<TypeRubrique | undefined>();
    const [rubrique, setRubrique] = useState<Rubrique | undefined>();
    const [fichiers, setFichiers] = useState<Fichier[]>([]);
    const [loading, setLoading] = useState(true);

    const [viewerOpen, setViewerOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<Fichier | null>(null);

    const handleViewFile = (file: Fichier) => {
        setSelectedFile(file);
        setViewerOpen(true);
    };

    useEffect(() => {
        const fetchData = async () => {
            if (rubriqueId && typeId) {
                try {
                    // Fetch rubrique info
                    const rubriqueData = await getRubriqueById(rubriqueId);
                    setRubrique(rubriqueData);

                    // Fetch all types for this rubrique
                    const types = await getTypeRubriques(rubriqueId);
                    const currentType = types.find(t => t.idTypeRubrique === typeId);
                    setTypeRubrique(currentType);

                    // Fetch files for this type
                    const files = await getFichiers(typeId);
                    setFichiers(files);

                    setLoading(false);
                } catch (err) {
                    console.error("Failed to fetch type rubrique details", err);
                    setLoading(false);
                }
            }
        };

        fetchData();
    }, [rubriqueId, typeId]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="relative">
                    <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                    <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-b-blue-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }} />
                </div>
            </div>
        );
    }

    if (!typeRubrique || !rubrique) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200 shadow-lg"
            >
                <Layers size={80} className="mx-auto text-slate-300 mb-6" strokeWidth={1.5} />
                <h2 className="text-3xl font-bold text-slate-900 mb-3">Catégorie non trouvée</h2>
                <p className="text-slate-500 mb-8 max-w-md mx-auto">
                    La catégorie que vous recherchez n'existe pas ou a été supprimée.
                </p>
                <Link
                    to={rubriqueId ? `/rubriques/${rubriqueId}` : '/'}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300"
                >
                    <ArrowLeft size={18} />
                    Retour
                </Link>
            </motion.div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Breadcrumb & Back Button */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
            >
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-slate-500 flex-wrap">
                    <Link to="/" className="hover:text-blue-600 transition-colors font-medium">
                        Tableau de bord
                    </Link>
                    <ChevronRight size={14} className="text-slate-400" />
                    <Link
                        to={`/rubriques/${rubriqueId}`}
                        className="hover:text-blue-600 transition-colors font-medium truncate max-w-[150px]"
                    >
                        {rubrique.libelle}
                    </Link>
                    <ChevronRight size={14} className="text-slate-400" />
                    <span className="text-slate-800 font-semibold truncate max-w-xs sm:max-w-md">
                        {typeRubrique.nomTypeRubrique}
                    </span>
                </div>

                {/* Back Button */}
                <Link
                    to={`/rubriques/${rubriqueId}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-white rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                    <ArrowLeft size={16} strokeWidth={2.5} />
                    <span>Retour</span>
                </Link>
            </motion.div>

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-br from-white to-blue-50/30 p-8 rounded-3xl border border-slate-200/80 shadow-lg"
            >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2.5 bg-gradient-to-br from-blue-100 to-blue-50 text-blue-700 rounded-xl shadow-sm">
                                <Layers size={24} strokeWidth={2.5} />
                            </div>
                            <h1 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight">
                                {typeRubrique.nomTypeRubrique}
                            </h1>
                        </div>
                        <p className="text-slate-600 text-base md:text-lg leading-relaxed max-w-3xl">
                            Documents disponibles dans cette catégorie
                        </p>
                    </div>

                    {/* Stats badge */}
                    <div className="px-5 py-3 bg-white rounded-2xl border border-slate-200 shadow-sm">
                        <p className="text-2xl font-black text-blue-600">
                            {fichiers.length}
                        </p>
                        <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                            {fichiers.length > 1 ? 'Documents' : 'Document'}
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Files Grid */}
            <div>
                <motion.h2
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2"
                >
                    <div className="w-1 h-6 bg-gradient-to-b from-blue-600 to-blue-400 rounded-full" />
                    Tous les documents
                </motion.h2>

                {fichiers.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
                        {fichiers.map((file, index) => (
                            <motion.div
                                key={file.idFichier}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05, duration: 0.3 }}
                            >
                                <FileCard
                                    fichier={file}
                                    onView={handleViewFile}
                                />
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200 shadow-sm"
                    >
                        <FileX size={64} className="mx-auto text-slate-300 mb-4" strokeWidth={1.5} />
                        <h3 className="text-2xl font-bold text-slate-900 mb-2">Aucun document</h3>
                        <p className="text-slate-500 max-w-md mx-auto">
                            Cette catégorie ne contient pas encore de documents.
                        </p>
                    </motion.div>
                )}
            </div>

            <FileViewer
                file={selectedFile}
                isOpen={viewerOpen}
                onClose={() => setViewerOpen(false)}
            />
        </div>
    );
};
