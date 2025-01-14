import { Situation } from '../situation'
import { Départements, estDépartement } from './département'

const EST_DROM_PAR_DÉFAUT = false

export const estDrom = (situation: Situation) => {
	if (!situation.commune) {
		utilisationDefault('EST_DROM')
		return EST_DROM_PAR_DÉFAUT
	}

	estDépartement(situation.commune, Départements.Guadeloupe)
}
