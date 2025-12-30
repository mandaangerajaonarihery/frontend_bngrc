import type { Rubrique } from '../types';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
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
            transition={{ delay: index * 0.05, duration: 0.3 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
        >
            <Link to={`/rubriques/${rubrique.idRubrique}`} className="block group">
                <div className="relative p-8 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-slate-300 transition-all duration-300 h-full flex flex-col items-center text-center">
                    {/* Icon */}
                    <motion.div
                        className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center mb-5 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all duration-300"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                    >
                        <IconComponent size={32} strokeWidth={2} />
                    </motion.div>

                    {/* Content */}
                    <div className="flex-1 flex flex-col items-center">
                        <h3 className="text-lg font-bold text-slate-900 mb-3 group-hover:text-blue-700 transition-colors duration-300">
                            {rubrique.libelle}
                        </h3>

                        <p className="text-slate-600 text-sm leading-relaxed line-clamp-3 mb-4">
                            {rubrique.description}
                        </p>

                        {/* Document count badge */}
                        {totalDocuments > 0 && (
                            <div className="mt-auto pt-2">
                                <span className="inline-flex items-center px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-semibold group-hover:bg-blue-100 group-hover:text-blue-700 transition-colors duration-300">
                                    {totalDocuments} {totalDocuments > 1 ? 'documents' : 'document'}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

