/* @flow */
import type { ContratSalarié } from './ContratSalarié'
import type { Entreprise } from './Entreprise'

export type Situation = {
	'contrat salarié'?: ContratSalarié,
	établissement: {
		'code commune': string
	},
	entreprise?: Entreprise
}
