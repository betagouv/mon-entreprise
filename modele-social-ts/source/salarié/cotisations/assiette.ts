import { Montant } from '../../Montant'
import { SituationSalarié } from '../situation'

export const getAssietteDeCotisations = (
	situation: SituationSalarié
): Montant => Montant(situation ? 0 : 0)
