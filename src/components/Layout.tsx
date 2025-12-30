import { Outlet } from 'react-router-dom';

/**
 * Composant Layout Principal (Client)
 * 
 * Ce composant sert de conteneur global pour toutes les pages de la partie client.
 * Il ne retient plus aucune contrainte de marge ou de padding pour permettre aux pages
 * de gérer elles-mêmes leur mise en page (ex: Hero section en pleine largeur).
 */
export const Layout = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <main>
                <Outlet />
            </main>
        </div>
    );
};