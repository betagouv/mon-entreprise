import { Data, Either } from 'effect'
import { dual, pipe } from 'effect/Function'
import * as O from 'effect/Option'
import { isObject } from 'effect/Predicate'

import { pourcentage, Quantité } from './Quantite'
import {
	isUnitéMonétaireRécurrente,
	UnitéMonétaire,
	UnitéMonétairePonctuelle,
	UnitéMonétaireRécurrente,
} from './Unites'

export interface Montant<T extends UnitéMonétaire = UnitéMonétaire> {
	readonly _tag: 'Montant'
	readonly valeur: number
	readonly unité: T
}

export type MontantRécurrent = Montant<UnitéMonétaireRécurrente>

export const isMontant = (something: unknown): something is Montant =>
	isObject(something) && '_tag' in something && something._tag === 'Montant'

export const isMontantRécurrent = (
	montant: Montant
): montant is MontantRécurrent => isUnitéMonétaireRécurrente(montant.unité)

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

export const euros = (valeur: number): Montant<'€'> => montant(valeur, '€')

export const eurosParTitreRestaurant = (
	valeur: number
): Montant<'€/titre-restaurant'> => montant(valeur, '€/titre-restaurant')

export const eurosParMois = (valeur: number): Montant<'€/mois'> =>
	montant(valeur, '€/mois')

export const eurosParAn = (valeur: number): Montant<'€/an'> =>
	montant(valeur, '€/an')

export const eurosParJour = (valeur: number): Montant<'€/jour'> =>
	montant(valeur, '€/jour')

export const eurosParHeure = (valeur: number): Montant<'€/heure'> =>
	montant(valeur, '€/heure')

export const toEurosParMois = (
	montantRécurrent: MontantRécurrent
): Montant<'€/mois'> => {
	let valeur = montantRécurrent.valeur
	switch (montantRécurrent.unité) {
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

	return montant(valeur, '€/mois')
}

export const toEurosParAn = (
	montantRécurrent: MontantRécurrent
): Montant<'€/an'> => {
	let valeur = montantRécurrent.valeur
	switch (montantRécurrent.unité) {
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

	return montant(valeur, '€/an')
}

export const toEurosParJour = (
	montantRécurrent: MontantRécurrent
): Montant<'€/jour'> => {
	let valeur = montantRécurrent.valeur
	switch (montantRécurrent.unité) {
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

	return montant(valeur, '€/jour')
}

export const toEurosParHeure = (
	montantRécurrent: MontantRécurrent
): Montant<'€/heure'> => {
	let valeur = montantRécurrent.valeur
	switch (montantRécurrent.unité) {
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

	return montant(valeur, '€/heure')
}

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

type PaireMêmeUnitéPonctuelle = {
	[U in UnitéMonétairePonctuelle]: [montantA: Montant<U>, montantB: Montant<U>]
}[UnitéMonétairePonctuelle]

type PaireDeMontantsCombinables =
	| [montantA: MontantRécurrent, montantB: MontantRécurrent]
	| PaireMêmeUnitéPonctuelle

const paireDeRécurrentsÀAligner = (
	paire: readonly [Montant, Montant]
): paire is [MontantRécurrent, MontantRécurrent] =>
	isMontantRécurrent(paire[0]) &&
	isMontantRécurrent(paire[1]) &&
	paire[0].unité !== paire[1].unité

const convertisseurs: {
	[U in UnitéMonétaireRécurrente]: (m: MontantRécurrent) => Montant<U>
} = {
	'€/mois': toEurosParMois,
	'€/an': toEurosParAn,
	'€/jour': toEurosParJour,
	'€/heure': toEurosParHeure,
}

const aligneSur =
	<U extends UnitéMonétaireRécurrente>(cible: Montant<U>) =>
	(montantÀAligner: MontantRécurrent): Montant<U> =>
		convertisseurs[cible.unité](montantÀAligner)

const aligneLesValeurs = (
	...paire: PaireDeMontantsCombinables
): [valeurA: number, valeurB: number] =>
	pipe(
		paire,
		O.liftPredicate(paireDeRécurrentsÀAligner),
		O.map(([cible, àAligner]): [number, number] => {
			const aligné = pipe(àAligner, aligneSur(cible))

			return [cible.valeur, aligné.valeur]
		}),
		O.getOrElse((): [number, number] => [paire[0].valeur, paire[1].valeur])
	)

type CombinaisonDeMontantsCompatiblesEnPipe = {
	(montantB: MontantRécurrent): <A extends MontantRécurrent>(montantA: A) => A
	<U extends UnitéMonétairePonctuelle>(
		montantB: Montant<U>
	): (montantA: Montant<U>) => Montant<U>
}

type CombinaisonDeMontantsCompatibles = {
	<A extends MontantRécurrent>(montantA: A, montantB: MontantRécurrent): A
	<U extends UnitéMonétairePonctuelle>(
		montantA: Montant<U>,
		montantB: Montant<U>
	): Montant<U>
}

export const plus = dual<
	CombinaisonDeMontantsCompatiblesEnPipe,
	CombinaisonDeMontantsCompatibles
>(2, (...paire: PaireDeMontantsCombinables): Montant => {
	const [montantA] = paire
	const [valeurA, valeurB] = aligneLesValeurs(...paire)

	return montant(valeurA + valeurB, montantA.unité)
})

export const sommeEnEurosParMois = (
	montants: ReadonlyArray<MontantRécurrent>
): Montant<'€/mois'> => montants.map(toEurosParMois).reduce(plus)

export const sommeEnEurosParAn = (
	montants: ReadonlyArray<MontantRécurrent>
): Montant<'€/an'> => montants.map(toEurosParAn).reduce(plus)

export const moins = dual<
	CombinaisonDeMontantsCompatiblesEnPipe,
	CombinaisonDeMontantsCompatibles
>(2, (...paire: PaireDeMontantsCombinables): Montant => {
	const [montantA] = paire
	const [valeurA, valeurB] = aligneLesValeurs(...paire)

	return montant(valeurA - valeurB, montantA.unité)
})

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

		return Either.right(montant(a.valeur / diviseur, a.unité) as M)
	}
)

type OpérationSurMontantsCompatiblesEnPipe<R> = {
	(montantB: MontantRécurrent): (montantA: MontantRécurrent) => R
	<U extends UnitéMonétairePonctuelle>(
		montantB: Montant<U>
	): (montantA: Montant<U>) => R
}

type OpérationSurMontantsCompatibles<R> = {
	(montantA: MontantRécurrent, montantB: MontantRécurrent): R
	<U extends UnitéMonétairePonctuelle>(
		montantA: Montant<U>,
		montantB: Montant<U>
	): R
}

const rapport = (
	...paire: PaireDeMontantsCombinables
): Either.Either<number, DivisionParZéro> => {
	const [, diviseur] = paire

	if (estZéro(diviseur)) {
		return Either.left(new DivisionParZéro())
	}

	const [numérateur, dénominateur] = aligneLesValeurs(...paire)

	return Either.right(numérateur / dénominateur)
}

/**
 * Calcule la proportion d'un montant par rapport à un autre.
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
	OpérationSurMontantsCompatiblesEnPipe<Either.Either<number, DivisionParZéro>>,
	OpérationSurMontantsCompatibles<Either.Either<number, DivisionParZéro>>
>(2, rapport)

export const pourcentageParRapportÀ = dual<
	OpérationSurMontantsCompatiblesEnPipe<
		Either.Either<Quantité<'%'>, DivisionParZéro>
	>,
	OpérationSurMontantsCompatibles<Either.Either<Quantité<'%'>, DivisionParZéro>>
>(2, (...paire: PaireDeMontantsCombinables) =>
	pipe(
		rapport(...paire),
		Either.map((valeur) => pourcentage(100 * valeur))
	)
)

export const estPlusGrandQue = dual<
	OpérationSurMontantsCompatiblesEnPipe<boolean>,
	OpérationSurMontantsCompatibles<boolean>
>(2, (...paire: PaireDeMontantsCombinables): boolean => {
	const [valeurA, valeurB] = aligneLesValeurs(...paire)

	return valeurA > valeurB
})
export const estPlusPetitQue = dual<
	OpérationSurMontantsCompatiblesEnPipe<boolean>,
	OpérationSurMontantsCompatibles<boolean>
>(2, (...paire: PaireDeMontantsCombinables): boolean => {
	const [valeurA, valeurB] = aligneLesValeurs(...paire)

	return valeurA < valeurB
})
export const estPlusGrandOuÉgalÀ = dual<
	OpérationSurMontantsCompatiblesEnPipe<boolean>,
	OpérationSurMontantsCompatibles<boolean>
>(2, (...paire: PaireDeMontantsCombinables): boolean => {
	const [valeurA, valeurB] = aligneLesValeurs(...paire)

	return valeurA >= valeurB
})
export const estPlusPetitOuÉgalÀ = dual<
	OpérationSurMontantsCompatiblesEnPipe<boolean>,
	OpérationSurMontantsCompatibles<boolean>
>(2, (...paire: PaireDeMontantsCombinables): boolean => {
	const [valeurA, valeurB] = aligneLesValeurs(...paire)

	return valeurA <= valeurB
})

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
