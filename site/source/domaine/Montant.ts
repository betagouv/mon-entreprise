import { Data, Either } from 'effect'
import { dual } from 'effect/Function'
import { isObject } from 'effect/Predicate'

import {
	isUnitéMonétaireRécurrente,
	UnitéMonétaire,
	UnitéMonétairePonctuelle,
	UnitéMonétaireRécurrente,
} from './Unités'

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
export class ConversionImpossible extends Data.TaggedError(
	'ConversionImpossible'
)<{
	readonly source: UnitéMonétaire
	readonly cible: UnitéMonétaire
}> {}

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

export const euros = (valeur: number): Montant<'€'> =>
	makeMontant({
		valeur: arrondirAuCentime(valeur),
		unité: '€',
	}) as Montant<'€'>

export const eurosParTitreRestaurant = (
	valeur: number
): Montant<'€/titre-restaurant'> =>
	makeMontant({
		valeur: arrondirAuCentime(valeur),
		unité: '€/titre-restaurant',
	}) as Montant<'€/titre-restaurant'>

export const eurosParMois = (valeur: number): Montant<'€/mois'> =>
	makeMontant({
		valeur: arrondirAuCentime(valeur),
		unité: '€/mois',
	}) as Montant<'€/mois'>

export const eurosParAn = (valeur: number): Montant<'€/an'> =>
	makeMontant({
		valeur: arrondirAuCentime(valeur),
		unité: '€/an',
	}) as Montant<'€/an'>

export const eurosParJour = (valeur: number): Montant<'€/jour'> =>
	makeMontant({
		valeur: arrondirAuCentime(valeur),
		unité: '€/jour',
	}) as Montant<'€/jour'>

export const eurosParHeure = (valeur: number): Montant<'€/heure'> =>
	makeMontant({
		valeur: arrondirAuCentime(valeur),
		unité: '€/heure',
	}) as Montant<'€/heure'>

export const toEurosParMois = (
	montant: Montant<UnitéMonétaireRécurrente>
): Montant<'€/mois'> => {
	let valeur = montant.valeur
	switch (montant.unité) {
		case '€/an':
			valeur = valeur / 12
			break
		case '€/jour':
			valeur = (valeur * 365) / 12
			break
		case '€/heure':
			valeur = (valeur * 24 * 365) / 12
			break
	}

	return makeMontant({
		valeur: arrondirAuCentime(valeur),
		unité: '€/mois',
	}) as Montant<'€/mois'>
}

export const toEurosParAn = (
	montant: Montant<UnitéMonétaireRécurrente>
): Montant<'€/an'> => {
	let valeur = montant.valeur
	switch (montant.unité) {
		case '€/mois':
			valeur = valeur * 12
			break
		case '€/jour':
			valeur = valeur * 365
			break
		case '€/heure':
			valeur = valeur * 24 * 365
			break
	}

	return makeMontant({
		valeur: arrondirAuCentime(valeur),
		unité: '€/an',
	}) as Montant<'€/an'>
}

export const toEurosParJour = (
	montant: Montant<UnitéMonétaireRécurrente>
): Montant<'€/jour'> => {
	let valeur = montant.valeur
	switch (montant.unité) {
		case '€/an':
			valeur = valeur / 365
			break
		case '€/mois':
			valeur = (valeur * 12) / 365
			break
		case '€/heure':
			valeur = valeur * 24
			break
	}

	return makeMontant({
		valeur: arrondirAuCentime(valeur),
		unité: '€/jour',
	}) as Montant<'€/jour'>
}

export const toEurosParHeure = (
	montant: Montant<UnitéMonétaireRécurrente>
): Montant<'€/heure'> => {
	let valeur = montant.valeur
	switch (montant.unité) {
		case '€/an':
			valeur = valeur / (365 * 24)
			break
		case '€/mois':
			valeur = (valeur * 12) / (365 * 24)
			break
		case '€/jour':
			valeur = valeur / 24
			break
	}

	return makeMontant({
		valeur: arrondirAuCentime(valeur),
		unité: '€/heure',
	}) as Montant<'€/heure'>
}

export const montant = <U extends UnitéMonétaire>(
	valeur: number,
	unité: U
): Montant<U> =>
	makeMontant({
		valeur: arrondirAuCentime(valeur),
		unité,
	}) as Montant<U>

export const plus = dual<
	<M extends Montant<UnitéMonétaire>>(b: M) => (a: M) => M,
	<M extends Montant<UnitéMonétaire>>(a: M, b: M) => M
>(2, <M extends Montant<UnitéMonétaire>>(a: M, b: M): M => {
	const valeurSomme = arrondirAuCentime(a.valeur + b.valeur)

	return makeMontant({ valeur: valeurSomme, unité: a.unité }) as M
})

export const sommeEnEuros = (
	montants: ReadonlyArray<Montant<UnitéMonétairePonctuelle>>
): Montant<UnitéMonétairePonctuelle> => montants.reduce(plus)

export const sommeEnEurosParMois = (
	montants: ReadonlyArray<Montant<UnitéMonétaireRécurrente>>
): Montant<'€/mois'> => montants.map(toEurosParMois).reduce(plus)

export const sommeEnEurosParAn = (
	montants: ReadonlyArray<Montant<UnitéMonétaireRécurrente>>
): Montant<'€/an'> => montants.map(toEurosParAn).reduce(plus)

export const moins = dual<
	<M extends Montant>(b: M) => (a: M) => M,
	<M extends Montant>(a: M, b: M) => M
>(2, <M extends Montant>(a: M, b: M): M => {
	const valeurDifference = arrondirAuCentime(a.valeur - b.valeur)

	return makeMontant({ valeur: valeurDifference, unité: a.unité }) as M
})

export const fois = dual<
	<M extends Montant>(multiplicateur: number) => (a: M) => M,
	<M extends Montant>(a: M, multiplicateur: number) => M
>(2, <M extends Montant>(a: M, multiplicateur: number): M => {
	const valeurProduit = arrondirAuCentime(a.valeur * multiplicateur)

	return makeMontant({ valeur: valeurProduit, unité: a.unité }) as M
})

export const abattement = dual<
	<M extends Montant>(multiplicateur: number) => (a: M) => M,
	<M extends Montant>(a: M, multiplicateur: number) => M
>(2, <M extends Montant>(a: M, multiplicateur: number): M => {
	const valeurProduit = arrondirAuCentime(a.valeur * (1 - multiplicateur))

	return makeMontant({ valeur: valeurProduit, unité: a.unité }) as M
})

/**
 * Divise un montant par un nombre pour obtenir un nouveau montant de même unité.
 *
 * @param a - Le montant à diviser
 * @param diviseur - Le nombre par lequel diviser (ne peut pas être 0)
 * @returns Un nouveau montant de même unité que le montant initial, ou une erreur DivisionParZéro
 *
 * @example
 * const résultat = diviséPar(euros(100), 2) // Right(euros(50))
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

		const valeurQuotient = arrondirAuCentime(a.valeur / diviseur)

		return Either.right(
			makeMontant({ valeur: valeurQuotient, unité: a.unité }) as M
		)
	}
)

/**
 * Calcule la proportion d'un montant par rapport à un autre montant de même unité.
 * Retourne un nombre représentant le ratio (sans unité).
 *
 * @param a - Le montant numérateur
 * @param diviseur - Le montant dénominateur (ne peut pas être zéro)
 * @returns Un nombre représentant le ratio a/diviseur, ou une erreur DivisionParZéro
 *
 * @example
 * // 20€ par rapport à 100€ donne 0.25 (soit 25%)
 * const résultat = parRapportÀ(euros(25), euros(100)) // Right(0.25)
 */
export const parRapportÀ = dual<
	<M extends Montant>(
		diviseur: M
	) => (a: M) => Either.Either<number, DivisionParZéro>,
	<M extends Montant>(
		a: M,
		diviseur: M
	) => Either.Either<number, DivisionParZéro>
>(
	2,
	<M extends Montant>(
		a: M,
		diviseur: M
	): Either.Either<number, DivisionParZéro> => {
		if (estZéro(diviseur)) {
			return Either.left(new DivisionParZéro())
		}

		let numérateur = a.valeur
		let dénominateur = diviseur.valeur

		if (a.unité !== '€') {
			numérateur = toEurosParAn(a as Montant<UnitéMonétaireRécurrente>).valeur
			dénominateur = toEurosParAn(
				diviseur as Montant<UnitéMonétaireRécurrente>
			).valeur
		}

		const rapport = numérateur / dénominateur

		return Either.right(rapport)
	}
)

export const estPlusGrandQue = dual<
	<M extends Montant>(b: M) => (a: M) => boolean,
	<M extends Montant>(a: M, b: M) => boolean
>(2, <M extends Montant>(a: M, b: M): boolean => a.valeur > b.valeur)

export const estPlusPetitQue = dual<
	<M extends Montant>(b: M) => (a: M) => boolean,
	<M extends Montant>(a: M, b: M) => boolean
>(2, <M extends Montant>(a: M, b: M): boolean => a.valeur < b.valeur)
export const estPlusGrandOuÉgalÀ = dual<
	<M extends Montant>(b: M) => (a: M) => boolean,
	<M extends Montant>(a: M, b: M) => boolean
>(2, <M extends Montant>(a: M, b: M): boolean => a.valeur >= b.valeur)
export const estPlusPetitOuÉgalÀ = dual<
	<M extends Montant>(b: M) => (a: M) => boolean,
	<M extends Montant>(a: M, b: M) => boolean
>(2, <M extends Montant>(a: M, b: M): boolean => a.valeur <= b.valeur)

export const estPositif = (montant: Montant): boolean => montant.valeur > 0
export const estNégatif = (montant: Montant): boolean => montant.valeur < 0
export const estZéro = (montant: Montant): boolean => montant.valeur === 0

export const montantToNumber = (montant: Montant): number => montant.valeur

export const toString = (montant: Montant, displayedUnit?: string): string => {
	return `${montant.valeur.toLocaleString('fr-FR')} ${
		displayedUnit ?? montant.unité
	}`
}

export const montantToString = toString
