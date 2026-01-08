import { useState } from 'react';
import type { Fichier } from '../types';
import { 
    FileText, Download, Calendar, HardDrive, FileSpreadsheet, 
    FileImage, File, Eye, PlayCircle, Presentation, Loader2 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { getFileContent } from '../services/api';
import { toast } from 'sonner';

const getNormalizedFileType = (mimeType: string) => {
    const lower = mimeType.toLowerCase();
    if (lower.includes('pdf')) return { label: 'PDF', type: 'pdf' };
    if (lower.includes('word') || lower.includes('doc')) return { label: 'WORD', type: 'doc' };
    if (lower.includes('sheet') || lower.includes('xls') || lower.includes('excel') || lower.includes('csv')) return { label: 'EXCEL', type: 'xls' };
    if (lower.includes('powerpoint') || lower.includes('ppt') || lower.includes('presentation')) return { label: 'PPT', type: 'ppt' };
    if (lower.includes('image') || lower.includes('jpg') || lower.includes('png') || lower.includes('jpeg') || lower.includes('webp')) return { label: 'IMAGE', type: 'image' };
    if (lower.includes('video') || lower.includes('mp4') || lower.includes('mov')) return { label: 'VIDEO', type: 'video' };
    return { label: 'FICHIER', type: 'other' };
};

const getFileTypeStyling = (normalizedType: string) => {
    switch (normalizedType) {
        case 'pdf': return { icon: FileText, color: 'from-red-500 to-red-600', bgColor: 'bg-red-50', textColor: 'text-red-600' };
        case 'doc': return { icon: FileText, color: 'from-blue-500 to-blue-600', bgColor: 'bg-blue-50', textColor: 'text-blue-600' };
        case 'xls': return { icon: FileSpreadsheet, color: 'from-green-500 to-green-600', bgColor: 'bg-green-50', textColor: 'text-green-600' };
        case 'ppt': return { icon: Presentation, color: 'from-orange-500 to-orange-600', bgColor: 'bg-orange-50', textColor: 'text-orange-600' };
        case 'image': return { icon: FileImage, color: 'from-purple-500 to-purple-600', bgColor: 'bg-purple-50', textColor: 'text-purple-600' };
        case 'video': return { icon: PlayCircle, color: 'from-pink-500 to-pink-600', bgColor: 'bg-pink-50', textColor: 'text-pink-600' };
        default: return { icon: File, color: 'from-slate-500 to-slate-600', bgColor: 'bg-slate-50', textColor: 'text-slate-600' };
    }
};

const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const FileCard = ({ fichier, onView }: { fichier: Fichier; onView: (file: Fichier) => void }) => {
    const [isDownloading, setIsDownloading] = useState(false);
    const { label, type } = getNormalizedFileType(fichier.typeFichier);
    const styling = getFileTypeStyling(type);
    const FileIcon = styling.icon;

    // Fonction de téléchargement améliorée utilisant les Blobs pour la sécurité auth
    const handleDownload = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isDownloading) return;

        setIsDownloading(true);
        try {
            const blob = await getFileContent(fichier.idFichier);
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fichier.nomFichier);
            document.body.appendChild(link);
            link.click();
            link.parentNode?.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Download error:", error);
            toast.error("Échec du téléchargement");
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <motion.div
            className="flex flex-col p-8 bg-white rounded-3xl border border-slate-200/80 hover:border-blue-300/60 hover:shadow-xl transition-all duration-300 group cursor-pointer h-full"
            whileHover={{ y: -4, scale: 1.01 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            onClick={() => onView(fichier)}
            style={{ padding: '20px' }}
        >
            <div className="flex items-start justify-between mb-6">
                <motion.div
                    className={`p-3.5 ${styling.bgColor} ${styling.textColor} rounded-2xl `}
                    whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                >
                    <FileIcon size={24} strokeWidth={2.5} />
                </motion.div>
                <span className={`text-[10px] font-bold px-2.5 py-1 bg-gradient-to-r ${styling.color} text-white rounded-lg uppercase tracking-wider shadow-sm opacity-90`} style={{ padding: '5px' }}>
                    {label}
                </span>
            </div>

            <h4 className="font-bold text-slate-900 mb-3 line-clamp-2 group-hover:text-blue-700 transition-colors duration-300 text-base leading-snug flex-1">
                {fichier.nomFichier}
            </h4>

            <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-slate-500 mb-6 pt-4 border-t border-slate-100 w-full">
                <span className="flex items-center gap-1.5 font-medium px-2 py-1 rounded-md">
                    <Calendar size={12} className="text-slate-400" />
                    <span>{fichier.dateCreation ? new Date(fichier.dateCreation).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}</span>
                </span>
                <span className="flex items-center gap-1.5 font-medium px-2 py-1 rounded-md">
                    <HardDrive size={12} className="text-slate-400" />
                    <span>{formatSize(fichier.tailleFichier)}</span>
                </span>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-auto" style={{ padding: '10px 5px 10px 5px' }}>
                <motion.button
                    onClick={(e) => {
                        e.stopPropagation();
                        onView(fichier);
                    }}
                    className="flex items-center justify-center gap-2 py-2.5 bg-white border border-blue-200 text-blue-600 rounded-xl font-bold text-sm hover:bg-blue-50 transition-all duration-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <Eye size={16} strokeWidth={2.5} />
                    <span>Voir</span>
                </motion.button>

                <motion.button
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className="flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-bold text-sm hover:from-green-600 hover:to-green-700 hover:shadow-lg transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                    whileHover={!isDownloading ? { scale: 1.02 } : {}}
                    whileTap={!isDownloading ? { scale: 0.98 } : {}}
                    style={{ padding: '5px 10px 5px 10px' }}
                >
                    {isDownloading ? (
                        <Loader2 size={16} className="animate-spin" />
                    ) : (
                        <Download size={16} strokeWidth={2.5} />
                    )}
                    <span>{isDownloading ? '...' : 'Prendre'}</span>
                </motion.button>
            </div>
        </motion.div>
    );
};