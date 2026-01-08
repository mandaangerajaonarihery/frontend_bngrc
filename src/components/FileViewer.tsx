import { X, Download, FileText, Image as ImageIcon, AlertCircle, FileSpreadsheet } from 'lucide-react';
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
    const [docContent, setDocContent] = useState<string | null>(null);
    const [excelContent, setExcelContent] = useState<string | null>(null);

    // 🚀 Téléchargement direct Cloudinary avec forçage (fl_attachment)
    const downloadUrl = file 
        ? file.cheminFichier.replace('/upload/', '/upload/fl_attachment/') 
        : '';

    const fileExtension = file?.nomFichier.split('.').pop()?.toLowerCase() || '';
    const isImage = ['jpg', 'jpeg', 'png', 'svg', 'webp', 'gif'].includes(fileExtension);
    const isPdf = fileExtension === 'pdf';
    const isOffice = ['docx', 'doc', 'xlsx', 'xls', 'pptx', 'ppt'].includes(fileExtension);

    const googleViewerUrl = file 
        ? `https://docs.google.com/viewer?url=${encodeURIComponent(file.cheminFichier)}&embedded=true` 
        : '';

    useEffect(() => {
        if (isOpen && file) {
            setLoading(true);
            setDocContent(null);
            setExcelContent(null);

            if (isImage || isPdf) {
                setLoading(false);
            } 
            else if (isOffice) {
                if (['docx', 'doc'].includes(fileExtension)) {
                    getFileContent(file.idFichier)
                        .then(async (blob) => {
                            const arrayBuffer = await blob.arrayBuffer();
                            const result = await mammoth.convertToHtml({ arrayBuffer });
                            setDocContent(result.value);
                            setLoading(false);
                        })
                        .catch(() => setLoading(false));
                } 
                else if (['xlsx', 'xls'].includes(fileExtension)) {
                    getFileContent(file.idFichier)
                        .then(async (blob) => {
                            const arrayBuffer = await blob.arrayBuffer();
                            const workbook = XLSX.read(arrayBuffer, { type: 'array' });
                            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
                            const html = XLSX.utils.sheet_to_html(worksheet, { id: 'excel-table' });
                            setExcelContent(html);
                            setLoading(false);
                        })
                        .catch(() => setLoading(false));
                } else {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        }
    }, [isOpen, file, fileExtension, isOffice, isImage, isPdf]);

    if (!file) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop : Flou et opacité ajustés pour l'UX */}
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60]" 
                        onClick={onClose} 
                    />

                    <motion.div 
                        initial={{ opacity: 0, scale: 0.98, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98, y: 10 }}
                        className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6 pointer-events-none"
                    >
                        {/* Conteneur principal : Arrondi 2xl pour un look moderne et pro */}
                        <div className="bg-white w-full max-w-7xl h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col pointer-events-auto border border-slate-200">
                            
                            {/* Header : Clair et espacé */}
                            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
                                <div className="flex items-center gap-4">
                                    <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                                        {isPdf ? <FileText size={22} className="text-red-500" /> : isImage ? <ImageIcon size={22} className="text-blue-500" /> : <FileSpreadsheet size={22} className="text-emerald-500" />}
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="font-semibold text-slate-800 truncate text-lg">{file.nomFichier}</h3>
                                        <p className="text-xs text-slate-400 font-medium tracking-wide uppercase">
                                            {fileExtension} • {(file.tailleFichier / (1024 * 1024)).toFixed(2)} MB
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <a 
                                        href={downloadUrl} 
                                        download={file.nomFichier}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-200" 
                                        title="Télécharger"
                                    >
                                        <Download size={18} />
                                        <span className="hidden sm:inline">Télécharger</span>
                                    </a>
                                    <button 
                                        onClick={onClose} 
                                        className="p-2 text-slate-400 hover:bg-red-50 hover:text-red-500 rounded-lg transition-all"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                            </div>

                            {/* Viewer Content : Fond contrasté pour faire ressortir le document */}
                            <div className="flex-1 bg-slate-100/50 relative overflow-hidden flex items-center justify-center p-4 sm:p-6">
                                {loading && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
                                        <div className="w-8 h-8 border-[3px] border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                )}

                                <div className="w-full h-full flex items-center justify-center overflow-auto">
                                    {/* Images : Arrondi xl */}
                                    {isImage && (
                                        <img src={file.cheminFichier} alt="Preview" className="max-w-full max-h-full object-contain shadow-md rounded-xl border border-white" />
                                    )}

                                    {/* PDF : Arrondi xl */}
                                    {isPdf && (
                                        <iframe 
                                            src={`${file.cheminFichier}#toolbar=0`} 
                                            className="w-full h-full rounded-xl border border-slate-200 bg-white shadow-sm" 
                                            title="PDF Preview" 
                                        />
                                    )}

                                    {/* Word / Excel : Conteneur blanc avec arrondi xl */}
                                    {isOffice && (docContent || excelContent) && (
                                        <div className="bg-white p-8 sm:p-12 shadow-sm prose prose-slate max-w-4xl w-full rounded-xl border border-slate-200 overflow-auto h-full">
                                            {docContent && <div dangerouslySetInnerHTML={{ __html: docContent }} />}
                                            {excelContent && (
                                                <div className="overflow-x-auto">
                                                    <style>{`table { border-collapse: collapse; width: 100%; border: 1px solid #E2E8F0; } td, th { border: 1px solid #E2E8F0; padding: 12px; text-align: left; } th { background: #F8FAFC; font-weight: 600; }`}</style>
                                                    <div dangerouslySetInnerHTML={{ __html: excelContent }} />
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Fallback Google Viewer : Arrondi xl */}
                                    {isOffice && !docContent && !excelContent && !loading && (
                                        <iframe 
                                            src={googleViewerUrl} 
                                            className="w-full h-full rounded-xl border border-slate-200 bg-white" 
                                            title="Office Preview" 
                                        />
                                    )}

                                    {/* Format non supporté */}
                                    {!loading && !isImage && !isPdf && !isOffice && (
                                        <div className="text-center p-12 bg-white rounded-2xl shadow-sm border border-slate-200 max-w-md">
                                            <AlertCircle size={48} className="mx-auto text-slate-300 mb-4" />
                                            <h4 className="text-lg font-bold text-slate-900 mb-2">Aperçu non disponible</h4>
                                            <p className="text-slate-500 mb-8">Le format de ce fichier ne permet pas une prévisualisation directe.</p>
                                            <a 
                                                href={downloadUrl} 
                                                download={file.nomFichier} 
                                                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold flex items-center gap-2 justify-center transition-all shadow-lg shadow-blue-200"
                                            >
                                                <Download size={18} /> Télécharger maintenant
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