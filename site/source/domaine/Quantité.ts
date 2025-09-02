import { Data } from 'effect'
import { isObject } from 'effect/Predicate'

import { UnitéQuantité } from './Unités'

export interface Quantité<T extends UnitéQuantité = UnitéQuantité> {
	readonly _tag: 'Quantité'
	readonly valeur: number
	readonly unité: T
}

export const isQuantité = (something: unknown): something is Quantité =>
	isObject(something) && '_tag' in something && something._tag === 'Quantité'

const makeQuantité = Data.tagged<Quantité>('Quantité')

export const quantité = <U extends string>(
	valeur: number,
	unité: U
): Quantité<U> =>
	makeQuantité({
		valeur,
		unité,
	}) as Quantité<U>

export const pourcentage = (valeur: number): Quantité<'%'> =>
	quantité(valeur, '%')

export const heuresParMois = (valeur: number): Quantité<'heures/mois'> =>
	quantité(valeur, 'heures/mois')

export const heuresParSemaine = (valeur: number): Quantité<'heures/semaine'> =>
	quantité(valeur, 'heures/semaine')

export const jours = (valeur: number): Quantité<'jours'> =>
	quantité(valeur, 'jours')

export const joursOuvrés = (valeur: number): Quantité<'jours ouvrés'> =>
	quantité(valeur, 'jours ouvrés')

export const mois = (valeur: number): Quantité<'mois'> =>
	quantité(valeur, 'mois')

export const trimestreCivil = (valeur: number): Quantité<'trimestre civil'> =>
	quantité(valeur, 'trimestre civil')

export const annéeCivile = (valeur: number): Quantité<'année civile'> =>
	quantité(valeur, 'année civile')

export const employés = (valeur: number): Quantité<'employés'> =>
	quantité(valeur, 'employés')
