
import { X, Download, FileText, Image as ImageIcon, AlertCircle, FileSpreadsheet, FileType, FileAudio, FileVideo } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Fichier } from '../types';
import { getDownloadUrl, getFileContent } from '../services/api';
import { useEffect, useState } from 'react';
import * as mammoth from 'mammoth';
import * as XLSX from 'xlsx';

interface FileViewerProps {
    file: Fichier | null;
    isOpen: boolean;
    onClose: () => void;
}

export const FileViewer = ({ file, isOpen, onClose }: FileViewerProps) => {
    const [loading, setLoading] = useState(true);
    const [objectUrl, setObjectUrl] = useState<string | null>(null);
    const [docContent, setDocContent] = useState<string | null>(null); // HTML for DOCX
    const [excelContent, setExcelContent] = useState<string | null>(null); // HTML for XLSX
    const [error, setError] = useState(false);

    const downloadUrl = file ? getDownloadUrl(file.idFichier) : '';
    const fileExtension = file?.nomFichier.split('.').pop()?.toLowerCase() || '';

    // Determine file type category safely
    const isImage = ['jpg', 'jpeg', 'png', 'svg', 'webp', 'gif'].includes(fileExtension);
    const isPdf = fileExtension === 'pdf';
    const isDocx = ['docx'].includes(fileExtension);
    const isExcel = ['xlsx', 'xls', 'csv', 'ods'].includes(fileExtension);
    const isAudio = ['mp3', 'wav', 'ogg', 'm4a'].includes(fileExtension);
    const isVideo = ['mp4', 'webm', 'ogg', 'mov', 'avi', 'mkv'].includes(fileExtension);

    useEffect(() => {
        if (isOpen && file) {

            // Fetch file content as Blob
            getFileContent(file.idFichier)
                .then(async (blob) => {
                    const extension = file.nomFichier.split('.').pop()?.toLowerCase() || '';
                    const currentIsImage = ['jpg', 'jpeg', 'png', 'svg', 'webp', 'gif'].includes(extension);
                    const currentIsPdf = extension === 'pdf';
                    const currentIsDocx = ['docx'].includes(extension);
                    const currentIsExcel = ['xlsx', 'xls', 'csv', 'ods'].includes(extension);
                    const currentIsAudio = ['mp3', 'wav', 'ogg', 'm4a'].includes(extension);
                    const currentIsVideo = ['mp4', 'webm', 'ogg', 'mov', 'avi', 'mkv'].includes(extension);

                    if (currentIsImage || currentIsPdf || currentIsAudio || currentIsVideo) {
                        // Ensure the blob has the correct MIME type for playback
                        const typedBlob = new Blob([blob], { type: file.typeFichier });
                        const url = URL.createObjectURL(typedBlob);
                        setObjectUrl(url);
                        setLoading(false);
                    } else if (currentIsDocx) {
                        const arrayBuffer = await blob.arrayBuffer();
                        try {
                            const result = await mammoth.convertToHtml({ arrayBuffer });
                            setDocContent(result.value);
                            setLoading(false);
                        } catch (err) {
                            console.error("Mammoth error:", err);
                            setError(true);
                            setLoading(false);
                        }
                    } else if (currentIsExcel) {
                        const arrayBuffer = await blob.arrayBuffer();
                        try {
                            const workbook = XLSX.read(arrayBuffer, { type: 'array' });
                            const sheetName = workbook.SheetNames[0]; // Display first sheet
                            const worksheet = workbook.Sheets[sheetName];
                            const html = XLSX.utils.sheet_to_html(worksheet, { id: 'excel-table', editable: false });
                            setExcelContent(html);
                            setLoading(false);
                        } catch (err) {
                            console.error("XLSX error:", err);
                            setError(true);
                            setLoading(false);
                        }
                    } else {
                        // Fallback/Unsupported type (like PPTX)
                        setLoading(false);
                    }
                })
                .catch(err => {
                    console.error("Error loading file content:", err);
                    setError(true);
                    setLoading(false);
                });
        }
    }, [isOpen, file?.idFichier]); // Depend only on ID

    // Separate effect for cleaning up objectUrl
    useEffect(() => {
        return () => {
            if (objectUrl) {
                URL.revokeObjectURL(objectUrl);
            }
        };
    }, [objectUrl]);

    // Prevent scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!file) return null;

    // Helper to render icon
    const getFileIcon = () => {
        if (isImage) return <ImageIcon size={20} />;
        if (isPdf) return <FileText size={20} />;
        if (isDocx) return <FileType size={20} />;
        if (isExcel) return <FileSpreadsheet size={20} />;
        if (isAudio) return <FileAudio size={20} />;
        if (isVideo) return <FileVideo size={20} />;
        return <AlertCircle size={20} />;
    };

    // Helper to render color
    const getIconColor = () => {
        if (isImage) return 'bg-purple-50 text-purple-600';
        if (isPdf) return 'bg-red-50 text-red-600';
        if (isDocx) return 'bg-blue-50 text-blue-600';
        if (isExcel) return 'bg-green-50 text-green-600';
        if (isAudio) return 'bg-amber-50 text-amber-600';
        if (isVideo) return 'bg-rose-50 text-rose-600';
        return 'bg-slate-50 text-slate-600';
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-50"
                        onClick={onClose}
                    />

                    {/* Modal Container */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.3, type: 'spring', damping: 25, stiffness: 300 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pointer-events-none"
                    >
                        <div className="bg-white w-full max-w-7xl h-[85vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col pointer-events-auto border border-slate-200">

                            {/* Header */}
                            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <div className={`p-2 rounded-lg ${getIconColor()}`}>
                                        {getFileIcon()}
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="font-bold text-slate-900 truncate text-lg">{file.nomFichier}</h3>
                                        <p className="text-xs text-slate-500 font-medium">{file.typeFichier} • {file.tailleFichier ? (file.tailleFichier / (1024 * 1024)).toFixed(2) + ' MB' : ''}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 pl-4">
                                    <a
                                        href={downloadUrl}
                                        className="p-2.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors hidden sm:flex"
                                        title="Télécharger"
                                        download
                                    >
                                        <Download size={20} />
                                    </a>
                                    <button
                                        onClick={onClose}
                                        className="p-2.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                            </div>

                            {/* Content Viewer */}
                            <div className="flex-1 bg-slate-50 relative overflow-hidden flex items-center justify-center">
                                {loading && (
                                    <div className="absolute inset-0 flex items-center justify-center z-10 bg-slate-50/80 backdrop-blur-sm">
                                        <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
                                    </div>
                                )}

                                <div className="w-full h-full overflow-auto p-4 sm:p-8 flex items-center justify-center bg-slate-50">
                                    {isImage && objectUrl ? (
                                        <img
                                            src={objectUrl}
                                            alt={file.nomFichier}
                                            className="max-w-full max-h-full object-contain mx-auto transition-opacity duration-300 shadow-sm"
                                            onError={() => { setError(true); setLoading(false); }}
                                        />
                                    ) : isPdf && objectUrl ? (
                                        <iframe
                                            src={objectUrl}
                                            className="w-full h-full border-0 rounded-xl shadow-sm bg-white"
                                            title={file.nomFichier}
                                        />
                                    ) : isDocx && docContent ? (
                                        <div
                                            className="prose prose-slate max-w-none bg-white p-8 rounded-xl shadow-sm min-h-full w-full"
                                            dangerouslySetInnerHTML={{ __html: docContent }}
                                        />
                                    ) : isExcel && excelContent ? (
                                        <div
                                            className="overflow-auto bg-white p-4 rounded-xl shadow-sm min-h-full w-full"
                                        >
                                            <style>{`
                                                table { border-collapse: collapse; width: 100%; font-size: 14px; }
                                                th, td { border: 1px solid #e2e8f0; padding: 8px 12px; text-align: left; }
                                                th { bg-slate-50; font-weight: 600; color: #475569; }
                                                tr:nth-child(even) { background-color: #f8fafc; }
                                                tr:hover { background-color: #f1f5f9; }
                                            `}</style>
                                            <div dangerouslySetInnerHTML={{ __html: excelContent }} />
                                        </div>
                                    ) : isAudio && objectUrl ? (
                                        <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100/50 w-full max-w-md">
                                            <div className="flex justify-center mb-6">
                                                <div className="w-24 h-24 bg-amber-50 rounded-full flex items-center justify-center text-amber-500">
                                                    <FileAudio size={48} strokeWidth={1.5} />
                                                </div>
                                            </div>
                                            <h3 className="text-center font-bold text-slate-900 mb-6 truncate">{file.nomFichier}</h3>
                                            <audio
                                                controls
                                                className="w-full"
                                                src={objectUrl}
                                                onError={() => { setError(true); setLoading(false); }}
                                            />
                                        </div>
                                    ) : isVideo && objectUrl ? (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <video
                                                controls
                                                className="max-w-full max-h-full rounded-xl shadow-lg"
                                                src={objectUrl}
                                                onError={() => { setError(true); setLoading(false); }}
                                            />
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-full">
                                            <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mb-6 text-slate-400">
                                                <AlertCircle size={40} />
                                            </div>
                                            <h4 className="text-xl font-bold text-slate-900 mb-2">
                                                {error ? "Erreur de chargement" : "Aperçu non disponible"}
                                            </h4>
                                            <p className="text-slate-500 mb-8 max-w-md text-center">
                                                {error
                                                    ? "Le fichier n'a pas pu être chargé ou son format est incorrect."
                                                    : "Ce type de fichier ne peut pas être visualisé directement. Veuillez le télécharger pour le consulter."
                                                }
                                            </p>
                                            <a
                                                href={downloadUrl}
                                                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
                                                onClick={onClose}
                                                download
                                            >
                                                <Download size={18} />
                                                Télécharger le fichier
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
