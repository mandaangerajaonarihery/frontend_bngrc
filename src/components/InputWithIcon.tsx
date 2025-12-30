import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface InputWithIconProps {
    icon: LucideIcon;
    iconPosition?: 'left' | 'right';
    placeholder?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    className?: string;
    type?: string;
}

/**
 * Composant Input réutilisable avec icône configurable
 * @param icon - Icône de lucide-react à afficher
 * @param iconPosition - Position de l'icône ('left' ou 'right', défaut: 'right')
 * @param placeholder - Texte placeholder de l'input
 * @param value - Valeur contrôlée de l'input
 * @param onChange - Fonction callback pour les changements de valeur
 * @param className - Classes CSS additionnelles pour le conteneur
 * @param type - Type de l'input (défaut: 'text')
 */
export const InputWithIcon: React.FC<InputWithIconProps> = ({
    icon: Icon,
    iconPosition = 'left',
    placeholder = '',
    value,
    onChange,
    className = '',
    type = 'text'
}) => {
    // Calcul du padding en fonction de la position de l'icône
    // Utilisation de styles inline pour garantir l'application du padding
    const paddingStyle = iconPosition === 'left'
        ? { paddingLeft: '64px', paddingRight: '24px', outline: 'none' }
        : { paddingLeft: '24px', paddingRight: '64px', outline: 'none' };

    // Position de l'icône
    const iconPositionClass = iconPosition === 'left' ? 'left-4' : 'right-4';

    return (
        <div className={`relative group w-full ${className}`}>
            {/* Gradient blur effect au hover */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />

            {/* Input container */}
            <div className="relative w-full">
                <input
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    style={paddingStyle}
                    className="w-full h-12 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 
                        focus:outline-none focus:border-none
                        transition-all duration-200 text-lg"
                />

                {/* Icône positionnée */}
                <Icon
                    size={24}
                    className={`absolute ${iconPositionClass} top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors duration-300 pointer-events-none`}
                />
            </div>
        </div>
    );
};
