import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import { motion } from 'framer-motion';
import { UserPlus, Mail, Lock, User, AlertCircle, Camera, Upload } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { UserRole } from '../types/authTypes';
import type { RegisterCredentials } from '../types/authTypes';


// Register component
export const Register: React.FC = () => {
    const { register, isAuthenticated, isLoading, user } = useAuth();
    const [formData, setFormData] = useState<RegisterCredentials>({
        pseudo: '',
        email: '',
        password: '',
        confirmPassword: '',
        avatar: null,
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    // Redirect if already authenticated
    if (isAuthenticated && !isLoading && user) {
        if (user.role === UserRole.ADMIN) {
            return <Navigate to="/admin" replace />;
        }
        return <Navigate to="/" replace />;
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFormData({
                ...formData,
                avatar: file,
            });

            // Create preview URL
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
            setError('Les mots de passe ne correspondent pas');
            return;
        }

        // Validate password length
        if (formData.password.length < 6) {
            setError('Le mot de passe doit contenir au moins 6 caractères');
            return;
        }

        setLoading(true);

        try {
            await register(formData);
        } catch (err: unknown) {
            const error = err as AxiosError<{ message: string }>;
            setError(error.response?.data?.message || 'Échec de l\'inscription');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4" style={{ padding: "32px 0" }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                {/* Logo/Header */}
                <div className="text-center" style={{ marginBottom: "24px" }}>
                    <motion.div
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-400"
                        style={{ marginBottom: "16px" }}
                    >
                        <UserPlus className="w-8 h-8 text-slate-900" />
                    </motion.div>
                    <h1 className="text-3xl font-bold text-white" style={{ marginBottom: "8px" }}>Inscription</h1>
                    <p className="text-slate-400" style={{ marginBottom: "16px" }}>Créez votre compte BNGRC</p>
                </div>

                {/* Register Form */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50  shadow-2xl"
                    style={{ padding: "32px" }}
                >
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Error Message */}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center gap-3 rounded-xl bg-red-500/10 border border-red-500/20"
                                style={{ padding: "16px" }}
                            >
                                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                                <p className="text-red-400 text-sm">{error}</p>
                            </motion.div>
                        )}

                        {/* Avatar Upload */}
                        <div className="flex justify-center" style={{ marginBottom: "24px" }}>
                            <div className="relative group cursor-pointer">
                                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-slate-600 group-hover:border-emerald-400 transition-colors bg-slate-900/50 flex items-center justify-center">
                                    {previewUrl ? (
                                        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <Camera className="w-8 h-8 text-slate-400 group-hover:text-emerald-400 transition-colors" />
                                    )}
                                </div>
                                <div className="absolute bottom-0 right-0 bg-blue-400 rounded-full text-slate-900 group-hover:bg-blue-300 transition-colors" style={{ padding: "6px" }}>
                                    <Upload className="w-4 h-4" />
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                            </div>
                        </div>

                        {/* Pseudo Field */}
                        <div>
                            <label htmlFor="pseudo" className="block text-lg font-medium text-slate-300" style={{ marginBottom: "8px" }}>
                                Pseudo
                            </label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    id="pseudo"
                                    name="pseudo"
                                    type="text"
                                    value={formData.pseudo}
                                    onChange={handleChange}
                                    required
                                    className="w-full  bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none transition-all"
                                    style={{ padding: "16px 16px 16px 48px" }}
                                    placeholder="Votre pseudo"
                                />
                            </div>
                        </div>

                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-lg font-medium text-slate-300" style={{ marginBottom: "8px" }}>
                                Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full  bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none transition-all"
                                    style={{ padding: "16px 16px 16px 48px" }}
                                    placeholder="votre@email.com"
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-lg font-medium text-slate-300" style={{ marginBottom: "8px" }}>
                                Mot de passe
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    minLength={6}
                                    className="w-full  bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none transition-all"
                                    style={{ padding: "16px 16px 16px 48px" }}
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {/* Confirm Password Field */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-lg font-medium text-slate-300" style={{ marginBottom: "8px" }}>
                                Confirmer le mot de passe
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                    minLength={6}
                                    className="w-full  bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none transition-all"
                                    style={{ padding: "16px 16px 16px 48px" }}
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-xl bg-gradient-to-r from-blue-400 to-cyan-400 text-white font-semibold hover:from-blue-500 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-400/20"
                            style={{ padding: "12px 24px", margin: "16px 0", backgroundColor: "#1e40af" }}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="w-5 h-5 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin"></div>
                                    Inscription...
                                </span>
                            ) : (
                                'S\'inscrire'
                            )}
                        </button>
                    </form>

                    {/* Login Link */}
                    <div className="mt-6 text-center">
                        <p className="text-slate-400 text-sm">
                            Vous avez déjà un compte ?{' '}
                            <Link
                                to="/login"
                                className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
                            >
                                Se connecter
                            </Link>
                        </p>
                    </div>
                </motion.div>

                {/* Footer */}
                <p className="text-center text-slate-500 text-sm mt-8">
                    © 2026 BNGRC Menabe. Tous droits réservés.
                </p>
            </motion.div>
        </div>
    );
};
