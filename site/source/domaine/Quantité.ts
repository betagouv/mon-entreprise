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

export const pourcentage = (valeur: number): Quantité<'%'> =>
	makeQuantité({
		valeur,
		unité: '%',
	}) as Quantité<'%'>

export const heuresParMois = (valeur: number): Quantité<'heures/mois'> =>
	makeQuantité({
		valeur,
		unité: 'heures/mois',
	}) as Quantité<'heures/mois'>

export const heuresParSemaine = (valeur: number): Quantité<'heures/semaine'> =>
	makeQuantité({
		valeur,
		unité: 'heures/semaine',
	}) as Quantité<'heures/semaine'>

export const jours = (valeur: number): Quantité<'jours'> =>
	makeQuantité({
		valeur,
		unité: 'jours',
	}) as Quantité<'jours'>

export const joursOuvrés = (valeur: number): Quantité<'jours ouvrés'> =>
	makeQuantité({
		valeur,
		unité: 'jours ouvrés',
	}) as Quantité<'jours ouvrés'>

export const mois = (valeur: number): Quantité<'mois'> =>
	makeQuantité({
		valeur,
		unité: 'mois',
	}) as Quantité<'mois'>

export const trimestreCivil = (valeur: number): Quantité<'trimestre civil'> =>
	makeQuantité({
		valeur,
		unité: 'trimestre civil',
	}) as Quantité<'trimestre civil'>

export const annéeCivile = (valeur: number): Quantité<'année civile'> =>
	makeQuantité({
		valeur,
		unité: 'année civile',
	}) as Quantité<'année civile'>

export const employés = (valeur: number): Quantité<'employés'> =>
	makeQuantité({
		valeur,
		unité: 'employés',
	}) as Quantité<'employés'>

export const titresRestaurantParMois = (
	valeur: number
): Quantité<'titre-restaurant/mois'> =>
	makeQuantité({
		valeur,
		unité: 'titre-restaurant/mois',
	}) as Quantité<'titre-restaurant/mois'>

export const quantité = <U extends UnitéQuantité>(
	valeur: number,
	unité: U
): Quantité<U> =>
	makeQuantité({
		valeur,
		unité,
	}) as Quantité<U>
