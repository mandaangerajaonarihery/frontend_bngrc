import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import { motion } from 'framer-motion';
import { LogIn, Mail, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { UserRole } from '../types/authTypes';

export const Login: React.FC = () => {
    const { login, isAuthenticated, isLoading, user } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Redirect if already authenticated
    if (isAuthenticated && !isLoading && user) {
        if (user.role === UserRole.ADMIN) {
            return <Navigate to="/admin" replace />;
        }
        return <Navigate to="/" replace />;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login({ email, password });
        } catch (err: unknown) {
            const error = err as AxiosError<{ message: string }>;
            setError(error.response?.data?.message || 'Échec de la connexion');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" style={{ padding: "32px 0" }}>
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
                        <LogIn className="w-8 h-8 text-slate-900" />
                    </motion.div>
                    <h1 className="text-3xl font-bold text-white" style={{ marginBottom: "8px" }}>Connexion</h1>
                    <p className="text-slate-400" style={{ marginBottom: "16px" }}>Accédez à votre compte BNGRC Menabe</p>
                </div>

                {/* Login Form */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl"
                    style={{ padding: "32px" }}
                >
                    <form onSubmit={handleSubmit} className="space-y-6">
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

                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-lg font-medium text-slate-300" style={{ marginBottom: "8px" }}>
                                Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full  bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none transition-all"
                                    style={{ padding: "16px 16px 16px 48px" }}
                                    placeholder="votre@email.com"
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-lg font-medium text-slate-300 mb-2">
                                Mot de passe
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
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
                            className="w-full rounded-xl bg-gradient-to-r from-blue-400 to-blue-400 text-white font-semibold hover:from-blue-500 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-400/20"
                            style={{ padding: "12px 24px", margin: "16px 0", backgroundColor: "#1e40af" }}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="w-5 h-5 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin"></div>
                                    Connexion...
                                </span>
                            ) : (
                                'Se connecter'
                            )}
                        </button>
                    </form>

                    {/* Register Link */}
                    <div className="mt-6 text-center">
                        <p className="text-slate-400 text-sm">
                            Pas encore de compte ?{' '}
                            <Link
                                to="/register"
                                className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
                            >
                                S'inscrire
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
