import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getRubriqueWithDetails } from '../services/api';
import type { Rubrique } from '../types';
import { TypeRubriqueCard } from '../components/TypeRubriqueCard';
import { ChevronRight, ArrowLeft, Search, Sparkles, Layers } from 'lucide-react';
import { motion } from 'framer-motion';

export const RubriqueDetails = () => {
    const { id } = useParams<{ id: string }>();
    const [rubrique, setRubrique] = useState<Rubrique | undefined>();
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

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
            <div className="flex items-center justify-center h-screen bg-gray-50">
                <div className="relative">
                    <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                    <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-b-blue-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }} />
                </div>
            </div>
        );
    }

    if (!rubrique) {
        return (
            <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200 shadow-lg"
                    >
                        <Layers size={80} className="mx-auto text-slate-300 mb-6" strokeWidth={1.5} />
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
                </div>
            </div>
        );
    }

    // Default to empty array if undefined
    const types = rubrique.typeRubriques || [];

    // Filter types based on search query
    const filteredTypes = types.filter(type =>
        type.nomTypeRubrique.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-8">
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

                {/* Hero Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-blue-800 rounded-3xl p-8 md:p-12 shadow-2xl"
                >
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl -mr-32 -mt-32" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl -ml-24 -mb-24" />

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <motion.div
                                animate={{ rotate: [0, 10, -10, 0] }}
                                transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                            >
                                <Sparkles className="text-blue-300" size={32} strokeWidth={2.5} />
                            </motion.div>
                            <h1 className="text-3xl md:text-4xl font-black text-white leading-tight">
                                {rubrique.libelle}
                            </h1>
                        </div>

                        <p className="text-blue-100 text-base md:text-lg mb-8 max-w-3xl leading-relaxed">
                            {rubrique.description}
                        </p>

                        {/* Search Bar */}
                        <div className="max-w-xl">
                            <div className="relative">
                                <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Rechercher une catégorie..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3.5 bg-white/95 backdrop-blur-sm border border-white/20 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all shadow-lg"
                                />
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="flex gap-6 mt-8">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-blue-400 rounded-full" />
                                <span className="text-white/90 text-sm font-semibold">
                                    {types.length} {types.length > 1 ? 'catégories' : 'catégorie'}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-purple-400 rounded-full" />
                                <span className="text-white/90 text-sm font-semibold">
                                    {types.reduce((acc, type) => acc + (type.fichiers?.length || 0), 0)} documents
                                </span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Type Rubriques Grid */}
                <div>
                    <motion.h2
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2"
                    >
                        <div className="w-1 h-6 bg-gradient-to-b from-blue-600 to-blue-400 rounded-full" />
                        {searchQuery ? `Résultats de recherche (${filteredTypes.length})` : 'Toutes les catégories'}
                    </motion.h2>

                    {filteredTypes.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
                            {filteredTypes.map((type, index) => (
                                <TypeRubriqueCard
                                    key={type.idTypeRubrique}
                                    typeRubrique={type}
                                    rubriqueId={rubrique.idRubrique}
                                    index={index}
                                />
                            ))}
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200 shadow-sm"
                        >
                            <Layers size={64} className="mx-auto text-slate-300 mb-4" strokeWidth={1.5} />
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">
                                {searchQuery ? 'Aucun résultat' : 'Aucune catégorie'}
                            </h3>
                            <p className="text-slate-500 max-w-md mx-auto">
                                {searchQuery
                                    ? 'Aucune catégorie ne correspond à votre recherche.'
                                    : 'Cette rubrique ne contient pas encore de catégories de documents.'}
                            </p>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
};
