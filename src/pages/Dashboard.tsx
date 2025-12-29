import { useEffect, useState } from 'react';
import { getRubriques } from '../services/api';
import type { Rubrique } from '../types';
import { RubriqueCard } from '../components/RubriqueCard';
import { motion } from 'framer-motion';
import { Sparkles, FolderOpen } from 'lucide-react';

export const Dashboard = () => {
    const [rubriques, setRubriques] = useState<Rubrique[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getRubriques().then(data => {
            setRubriques(data);
            setLoading(false);
        }).catch(err => {
            console.error("Failed to fetch rubriques", err);
            setLoading(false);
        });
    }, []);

    // Calculate statistics
    const totalDocuments = rubriques.reduce((acc, rubrique) =>
        acc + (rubrique.typeRubriques?.reduce((typeAcc, type) => typeAcc + (type.fichiers?.length || 0), 0) || 0), 0
    );

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

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="relative">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="flex items-center gap-3 mb-3">
                        <motion.div
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                        >
                            <Sparkles className="text-blue-600" size={28} strokeWidth={2.5} />
                        </motion.div>
                        <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-slate-900 via-slate-800 to-slate-600 bg-clip-text text-transparent leading-tight">
                            Espace Documentaire
                        </h1>
                    </div>

                    <p className="text-slate-600 text-base md:text-lg max-w-3xl leading-relaxed">
                        Accédez à tous les documents officiels et procédures du <span className="font-semibold text-slate-800">BNGRC MENABE</span>.
                    </p>
                </motion.div>

                {/* Statistics Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="grid grid-cols-2 gap-4 mt-8"
                >
                    <div className="p-6 md:p-8 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-3xl border border-blue-200/50 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-blue-600 rounded-xl shadow-lg shadow-blue-600/30">
                                <FolderOpen size={20} className="text-white" strokeWidth={2.5} />
                            </div>
                            <div>
                                <p className="text-2xl font-black text-blue-900">{rubriques.length}</p>
                                <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide">Rubriques</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 md:p-8 bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-3xl border border-slate-200/50 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-slate-700 rounded-xl shadow-lg shadow-slate-700/30">
                                <Sparkles size={20} className="text-white" strokeWidth={2.5} />
                            </div>
                            <div>
                                <p className="text-2xl font-black text-slate-900">{totalDocuments}</p>
                                <p className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Documents</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Rubriques Grid */}
            <div>
                <motion.h2
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2"
                >
                    <div className="w-1 h-6 bg-gradient-to-b from-blue-600 to-blue-400 rounded-full" />
                    Toutes les rubriques
                </motion.h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
                    {rubriques.map((rubrique, index) => (
                        <RubriqueCard key={rubrique.idRubrique} rubrique={rubrique} index={index} />
                    ))}
                </div>
            </div>

            {/* Empty state (if no rubriques) */}
            {rubriques.length === 0 && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200 shadow-sm"
                >
                    <FolderOpen size={64} className="mx-auto text-slate-300 mb-4" strokeWidth={1.5} />
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Aucune rubrique disponible</h3>
                    <p className="text-slate-500 max-w-md mx-auto">
                        Les rubriques de documents apparaîtront ici une fois qu'elles seront ajoutées.
                    </p>
                </motion.div>
            )}
        </div>
    );
};
