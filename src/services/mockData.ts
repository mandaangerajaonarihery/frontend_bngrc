import type { Rubrique } from '../types';

export const MOCK_DATA: Rubrique[] = [
    {
        idRubrique: '1',
        libelle: 'Ressources Humaines',
        description: 'Gestion du personnel, contrats et formations.',
        icon: 'Users',
        typeRubriques: [
            {
                idTypeRubrique: '1-1',
                nomTypeRubrique: 'Contrats',
                fichiers: [
                    { idFichier: 'f1', nomFichier: 'Contrat CDI Type.pdf', cheminFichier: '#', typeFichier: 'pdf', tailleFichier: 2400000, dateCreation: '2024-01-15' },
                    { idFichier: 'f2', nomFichier: 'Fiche de Poste.docx', cheminFichier: '#', typeFichier: 'docx', tailleFichier: 1100000, dateCreation: '2024-02-01' },
                ]
            },
            {
                idTypeRubrique: '1-2',
                nomTypeRubrique: 'Formations',
                fichiers: [
                    { idFichier: 'f3', nomFichier: 'Plan de formation 2024.pdf', cheminFichier: '#', typeFichier: 'pdf', tailleFichier: 5600000, dateCreation: '2024-01-10' },
                ]
            }
        ]
    },
    {
        idRubrique: '2',
        libelle: 'Logistique',
        description: 'Gestion des stocks, véhicules et matériel.',
        icon: 'Truck',
        typeRubriques: [
            {
                idTypeRubrique: '2-1',
                nomTypeRubrique: 'Inventaires',
                fichiers: [
                    { idFichier: 'f4', nomFichier: 'Inventaire T1 2024.xls', cheminFichier: '#', typeFichier: 'xls', tailleFichier: 3200000, dateCreation: '2024-03-30' },
                ]
            }
        ]
    },
    {
        idRubrique: '3',
        libelle: 'Finances',
        description: 'Budgets, factures et rapports financiers.',
        icon: 'Briefcase',
        typeRubriques: [
            {
                idTypeRubrique: '3-1',
                nomTypeRubrique: 'Budgets',
                fichiers: [
                    { idFichier: 'f5', nomFichier: 'Budget Prévisionnel.xlsx', cheminFichier: '#', typeFichier: 'xlsx', tailleFichier: 4500000, dateCreation: '2023-12-20' },
                ]
            }
        ]
    },
    {
        idRubrique: '4',
        libelle: 'Juridique',
        description: 'Textes de lois, arrêtés et décisions.',
        icon: 'Scale',
        typeRubriques: [
            {
                idTypeRubrique: '4-1',
                nomTypeRubrique: 'Arrêtés',
                fichiers: [
                    { idFichier: 'f6', nomFichier: 'Arrêté nomination.pdf', cheminFichier: '#', typeFichier: 'pdf', tailleFichier: 1200000, dateCreation: '2024-01-05' },
                ]
            }
        ]
    }
];

export const getRubriques = async (): Promise<Rubrique[]> => {
    return new Promise((resolve) => {
        setTimeout(() => resolve(MOCK_DATA), 800);
    });
};

export const getRubriqueById = async (id: string): Promise<Rubrique | undefined> => {
    return new Promise((resolve) => {
        setTimeout(() => resolve(MOCK_DATA.find(r => r.idRubrique === id)), 500);
    });
};
