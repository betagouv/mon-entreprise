import { Data, Either } from 'effect'
import { dual } from 'effect/Function'
import { isObject } from 'effect/Predicate'

import {
	isUnitéMonétaireRécurrente,
	UnitéMonétaire,
	UnitéMonétaireRécurrente,
} from './Unites'

export interface Montant<T extends UnitéMonétaire = UnitéMonétaire> {
	readonly _tag: 'Montant'
	readonly valeur: number
	readonly unité: T
}

export const isMontant = (something: unknown): something is Montant =>
	isObject(something) && '_tag' in something && something._tag === 'Montant'

export const isMontantRécurrent = (
	montant: Montant
): montant is Montant<UnitéMonétaireRécurrente> =>
	isUnitéMonétaireRécurrente(montant.unité)

const makeMontant = Data.tagged<Montant>('Montant')

export class DivisionParZéro extends Data.TaggedError('DivisionParZéro') {}

const arrondirAuCentime = (valeur: number): number =>
	Math.round(valeur * 100) / 100

export const estEuro = (montant: Montant): montant is Montant<'€'> =>
	montant.unité === '€'
export const estEuroParTitreRestaurant = (
	montant: Montant
): montant is Montant<'€/titre-restaurant'> =>
	montant.unité === '€/titre-restaurant'
export const estEuroParMois = (
	montant: Montant
): montant is Montant<'€/mois'> => montant.unité === '€/mois'
export const estEuroParAn = (montant: Montant): montant is Montant<'€/an'> =>
	montant.unité === '€/an'
export const estEuroParJour = (
	montant: Montant
): montant is Montant<'€/jour'> => montant.unité === '€/jour'
export const estEuroParHeure = (
	montant: Montant
): montant is Montant<'€/heure'> => montant.unité === '€/heure'

export const montant = <U extends UnitéMonétaire>(
	valeur: number,
	unité: U
): Montant<U> =>
	makeMontant({
		valeur: arrondirAuCentime(valeur),
		unité,
	}) as Montant<U>

export const arrondirÀLEuro = <M extends Montant>(m: M): M =>
	montant(Math.round(m.valeur), m.unité) as M

export const fois = dual<
	<M extends Montant>(multiplicateur: number) => (a: M) => M,
	<M extends Montant>(a: M, multiplicateur: number) => M
>(
	2,
	<M extends Montant>(a: M, multiplicateur: number): M =>
		montant(a.valeur * multiplicateur, a.unité) as M
)

export const abattement = dual<
	<M extends Montant>(multiplicateur: number) => (a: M) => M,
	<M extends Montant>(a: M, multiplicateur: number) => M
>(
	2,
	<M extends Montant>(a: M, multiplicateur: number): M =>
		montant(a.valeur * (1 - multiplicateur), a.unité) as M
)

/**
 * Divise un montant par un nombre pour obtenir un nouveau montant de même unité.
 *
 * @param a - Le montant à diviser
 * @param diviseur - Le nombre par lequel diviser (ne peut pas être 0)
 * @returns Un nouveau montant de même unité que le montant initial, ou une erreur DivisionParZéro
 *
 * @example
 * const résultat = diviséPar(montant(100, '€'), 2) // Right(montant(50, '€'))
 */
export const diviséPar = dual<
	<M extends Montant>(
		diviseur: number
	) => (a: M) => Either.Either<M, DivisionParZéro>,
	<M extends Montant>(
		a: M,
		diviseur: number
	) => Either.Either<M, DivisionParZéro>
>(
	2,
	<M extends Montant>(
		a: M,
		diviseur: number
	): Either.Either<M, DivisionParZéro> => {
		if (diviseur === 0) {
			return Either.left(new DivisionParZéro())
		}

		return Either.right(montant(a.valeur / diviseur, a.unité) as M)
	}
)

export const estPositif = (montant: Montant): boolean => montant.valeur > 0
export const estNégatif = (montant: Montant): boolean => montant.valeur < 0
export const estZéro = (montant: Montant): boolean => montant.valeur === 0

export const montantToNumber = (montant: Montant): number => montant.valeur

export const montantToString = (
	montant: Montant,
	displayedUnit?: string
): string => {
	// eslint-disable-next-line no-irregular-whitespace
	return `${montant.valeur.toLocaleString('fr-FR')} ${
		displayedUnit ?? montant.unité
	}`
}
