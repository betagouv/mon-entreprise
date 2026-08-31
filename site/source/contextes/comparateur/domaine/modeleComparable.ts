import * as O from 'effect/Option'
import { TFunction } from 'i18next'
import Engine from 'publicodes'
import { ReactNode } from 'react'

import { StatutType } from '@/components/StatutTag'
import { Montant } from '@/domaine/Montant'
import { MontantRécurrent } from '@/domaine/MontantRecurrent'
import { DottedName } from '@/domaine/publicodes/DottedName'
import { NomModèle } from '@/domaine/PublicodesSimulationConfig'
import { Quantité } from '@/domaine/Quantite'

import { IRouIS } from './imposition'
import { Question, Réponse } from './situation'

type ValeurDocumentée = {
	// TODO: remplacer documentationRule par DocumentationLink (un composant)
	documentationRule: DottedName
	// TODO: déplacer les warnings ici
	// warning?: ReactNode
}

export type MontantDocumenté = Montant & ValeurDocumentée
export type MontantRécurrentDocumenté = MontantRécurrent & ValeurDocumentée
export type QuantitéDocumentée = Quantité & ValeurDocumentée

export interface ModèleComparable {
	nom: NomModèle

	set: {
		chiffreDAffaires: (montant: O.Option<MontantRécurrent>) => void
		charges: (montant: O.Option<MontantRécurrent>) => void
		IRouIS?: (valeur: IRouIS) => void
		versementLibératoire?: (valeur: boolean) => void
		réponse: (
			...args: {
				[K in Question]: [question: K, valeur: Réponse<K>]
			}[Question]
		) => void
	}

	get: {
		engine: () => Engine<DottedName>
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
	'engine' | 'statut' | 'warning'
>
export type ÉlémentComparé<K extends CatégorieComparée> = Exclude<
	keyof ReturnType<ModèleComparable['get'][K]>,
	'documentationRule'
>
