import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getRubriqueWithDetails } from '../services/api';
import type { Rubrique } from '../types';
import { FileCard } from '../components/FileCard';
import { FileViewer } from '../components/FileViewer';
import { ChevronRight, ArrowLeft, Layers, FolderOpen, FileX } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Fichier } from '../types';

export const RubriqueDetails = () => {
    const { id } = useParams<{ id: string }>();
    const [rubrique, setRubrique] = useState<Rubrique | undefined>();
    const [loading, setLoading] = useState(true);

    const [viewerOpen, setViewerOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<Fichier | null>(null);

    const handleViewFile = (file: Fichier) => {
        setSelectedFile(file);
        setViewerOpen(true);
    };

    useEffect(() => {
        if (id) {
            getRubriqueWithDetails(id).then(data => {
                setRubrique(data);
                setLoading(false);
            }).catch(err => {
                console.error("Failed to fetch rubrique details", err);
                setLoading(false);
            });
        }
    }, [id]);

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

    if (!rubrique) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200 shadow-lg"
            >
                <FolderOpen size={80} className="mx-auto text-slate-300 mb-6" strokeWidth={1.5} />
                <h2 className="text-3xl font-bold text-slate-900 mb-3">Rubrique non trouvée</h2>
                <p className="text-slate-500 mb-8 max-w-md mx-auto">
                    La rubrique que vous recherchez n'existe pas ou a été supprimée.
                </p>
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300"
                >
                    <ArrowLeft size={18} />
                    Retour au tableau de bord
                </Link>
            </motion.div>
        );
    }

    // Default to empty array if undefined
    const types = rubrique.typeRubriques || [];

    return (
        <div className="space-y-8">
            {/* Breadcrumb & Back Button */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
            >
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Link to="/" className="hover:text-blue-600 transition-colors font-medium">
                        Tableau de bord
                    </Link>
                    <ChevronRight size={14} className="text-slate-400" />
                    <span className="text-slate-800 font-semibold truncate max-w-xs sm:max-w-md">
                        {rubrique.libelle}
                    </span>
                </div>

                {/* Back Button */}
                <Link
                    to="/"
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
                        <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-3 leading-tight">
                            {rubrique.libelle}
                        </h1>
                        <p className="text-slate-600 text-base md:text-lg leading-relaxed max-w-3xl">
                            {rubrique.description}
                        </p>
                    </div>

                    {/* Stats badge */}
                    <div className="flex gap-3">
                        <div className="px-5 py-3 bg-white rounded-2xl border border-slate-200 shadow-sm">
                            <p className="text-2xl font-black text-blue-600">
                                {types.length}
                            </p>
                            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                                Catégories
                            </p>
                        </div>
                        <div className="px-5 py-3 bg-white rounded-2xl border border-slate-200 shadow-sm">
                            <p className="text-2xl font-black text-slate-900">
                                {types.reduce((acc, type) => acc + (type.fichiers?.length || 0), 0)}
                            </p>
                            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                                Documents
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Content Types */}
            <div className="space-y-10">
                {types.map((type, idx) => (
                    <motion.div
                        key={type.idTypeRubrique}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-50px' }}
                        transition={{ delay: idx * 0.1, duration: 0.4 }}
                        className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-lg transition-shadow duration-300"
                    >
                        {/* Type Header */}
                        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-gradient-to-br from-blue-100 to-blue-50 text-blue-700 rounded-xl shadow-sm">
                                    <Layers size={22} strokeWidth={2.5} />
                                </div>
                                <div>
                                    <h2 className="text-xl md:text-2xl font-bold text-slate-900">
                                        {type.nomTypeRubrique}
                                    </h2>
                                </div>
                            </div>
                            <span className="flex items-center justify-center min-w-[2.5rem] h-10 px-3 bg-gradient-to-r from-slate-100 to-slate-50 text-slate-700 rounded-xl text-sm font-bold shadow-sm border border-slate-200/50">
                                {type.fichiers?.length || 0}
                            </span>
                        </div>

                        {/* Files Grid */}
                        {(type.fichiers && type.fichiers.length > 0) ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
                                {type.fichiers.map(file => (
                                    <FileCard
                                        key={file.idFichier}
                                        fichier={file}
                                        onView={handleViewFile}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-200">
                                <FileX size={48} className="mx-auto text-slate-300 mb-3" strokeWidth={1.5} />
                                <p className="text-slate-500 font-medium">
                                    Aucun document disponible dans cette catégorie.
                                </p>
                            </div>
                        )}
                    </motion.div>
                ))}

                {/* Empty state for no types */}
                {types.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200 shadow-sm"
                    >
                        <Layers size={64} className="mx-auto text-slate-300 mb-4" strokeWidth={1.5} />
                        <h3 className="text-2xl font-bold text-slate-900 mb-2">Aucune catégorie</h3>
                        <p className="text-slate-500 max-w-md mx-auto">
                            Cette rubrique ne contient pas encore de catégories de documents.
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
