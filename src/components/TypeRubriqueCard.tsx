import type { TypeRubrique } from '../types';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface TypeRubriqueCardProps {
    typeRubrique: TypeRubrique;
    rubriqueId: string;
    index: number;
}

export const TypeRubriqueCard = ({ typeRubrique, rubriqueId, index }: TypeRubriqueCardProps) => {
    // Dynamic Icon
    const IconComponent = (Icons as any)[typeRubrique.icon || 'Layers'] || Icons.Layers;

    // Calculate total number of documents
    const totalDocuments = typeRubrique.fichiers?.length || 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08, duration: 0.4 }}
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
        >
            <Link
                to={`/rubriques/${rubriqueId}/types/${typeRubrique.idTypeRubrique}`}
                className="block group"
            >
                <div className="relative p-6 bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-blue-300/60 transition-all duration-300 overflow-hidden h-full flex flex-col">
                    {/* Decorative gradient background */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-100/50 via-blue-50/30 to-transparent rounded-bl-[3rem] -mr-6 -mt-6 transition-transform duration-500 group-hover:scale-125 group-hover:rotate-12" />

                    {/* Subtle glow effect on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-600/0 group-hover:from-blue-500/5 group-hover:to-blue-600/5 transition-all duration-500 rounded-2xl" />

                    <div className="relative z-10 flex-1 flex flex-col">
                        {/* Icon */}
                        <div className="mb-4">
                            <motion.div
                                className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 text-blue-600 flex items-center justify-center group-hover:from-blue-600 group-hover:to-blue-500 group-hover:text-white transition-all duration-300 shadow-md group-hover:shadow-lg group-hover:shadow-blue-500/30"
                                whileHover={{ rotate: 8, scale: 1.08 }}
                                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                            >
                                <IconComponent size={24} strokeWidth={2.5} />
                            </motion.div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 flex flex-col">
                            <h3 className="text-base font-bold text-slate-900 mb-2 group-hover:text-blue-700 transition-colors duration-300 line-clamp-2">
                                {typeRubrique.nomTypeRubrique}
                            </h3>

                            <p className="text-slate-500 text-sm mb-4 flex-1">
                                {totalDocuments} {totalDocuments > 1 ? 'documents' : 'document'}
                            </p>

                            {/* Action indicator */}
                            <div className="flex items-center gap-2 text-sm font-semibold text-blue-600 opacity-0 transform translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                <span>Voir les documents</span>
                                <motion.div
                                    animate={{ x: [0, 4, 0] }}
                                    transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                                >
                                    <ArrowRight size={14} strokeWidth={3} />
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
