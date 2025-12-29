import type { Rubrique } from '../types';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { ArrowRight, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

export const RubriqueCard = ({ rubrique, index }: { rubrique: Rubrique; index: number }) => {
    // Dynamic Icon
    const IconComponent = (Icons as any)[rubrique.icon || 'Folder'] || Icons.Folder;

    // Calculate total number of documents
    const totalDocuments = rubrique.typeRubriques?.reduce((acc, type) => acc + (type.fichiers?.length || 0), 0) || 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
        >
            <Link to={`/rubriques/${rubrique.idRubrique}`} className="block group">
                <div className="relative p-8 bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-2xl hover:border-blue-300/50 transition-all duration-300 overflow-hidden h-full flex flex-col">
                    {/* Decorative gradient background */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100/60 via-blue-50/40 to-transparent rounded-bl-[4rem] -mr-8 -mt-8 transition-transform duration-500 group-hover:scale-125 group-hover:rotate-12" />

                    {/* Subtle glow effect on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-600/0 group-hover:from-blue-500/5 group-hover:to-blue-600/5 transition-all duration-500 rounded-2xl" />

                    <div className="relative z-10 flex-1 flex flex-col">
                        {/* Header with icon and badge */}
                        <div className="flex items-start justify-between mb-4">
                            <motion.div
                                className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-50 text-blue-600 flex items-center justify-center group-hover:from-blue-600 group-hover:to-blue-500 group-hover:text-white transition-all duration-300 shadow-md group-hover:shadow-lg group-hover:shadow-blue-500/30 ring-1 ring-blue-200/50 group-hover:ring-blue-400"
                                whileHover={{ rotate: 5, scale: 1.05 }}
                                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                            >
                                <IconComponent size={26} strokeWidth={2.5} />
                            </motion.div>

                            {totalDocuments > 0 && (
                                <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: index * 0.1 + 0.2, type: 'spring', stiffness: 500, damping: 15 }}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-slate-100 to-slate-50 text-slate-700 rounded-full text-xs font-bold shadow-sm border border-slate-200/50"
                                >
                                    <FileText size={12} />
                                    {totalDocuments}
                                </motion.span>
                            )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 flex flex-col">
                            <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-700 transition-colors duration-300 line-clamp-2">
                                {rubrique.libelle}
                            </h3>

                            <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-2 flex-1">
                                {rubrique.description}
                            </p>

                            {/* Action indicator */}
                            <div className="flex items-center gap-2 text-sm font-semibold text-blue-600 opacity-0 transform translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                <span>Voir les documents</span>
                                <motion.div
                                    animate={{ x: [0, 4, 0] }}
                                    transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                                >
                                    <ArrowRight size={16} strokeWidth={3} />
                                </motion.div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom accent line */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-b-2xl" />
                </div>
            </Link>
        </motion.div>
    );
};
