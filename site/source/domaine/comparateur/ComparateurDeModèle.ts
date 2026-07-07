import * as O from 'effect/Option'

import { eurosParAn, MontantRécurrent } from '../Montant'
import { quantité } from '../Quantité'
import { NomModèle } from '../SimulationConfig'
import {
	ModèleComparable,
	MontantDocumenté,
	QuantitéDocumentée,
	ValeurDocumentée,
} from './ModèleComparable'
import { Question, Réponse, SituationComparée } from './situation'

const situationComparée: SituationComparée = {
	_tag: 'Situation',
	_type: 'comparateur',
	chiffreDAffaires: O.some(eurosParAn(48_000)),
	charges: O.some(eurosParAn(12_000)),
	natureActivité: 'commerciale',
	typeActivité: O.some('vente'),
	activitéLibéraleRéglementée: O.none(),
	méthodeImposition: 'barème standard',
	tauxImposition: O.none(),
	situationFamiliale: O.some('célibataire'),
	enfants: O.some(quantité(0, 'enfant')),
	autresRevenus: O.some(eurosParAn(0)),
	tva: true,
}

interface Comparaison {
	nomModèle: NomModèle
	revenuNetAprèsImpôt: MontantDocumenté
	retraite: ValeurDocumentée & {
		trimestres: QuantitéDocumentée
		revenuCotisé: MontantDocumenté
		pointsComplémentaire: QuantitéDocumentée
	}
	maladie: ValeurDocumentée & {
		indemnitésArrêtMaladie: MontantDocumenté
		indemnitésATMP?: MontantDocumenté
		allocationNaissance: MontantDocumenté
		allocationAdoption: MontantDocumenté
	}
	invalidité: ValeurDocumentée & {
		pensionInvaliditéPartielle: MontantDocumenté
		pensionInvaliditéTotale: MontantDocumenté
		renteIncapacitéATMP?: MontantDocumenté
	}
	décès: ValeurDocumentée & {
		pensionDeRéversion: MontantDocumenté
		capitalDécès: MontantDocumenté
		capitalOrphelin?: MontantDocumenté
		renteDécèsATMP?: MontantDocumenté
	}
}

export interface Comparateur {
	situation: SituationComparée
	set: {
		chiffreDAffaires: (montant: MontantRécurrent) => Comparateur
		charges: (montant: MontantRécurrent) => Comparateur
		réponse: (
			...args: {
				[K in Question]: [question: K, valeur: Réponse<K>]
			}[Question]
		) => Comparateur
	}
	compare: () => Comparaison[]
}

export const ComparateurDeModèles = (
	modèles: ModèleComparable[]
): Comparateur => {
	return {
		situation: situationComparée,

		set: {
			chiffreDAffaires: (montant: MontantRécurrent) => {
				situationComparée.chiffreDAffaires = montant
				modèles.forEach((modèle) => modèle.set.chiffreDAffaires(montant))

				return ComparateurDeModèles(modèles)
			},
			charges: (montant: MontantRécurrent) => {
				situationComparée.charges = montant
				modèles.forEach((modèle) => modèle.set.charges(montant))

				return ComparateurDeModèles(modèles)
			},
			réponse: (...args) => {
				const [question, valeur] = args
				situationComparée[question] = valeur
				modèles.forEach((modèle) => modèle.set.réponse(...args))

				return ComparateurDeModèles(modèles)
			},
		},

		compare: (): Comparaison[] => {
			if (!situationComparée.chiffreDAffaires) {
				return []
			}

			return modèles.map((modèle) => {
				return {
					nomModèle: modèle.nom,
					revenuNetAprèsImpôt: modèle.get.revenuNetAprèsImpôt(),
					retraite: modèle.get.retraite(),
					maladie: modèle.get.maladie(),
					invalidité: modèle.get.invalidité(),
					décès: modèle.get.décès(),
				}
			})
		},
	}
}
