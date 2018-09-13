/* @flow */
import type { OuiNon } from './shared'
import type { CDD } from './CDD'

export type ContratSalarié = {
	'salaire total'?: string,
	'CDD'?: OuiNon,
	'temps partiel'?: OuiNon,
	'heure par semaine'?: string,
	'statut cadre'?: OuiNon,
	'statut JEI'?: OuiNon,
	'complémentaire santé'?: {
		forfait?: string
	},
	ATMP: {
		'taux collectif ATMP': string
	},
	CDD: CDD
}
