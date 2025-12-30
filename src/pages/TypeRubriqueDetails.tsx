import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getTypeRubriques, getFichiers, getRubriqueById } from '../services/api';
import type { TypeRubrique, Fichier, Rubrique } from '../types';
import { FileCard } from '../components/FileCard';
import { FileViewer } from '../components/FileViewer';
import { InputWithIcon } from '../components/InputWithIcon';
import { ChevronRight, ArrowLeft, Layers, FileX, FolderOpen, Search } from 'lucide-react';
import { motion } from 'framer-motion';

export const TypeRubriqueDetails = () => {
    const { rubriqueId, typeId } = useParams<{ rubriqueId: string; typeId: string }>();
    const [typeRubrique, setTypeRubrique] = useState<TypeRubrique | undefined>();
    const [rubrique, setRubrique] = useState<Rubrique | undefined>();
    const [fichiers, setFichiers] = useState<Fichier[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

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
            <div className="flex items-center justify-center h-screen bg-gray-50">
                <div className="relative">
                    <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                    <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-b-blue-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }} />
                </div>
            </div>
        );
    }

    if (!typeRubrique || !rubrique) {
        return (
            <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
                <div className="max-w-7xl mx-auto">
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
                </div>
            </div>
        );
    }

    // Filter files based on search query
    const filteredFichiers = fichiers.filter(file =>
        file.nomFichier.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen flex flex-col">
            {/* Hero Header Section - Full Width */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 w-full min-h-[30vh] flex flex-col justify-center items-center p-8 shadow-2xl"
            >
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -mr-48 -mt-48" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -ml-32 -mb-32" />

                {/* Back Button - Absolute top left */}
                <div className="absolute top-8 left-8 z-20 text-white">
                    <Link
                        to={`/rubriques/${rubriqueId}`}
                        className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-xl text-sm font-semibold hover:bg-white/20 transition-all duration-200 border border-white/10"
                        style={{ paddingLeft: '12px', paddingRight: '12px', paddingTop: '6px', paddingBottom: '6px' }}
                    >
                        <ArrowLeft size={16} strokeWidth={2.5} />
                        <span>Retour</span>
                    </Link>
                </div>

                <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center justify-center text-center gap-14">
                    <div className="flex flex-col items-center">
                        <div className="flex items-center gap-3 mb-4">
                            <motion.div
                                animate={{ rotate: [0, 10, -10, 0] }}
                                transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                            >
                                <FolderOpen className="text-blue-300" size={32} strokeWidth={2.5} />
                            </motion.div>
                            <h1 className="text-3xl md:text-4xl font-black text-white leading-tight">
                                {typeRubrique.nomTypeRubrique}
                            </h1>
                        </div>

                        <p className="text-blue-100 text-base md:text-lg mb-8 max-w-3xl leading-relaxed">
                            Documents disponibles dans cette catégorie
                        </p>
                    </div>

                    {/* Search Bar */}
                    <div className="w-full max-w-2xl mx-auto flex justify-center">
                        <InputWithIcon
                            icon={Search}
                            iconPosition="left"
                            placeholder="Rechercher un document..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </motion.div>

            {/* Files Grid - Centered Container */}
            <div className="flex-1 w-full bg-gray-50">
                <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    {/* Breadcrumb Header */}
                    <motion.h3
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-lg md:text-xl mb-4 flex items-center flex-wrap"
                        style={{ marginLeft: '40px', marginTop: '20px' }}
                    >
                        <Link to="/" className="font-medium text-slate-500 hover:text-blue-600 transition-colors">
                            Liste des Rubriques
                        </Link>
                        <ChevronRight size={20} className="mx-2 text-slate-400" />
                        <Link to={`/rubriques/${rubriqueId}`} className="font-medium text-slate-500 hover:text-blue-600 transition-colors">
                            {rubrique.libelle}
                        </Link>
                        <ChevronRight size={20} className="mx-2 text-slate-400" />
                        <span className="font-bold text-slate-900">
                            {typeRubrique.nomTypeRubrique}
                        </span>
                    </motion.h3>

                    {filteredFichiers.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 gap-4 md:gap-5" style={{ marginLeft: '40px', marginRight: '40px', marginTop: '20px', marginBottom: '20px' }}>
                            {filteredFichiers.map((file, index) => (
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
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">
                                {searchQuery ? 'Aucun résultat' : 'Aucun document'}
                            </h3>
                            <p className="text-slate-500 max-w-md mx-auto">
                                {searchQuery
                                    ? 'Aucun document ne correspond à votre recherche.'
                                    : 'Cette catégorie ne contient pas encore de documents.'}
                            </p>
                        </motion.div>
                    )}
                </div>
            </div>

            <FileViewer
                file={selectedFile}
                isOpen={viewerOpen}
                onClose={() => setViewerOpen(false)}
            />
        </div>
    );
};
