import { useEffect, useState } from 'react';
import { getRubriques } from '../../services/api';
import type { Rubrique } from '../../types';
import { motion } from 'framer-motion';
import { FolderOpen, FileText, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';
import { UserList } from './components/UserList';

export const AdminDashboard = () => {
    const [rubriques, setRubriques] = useState<Rubrique[]>([]);
    useEffect(() => {
        getRubriques().then(data => {
            setRubriques(data);
        });
    }, []);

    const totalRubriques = rubriques.length;
    const totalTypes = rubriques.reduce((acc, r) => acc + (r.typeRubriques?.length || 0), 0);
    const totalFichiers = rubriques.reduce((acc, r) => acc + (r.typeRubriques?.reduce((tAcc, t) => tAcc + (t.fichiers?.length || 0), 0) || 0), 0);

    const stats = [
        { label: 'Rubriques', value: totalRubriques, icon: FolderOpen, color: 'text-blue-600', bg: 'bg-blue-100' },
        { label: 'Catégories', value: totalTypes, icon: Layers, color: 'text-purple-600', bg: 'bg-purple-100' },
        { label: 'Documents', value: totalFichiers, icon: FileText, color: 'text-green-600', bg: 'bg-green-100' },
    ];

    return (
        <div style={{ padding: '20px' }}>
            <h1 className="text-3xl font-black text-slate-900" style={{ padding: '20px 0 20px 0' }}>Tableau de bord</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200"
                        style={{ padding: '20px' }}
                    >
                        <div className="flex items-center gap-4">
                            <div className={`p-4 rounded-2xl  ${stat.color}`}>
                                <stat.icon size={24} />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-slate-500 uppercase">{stat.label}</p>
                                <p className="text-3xl font-black text-slate-900">{stat.value}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div >
                <div className="flex items-center justify-between" style={{ margin: '20px' }}>
                    <h2 className="text-xl font-bold text-slate-800">Géstion d'utilisateur</h2>
                    <Link to="/admin/rubriques" className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 cursor-pointer transition-all shadow-lg shadow-blue-600/20" style={{ padding: '10px 20px 10px 20px', color: 'white' }}>Gérer les rubriques</Link>
                </div>
                {/* Placeholders for recent activity */}
                <UserList />
            </div>
        </div>
    );
};
