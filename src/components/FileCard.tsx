import type { Fichier } from '../types';
import { FileText, Download, Calendar, HardDrive, FileSpreadsheet, FileImage, File } from 'lucide-react';
import { motion } from 'framer-motion';
import { getDownloadUrl } from '../services/api';

// Helper function to get icon and color based on file type
const getFileTypeInfo = (type: string) => {
    const lowerType = type.toLowerCase();

    if (lowerType === 'pdf') {
        return { icon: FileText, color: 'from-red-500 to-red-600', bgColor: 'bg-red-50', textColor: 'text-red-600', hoverBg: 'group-hover:bg-red-600' };
    } else if (lowerType === 'docx' || lowerType === 'doc') {
        return { icon: FileText, color: 'from-blue-500 to-blue-600', bgColor: 'bg-blue-50', textColor: 'text-blue-600', hoverBg: 'group-hover:bg-blue-600' };
    } else if (lowerType === 'xlsx' || lowerType === 'xls') {
        return { icon: FileSpreadsheet, color: 'from-green-500 to-green-600', bgColor: 'bg-green-50', textColor: 'text-green-600', hoverBg: 'group-hover:bg-green-600' };
    } else if (lowerType === 'png' || lowerType === 'jpg' || lowerType === 'jpeg' || lowerType === 'svg') {
        return { icon: FileImage, color: 'from-purple-500 to-purple-600', bgColor: 'bg-purple-50', textColor: 'text-purple-600', hoverBg: 'group-hover:bg-purple-600' };
    } else {
        return { icon: File, color: 'from-slate-500 to-slate-600', bgColor: 'bg-slate-50', textColor: 'text-slate-600', hoverBg: 'group-hover:bg-slate-600' };
    }
};

const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const FileCard = ({ fichier, onView }: { fichier: Fichier; onView: (file: Fichier) => void }) => {
    const fileInfo = getFileTypeInfo(fichier.typeFichier);
    const FileIcon = fileInfo.icon;
    const downloadUrl = getDownloadUrl(fichier.idFichier);

    return (
        <motion.div
            className="flex flex-col p-6 md:p-8 bg-white rounded-3xl border border-slate-200/80 hover:border-blue-300/60 hover:shadow-xl transition-all duration-300 group cursor-pointer h-full"
            whileHover={{ y: -4, scale: 1.01 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            onClick={() => onView(fichier)}
        >
            {/* Header with icon and type badge */}
            <div className="flex items-start justify-between mb-4">
                <motion.div
                    className={`p-3 ${fileInfo.bgColor} ${fileInfo.textColor} rounded-xl ${fileInfo.hoverBg} group-hover:text-white transition-all duration-300 shadow-sm group-hover:shadow-md`}
                    whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                >
                    <FileIcon size={22} strokeWidth={2.5} />
                </motion.div>
                <span className={`text-xs font-bold px-3 py-1.5 bg-gradient-to-r ${fileInfo.color} text-white rounded-lg uppercase tracking-wider shadow-sm`}>
                    {fichier.typeFichier}
                </span>
            </div>

            {/* File name */}
            <h4 className="font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-blue-700 transition-colors duration-300 text-base leading-snug flex-1">
                {fichier.nomFichier}
            </h4>

            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-auto pt-4 border-t border-slate-100">
                <span className="flex items-center gap-1.5 font-medium">
                    <Calendar size={14} className="text-slate-400" />
                    <span>{fichier.dateCreation ? new Date(fichier.dateCreation).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}</span>
                </span>
                {fichier.tailleFichier && (
                    <span className="flex items-center gap-1.5 font-medium">
                        <HardDrive size={14} className="text-slate-400" />
                        <span>{formatSize(fichier.tailleFichier)}</span>
                    </span>
                )}
            </div>

            {/* Download button */}
            <motion.a
                href={downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="mt-4 flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-slate-100 to-slate-50 text-slate-700 rounded-xl font-semibold text-sm hover:from-blue-600 hover:to-blue-500 hover:text-white transition-all duration-300 shadow-sm hover:shadow-lg border border-slate-200/50 hover:border-blue-500"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                <Download size={16} strokeWidth={2.5} />
                <span>Télécharger</span>
            </motion.a>
        </motion.div>
    );
};
