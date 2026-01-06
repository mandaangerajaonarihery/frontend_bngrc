import { createPortal } from 'react-dom';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Loader2, User as UserIcon, Camera, Mail, Shield, Lock } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface ProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const ProfileModal = ({ isOpen, onClose }: ProfileModalProps) => {
    const { user, updateProfile } = useAuth();

    // Form states
    const [pseudo, setPseudo] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Initialize state when user loads or modal opens
    useEffect(() => {
        if (user) {
            setPseudo(user.pseudo);
            setEmail(user.email);
            setPreviewUrl(user.avatar || null);
        }
    }, [user, isOpen]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Create a temporary preview URL
            const objectUrl = URL.createObjectURL(file);
            setPreviewUrl(objectUrl);
        }
    };

    const handleTriggerFileSelect = () => {
        fileInputRef.current?.click();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        try {
            setIsSaving(true);

            // Validate passwords if provided
            if (password || confirmPassword) {
                if (password !== confirmPassword) {
                    alert("Les mots de passe ne correspondent pas");
                    setIsSaving(false);
                    return;
                }
            }

            // Get the file if one was selected
            const file = fileInputRef.current?.files?.[0];

            // Call updateProfile from context
            const updateData: { pseudo: string; motDePasse?: string } = { pseudo };
            if (password) {
                updateData.motDePasse = password;
            }

            await updateProfile(updateData, file);

            // Clear passwords
            setPassword('');
            setConfirmPassword('');

            onClose();
        } catch (error) {
            console.error('Error updating profile:', error);
        } finally {
            setIsSaving(false);
        }
    };

    if (!user) return null;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center" style={{ padding: '16px' }}>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden z-10"
                    >
                        {/* Header */}
                        <div className="border-b border-slate-100 flex items-center justify-between bg-slate-50/50" style={{ padding: '16px 24px' }}>
                            <div className="flex items-center gap-3">
                                <div className="bg-blue-100 text-blue-600 rounded-xl" style={{ padding: '8px' }}>
                                    <UserIcon size={20} />
                                </div>
                                <h3 className="text-lg font-bold text-slate-800">Mon Profil</h3>
                            </div>
                            <button
                                onClick={onClose}
                                className="hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-600 transition-colors"
                                style={{ padding: '8px' }}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6" style={{ padding: '24px' }}>
                            {/* Avatar Section */}
                            <div className="flex flex-col items-center justify-center gap-4">
                                <div className="relative group cursor-pointer" onClick={handleTriggerFileSelect}>
                                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-slate-100 shadow-md">
                                        {previewUrl ? (
                                            <img
                                                src={previewUrl}
                                                alt="Profile"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400">
                                                <UserIcon size={40} />
                                            </div>
                                        )}
                                    </div>

                                    {/* Overlay on hover */}
                                    <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                        <Camera className="text-white" size={24} />
                                    </div>

                                    {/* Badge if using file input */}
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleFileChange}
                                    />
                                </div>
                                <p className="text-sm text-slate-500 font-medium">Cliquez pour changer votre photo</p>
                            </div>

                            <div className="space-y-4">
                                {/* Pseudo Input */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-md font-semibold text-slate-600 ml-1" style={{ marginLeft: '4px' }}>Pseudo</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={pseudo}
                                            onChange={(e) => setPseudo(e.target.value)}
                                            className="w-full rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium text-slate-800"
                                            style={{ padding: '10px 10px 10px 32px' }}
                                            placeholder="Votre pseudo"
                                            required
                                        />
                                        <UserIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                    </div>
                                </div>

                                {/* Password Section */}
                                <div className="space-y-4 border-t border-slate-100" style={{ paddingTop: '16px' }}>
                                    <h4 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                        <Lock size={18} className="text-blue-500" />
                                        Sécurité
                                    </h4>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-2">
                                            <label className="text-md font-semibold text-slate-600 ml-1">Nouveau mot de passe</label>
                                            <div className="relative">
                                                <input
                                                    type="password"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    className="w-full rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium text-slate-800"
                                                    placeholder="••••••••"
                                                    style={{ padding: '10px 16px 10px' }}
                                                />
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            <label className="text-md font-semibold text-slate-600 ml-1">Confirmer</label>
                                            <div className="relative">
                                                <input
                                                    type="password"
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    className={`w-full  rounded-xl border ${password && confirmPassword && password !== confirmPassword
                                                        ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                                                        : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500/10'
                                                        } outline-none transition-all font-medium text-slate-800`}
                                                    placeholder="••••••••"
                                                    style={{ padding: '10px 16px 10px' }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-[12px] text-slate-500" style={{ marginLeft: '4px' }}>Laissez vide si vous ne souhaitez pas modifier votre mot de passe.</p>
                                </div>


                                {/* Email Input (Read Only) */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-md font-semibold text-slate-600" style={{ marginLeft: '4px' }}>Email</label>
                                    <div className="relative">
                                        <input
                                            type="email"
                                            value={email}
                                            disabled
                                            className="w-full pl-4 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 font-medium cursor-not-allowed"
                                            style={{ padding: '10px 10px 10px 32px' }}
                                        />
                                        <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                    </div>
                                </div>

                                {/* Role (Read Only) */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-md font-semibold text-slate-600" style={{ marginLeft: '4px' }}>Rôle</label>
                                    <div className="relative">
                                        <div className="w-full  rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between" style={{ padding: '10px 10px 10px 32px' }}>
                                            <span className="font-medium text-slate-700">{user.role}</span>

                                        </div>
                                        <Shield size={18} className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100" style={{ margin: "16px", paddingTop: "16px" }}>
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="text-slate-600 font-semibold hover:bg-slate-100 rounded-xl transition-colors"
                                    style={{ padding: '10px 20px', backgroundColor: '#e7e3e3ff' }}
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="flex items-center gap-2 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-600/20 active:scale-95"
                                    style={{ padding: '10px 20px', backgroundColor: '#f1a247ff' }}
                                >
                                    {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                                    Enregistrer
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
};
