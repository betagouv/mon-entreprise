import { TFunction } from 'i18next'
import { ComponentType, ReactNode } from 'react'

import { StatutType } from '@/components/StatutTag'
import { DocumentationDeValeur } from '@/domaine/documentation/DocumentationDeValeur'
import { Montant } from '@/domaine/Montant'
import { MontantRécurrent } from '@/domaine/MontantRecurrent'
import { NomModèle } from '@/domaine/PublicodesSimulationConfig'
import { Quantité } from '@/domaine/Quantite'

import { SituationComparée } from './situation'

export type ValeurDocumentée = {
	documentation: DocumentationDeValeur
	// TODO: déplacer les warnings ici
	// warning?: ReactNode
}

export type MontantDocumenté = Montant & ValeurDocumentée
export type MontantRécurrentDocumenté = MontantRécurrent & ValeurDocumentée
export type QuantitéDocumentée = Quantité & ValeurDocumentée

export interface ModèleComparable {
	nom: NomModèle

	DocumentationDeRègle: ComponentType<{ basePath: string }>

	set: {
		situation: (situation: SituationComparée) => void
	}

	get: {
		statut: {
			étiquette: StatutType
			nom: string
			// TODO: ne plus retourner de trad, c'est le comparateur qui gère ça
			régime: (t: TFunction) => string
			imposition: () => ReactNode
		}
		revenu: () => {
			bénéfice: MontantRécurrentDocumenté
			revenuNetAprèsImpôt: MontantRécurrentDocumenté
		}
		dépenses: () => {
			cotisations: MontantRécurrentDocumenté
			impôt: MontantRécurrentDocumenté
		}
		retraite: () => ValeurDocumentée & {
			trimestres: QuantitéDocumentée
			revenuCotisé: MontantRécurrentDocumenté
			pointsComplémentaire: QuantitéDocumentée
			valeurPointComplémentaire: MontantRécurrentDocumenté
		}
		maladie: () => ValeurDocumentée & {
			indemnitésArrêtMaladie: MontantRécurrentDocumenté
			délaiAttente: QuantitéDocumentée
			indemnitésATMP?: MontantRécurrentDocumenté
			indemnitésATMPLongTerme?: MontantRécurrentDocumenté
		}
		parentalité: () => ValeurDocumentée & {
			indemnitésMaternitéPaternitéAdoption: MontantRécurrentDocumenté
			allocationNaissance?: MontantDocumenté
			allocationAdoption?: MontantDocumenté
		}
		invalidité: () => ValeurDocumentée & {
			pensionInvaliditéPartielle: MontantRécurrentDocumenté
			pensionInvaliditéTotale: MontantRécurrentDocumenté
			renteIncapacitéATMP?: MontantRécurrentDocumenté
		}
		décès: () => ValeurDocumentée & {
			pensionDeRéversion: MontantRécurrentDocumenté
			capitalDécès: MontantDocumenté
			capitalOrphelin?: MontantDocumenté
			renteDécèsATMP?: MontantRécurrentDocumenté
		}
		// gestion: () => {
		// 	coûtsDeCréation: Montant<'€'>
		// 	statutConjointe: (t: TFunction) => string
		// }
		warning?: () => {
			revenuTropBasPourIJ?: boolean
			seuilMicro?: Montant<'€/an'>
		}
	}
}

export type CatégorieComparée = keyof Omit<
	ModèleComparable['get'],
	'statut' | 'warning'
>
export type ÉlémentComparé<K extends CatégorieComparée> = Exclude<
	keyof ReturnType<ModèleComparable['get'][K]>,
	'documentation'
>
