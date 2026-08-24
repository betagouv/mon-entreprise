import { dual } from 'effect/Function'

import { montant, Montant } from './Montant'
import { UnitéMonétairePonctuelle } from './Unites'

export type MontantPonctuel = Montant<UnitéMonétairePonctuelle>

export const euros = (valeur: number): Montant<'€'> => montant(valeur, '€')

export const eurosParTitreRestaurant = (
	valeur: number
): Montant<'€/titre-restaurant'> => montant(valeur, '€/titre-restaurant')

export const moins = dual<
	<U extends UnitéMonétairePonctuelle>(
		montantB: Montant<U>
	) => (montantA: Montant<U>) => Montant<U>,
	<U extends UnitéMonétairePonctuelle>(
		montantA: Montant<U>,
		montantB: Montant<U>
	) => Montant<U>
>(
	2,
	<U extends UnitéMonétairePonctuelle>(
		montantA: Montant<U>,
		montantB: Montant<U>
	): Montant<U> => montant(montantA.valeur - montantB.valeur, montantA.unité)
)
