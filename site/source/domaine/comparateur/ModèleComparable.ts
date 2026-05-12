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

export interface ModèleComparable extends Modele {
	set: {
		chiffreDAffaires: (montant: MontantRécurrent) => void
		charges: (montant: MontantRécurrent) => void
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
