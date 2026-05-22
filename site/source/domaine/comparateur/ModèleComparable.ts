import { Montant, MontantRécurrent } from '../Montant'
import { DottedName } from '../publicodes/DottedName'
import { Quantité } from '../Quantité'
import { NomModèle } from '../SimulationConfig'

interface Modele {
	nom: NomModèle
}

export interface ValeurDocumentée {
	documentationRule: DottedName
}

export type MontantDocumenté = Montant & ValeurDocumentée
export type QuantitéDocumentée = Quantité & ValeurDocumentée

type ParamQuestionCommuns = {
	label: string
	type: string
}

export type QuestionType = {
	'nature-activité': ParamQuestionCommuns & {
		réponses: readonly [
			'artisanale',
			'commerciale',
			'libérale',
			'location de meublé',
		]
	}
	'méthode-imposition': ParamQuestionCommuns & {
		réponses: readonly ['barème', 'taux']
	}
}

const Questions = {
	'nature-activité': {
		label: 'Quelle est la nature de votre activité ?',
		type: 'une possibilité',
		réponses: [
			'artisanale',
			'commerciale',
			'libérale',
			'location de meublé',
		] as const,
	},
	'méthode-imposition': {
		label: 'Quelle est la nature de votre activité ?',
		type: 'une possibilité',
		réponses: ['barème', 'taux'] as const,
	},
} as const satisfies QuestionType

export type Question = keyof typeof Questions
export type Réponse<T extends Question> =
	(typeof Questions)[T]['réponses'][number]

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
