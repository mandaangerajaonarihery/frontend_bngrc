import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, AlertTriangle, X } from 'lucide-react';

interface ConfirmLogoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export const ConfirmLogoutModal: React.FC<ConfirmLogoutModalProps> = ({ isOpen, onClose, onConfirm }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" style={{padding: '16px'}}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-sm bg-white border border-slate-700 rounded-3xl shadow-2xl p-8"
                        style={{padding: '24px'}}
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:bg-slate-800 transition-colors"
                            style={{padding: '8px'}}
                        >
                            <X size={20} />
                        </button>

                        <div className="flex flex-col gap-4 items-center text-center ">
                            <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center">
                                <AlertTriangle size={40} className="text-red-500" />
                            </div>

                            <div className="space-y-2">
                                <h2 className="text-2xl font-bold">Déconnexion</h2>
                                <p>
                                    Êtes-vous sûr de vouloir vous déconnecter ? Vous devrez vous reconnecter pour accéder à votre espace.
                                </p>
                            </div>

                            <div className="flex gap-3 w-full">
                                <button
                                    onClick={onClose}
                                    className="flex-1 rounded-xl font-semibold hover:bg-slate-600 transition-colors"
                                    style={{padding: '12px 16px'}}
                                >
                                    Annuler
                                </button>
                                <button
                                    onClick={onConfirm}
                                    className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors shadow-lg shadow-red-900/20"
                                    style={{padding: '12px 16px', backgroundColor: 'red'}}
                                >
                                    <LogOut size={18} />
                                    Confirmer
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
