import type { Rubrique } from '../types';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Link } from 'react-router-dom';

export const RubriqueCard = ({ rubrique, index }: { rubrique: Rubrique; index: number }) => {
    // Dynamic Icon
    const IconComponent = (Icons as any)[rubrique.icon || 'Archive'] || Icons.Archive;

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
                <div className="relative bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-slate-300 transition-all duration-300 h-full flex flex-col items-center text-center" style={{ paddingLeft: '40px', paddingRight: '40px', paddingTop: '20px', paddingBottom: '20px' }}>
                    {/* Icon & Stats Container */}
                    <div className="flex flex-col items-center mb-6 w-full">
                        <motion.div
                            className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center mb-4 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all duration-300 relative"
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                        >
                            <IconComponent size={32} strokeWidth={2} />


                        </motion.div>

                        {/* Detailed Stats Row */}
                        <div className="flex items-center justify-center gap-4 text-xs font-medium text-slate-500 w-full px-4" style={{ marginTop: '10px' }}>
                            <div className="flex items-center gap-1.5 px-2.5 py-1 ">
                                <Icons.FolderTree size={14} className="text-slate-400" />
                                <span>{rubrique.typeRubriques?.length || 0} Types</span>
                            </div>
                            <div className="flex items-center gap-1.5 px-2.5 py-1 ">
                                <Icons.FileText size={14} className="text-slate-400" />
                                <span>{totalDocuments} Docs</span>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 flex flex-col items-center w-full px-4">
                        <div className="h-8 mb-3 flex items-center justify-center w-full">
                            <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-700 transition-colors duration-300 line-clamp-1 text-ellipsis px-2">
                                {rubrique.libelle}
                            </h3>
                        </div>

                        <div className="h-12 mb-4 w-full">
                            <p className="text-slate-600 text-sm leading-relaxed line-clamp-2 text-ellipsis overflow-hidden">
                                {rubrique.description}
                            </p>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

