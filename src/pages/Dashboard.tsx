import { useEffect, useState } from 'react';
import { getRubriques } from '../services/api';
import type { Rubrique } from '../types';
import { RubriqueCard } from '../components/RubriqueCard';
import { InputWithIcon } from '../components/InputWithIcon';
import { motion } from 'framer-motion';
import { Search, FolderOpen } from 'lucide-react';

export const Dashboard = () => {
    const [rubriques, setRubriques] = useState<Rubrique[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        getRubriques().then(data => {
            setRubriques(data);
            setLoading(false);
        }).catch(err => {
            console.error("Failed to fetch rubriques", err);
            setLoading(false);
        });
    }, []);



    // Filter rubriques based on search query
    const filteredRubriques = rubriques.filter(rubrique =>
        rubrique.libelle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rubrique.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="relative">
                    <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                    <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-b-blue-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }} />
                </div>
            </div>
        );
    }

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

                <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center justify-center text-center gap-14">
                    <div className="flex flex-col items-center">
                        <motion.h1
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl md:text-5xl lg:text-7xl font-black text-white leading-tight tracking-tight text-center mb-8"
                        >
                            Support & Documentation
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto font-medium text-center"
                        >
                            Besoin d'aide ? Consultez nos rubriques les plus fréquemment demandées.
                        </motion.p>
                    </div>

                    {/* Search Bar - Using InputWithIcon Component */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="w-full max-w-2xl mx-auto flex justify-center"
                    >
                        <InputWithIcon
                            icon={Search}
                            iconPosition="left"
                            placeholder="Que recherchez-vous aujourd'hui ?"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </motion.div>
                </div>
            </motion.div>

            {/* Rubriques Grid - Centered Container */}
            <div className="flex-1 w-full bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <motion.h2
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-2xl md:text-3xl font-bold text-slate-900 mb-8"
                    >
                        {searchQuery ? `Résultats de recherche (${filteredRubriques.length})` : 'Quickfind answers'}
                    </motion.h2>

                    {filteredRubriques.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredRubriques.map((rubrique, index) => (
                                <RubriqueCard key={rubrique.idRubrique} rubrique={rubrique} index={index} />
                            ))}
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200 shadow-sm"
                        >
                            <FolderOpen size={64} className="mx-auto text-slate-300 mb-4" strokeWidth={1.5} />
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">
                                {searchQuery ? 'Aucun résultat' : 'Aucune rubrique disponible'}
                            </h3>
                            <p className="text-slate-500 max-w-md mx-auto">
                                {searchQuery
                                    ? 'Aucune rubrique ne correspond à votre recherche.'
                                    : 'Les rubriques de documents apparaîtront ici une fois qu\'elles seront ajoutées.'}
                            </p>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
};
