export interface Fichier {
    idFichier: string;
    nomFichier: string;
    typeFichier: string;
    tailleFichier: number;
    cheminFichier: string;
    dateCreation?: string;
    dateModification?: string;
}

export interface TypeRubrique {
    idTypeRubrique: string;
    nomTypeRubrique: string;
    rubrique?: Rubrique;
    fichiers?: Fichier[];
    dateCreation?: string;
    dateModification?: string;
    icon?: string; // For dynamic icon selection
}

export interface Rubrique {
    idRubrique: string;
    libelle: string;
    description: string;
    typeRubriques?: TypeRubrique[];
    // Frontend only fields (mapped manually)
    icon?: string;
}
