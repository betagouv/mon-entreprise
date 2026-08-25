import { montant, Montant } from './Montant'
import { UnitéMonétairePonctuelle } from './Unites'

export type MontantPonctuel = Montant<UnitéMonétairePonctuelle>

export const euros = (valeur: number): Montant<'€'> => montant(valeur, '€')

export const eurosParTitreRestaurant = (
	valeur: number
): Montant<'€/titre-restaurant'> => montant(valeur, '€/titre-restaurant')
