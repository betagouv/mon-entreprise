import { MontantRécurrent } from '../Montant'
import { NomModèle } from '../SimulationConfig'
import {
	ModèleComparable,
	MontantDocumenté,
	QuantitéDocumentée,
	ValeurDocumentée,
} from './ModèleComparable'

interface SituationComparée {
	chiffreDAffaires?: MontantRécurrent
	charges?: MontantRécurrent
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

const situationComparée: SituationComparée = {}

export interface Comparateur {
	set: {
		chiffreDAffaires: (montant: MontantRécurrent) => Comparateur
		charges: (montant: MontantRécurrent) => Comparateur
	}
	compare: () => Comparaison[]
}

export const ComparateurDeModèles = (
	modèles: ModèleComparable[]
): Comparateur => {
	return {
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
