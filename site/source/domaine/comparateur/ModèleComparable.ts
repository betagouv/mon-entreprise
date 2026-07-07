import { Montant, MontantRécurrent } from '../Montant'
import { DottedName } from '../publicodes/DottedName'
import { Quantité } from '../Quantité'
import { NomModèle } from '../SimulationConfig'
import { Question, Réponse } from './situation'

interface Modele {
	nom: NomModèle
}

export interface ValeurDocumentée {
	documentationRule: DottedName
}

export type MontantDocumenté = Montant & ValeurDocumentée
export type QuantitéDocumentée = Quantité & ValeurDocumentée

const Questions = {
	'activité-nature': {
		label: 'Quelle est la nature de votre activité ?',
		type: 'une possibilité',
		réponses: ['Artisanale', 'Commerciale', 'Libérale'] as const,
	},
	'activité-type': {
		label: 'Quel est le type d’activité principale de l’entreprise ?',
		type: 'une possibilité',
		réponses: [
			'Vente de biens, restauration ou hébergement',
			'Prestation de service',
		] as const,
	},
	'activité-réglementée': {
		label: 'Est-ce une activité libérale réglementée ?',
		type: 'oui non',
	},
	'impôt-méthode': {
		label: 'Comment souhaitez-vous calculer l’impôt sur le revenu ?',
		type: 'une possibilité',
		réponses: ['Avec un taux personnalisé', 'Avec le barème standard'] as const,
	},
	'impôt-taux': {
		label: 'Quel est votre taux de prélèvement à la source ?',
		type: 'pourcentage',
	},
	'impôt-situation-familiale': {
		label: 'Quelle est votre situation familiale ?',
		type: 'une possibilité',
		réponses: [
			'Célibataire / Divorcé(e) / Union libre',
			'Marié(e)s / Pacsé(e)s',
			'Veuf(ve)',
		] as const,
	},
	'impôt-autres-revenus': {
		label:
			'Quel est le montant total des autres revenus imposables du foyer fiscal ?',
		type: 'montant',
	},
	'impôt-enfants': {
		label: 'Combien d’enfants sont à charge du foyer fiscal ?',
		type: 'quantité',
	},
	'entreprise-tva': {
		label: 'L’entreprise est-elle assujettie à la TVA ?',
		type: 'oui non',
	},
} as const

export interface ModèleComparable extends Modele {
	set: {
		chiffreDAffaires: (montant: MontantRécurrent) => void
		charges: (montant: MontantRécurrent) => void
		réponse: (
			...args: {
				[K in Question]: [question: K, valeur: Réponse<K>]
			}[Question]
		) => void
	}

	get: {
		revenuNetAprèsImpôt: () => MontantDocumenté
		retraite: () => ValeurDocumentée & {
			trimestres: QuantitéDocumentée
			revenuCotisé: MontantDocumenté
			pointsComplémentaire: QuantitéDocumentée
		}
		maladie: () => ValeurDocumentée & {
			indemnitésArrêtMaladie: MontantDocumenté
			indemnitésATMP?: MontantDocumenté
			allocationNaissance: MontantDocumenté
			allocationAdoption: MontantDocumenté
		}
		invalidité: () => ValeurDocumentée & {
			pensionInvaliditéPartielle: MontantDocumenté
			pensionInvaliditéTotale: MontantDocumenté
			renteIncapacitéATMP?: MontantDocumenté
		}
		décès: () => ValeurDocumentée & {
			pensionDeRéversion: MontantDocumenté
			capitalDécès: MontantDocumenté
			capitalOrphelin?: MontantDocumenté
			renteDécèsATMP?: MontantDocumenté
		}
	}
}
