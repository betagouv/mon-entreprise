import { ContratSalarié } from './ContratSalarié'
import { Entreprise } from './Entreprise'

export type Situation = {
	'contrat salarié'?: ContratSalarié
	établissement: {
		'code commune': string
	}
	entreprise?: Entreprise
}
