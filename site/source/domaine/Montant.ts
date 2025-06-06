import { Data, Either } from 'effect'
import { dual } from 'effect/Function'
import { isObject } from 'effect/Predicate'

export type UnitéMonétaire =
	| 'Euro'
	| 'EuroParMois'
	| 'EuroParAn'
	| 'EuroParJour'
	| 'EuroParHeure'

export interface Montant<T extends UnitéMonétaire = UnitéMonétaire> {
	readonly _tag: 'Montant'
	readonly valeur: number
	readonly unité: T
}

export const isMontant = (something: unknown): something is Montant =>
	isObject(something) && '_tag' in something && something._tag === 'Montant'

const makeMontant = Data.tagged<Montant>('Montant')

export class DivisionParZéro extends Data.TaggedError('DivisionParZéro') {}
export class ConversionImpossible extends Data.TaggedError(
	'ConversionImpossible'
)<{
	readonly source: UnitéMonétaire
	readonly cible: UnitéMonétaire
}> {}

const Symbole: Record<UnitéMonétaire, string> = {
	Euro: '€',
	EuroParMois: '€/mois',
	EuroParAn: '€/an',
	EuroParJour: '€/jour',
	EuroParHeure: '€/heure',
} as const

const arrondirAuCentime = (valeur: number): number =>
	Math.round(valeur * 100) / 100

export const estEuro = (montant: Montant): montant is Montant<'Euro'> =>
	montant.unité === 'Euro'
export const estEuroParMois = (
	montant: Montant
): montant is Montant<'EuroParMois'> => montant.unité === 'EuroParMois'
export const estEuroParAn = (
	montant: Montant
): montant is Montant<'EuroParAn'> => montant.unité === 'EuroParAn'
export const estEuroParJour = (
	montant: Montant
): montant is Montant<'EuroParJour'> => montant.unité === 'EuroParJour'
export const estEuroParHeure = (
	montant: Montant
): montant is Montant<'EuroParHeure'> => montant.unité === 'EuroParHeure'

export const euros = (valeur: number): Montant<'Euro'> =>
	makeMontant({
		valeur: arrondirAuCentime(valeur),
		unité: 'Euro',
	}) as Montant<'Euro'>

export const eurosParMois = (valeur: number): Montant<'EuroParMois'> =>
	makeMontant({
		valeur: arrondirAuCentime(valeur),
		unité: 'EuroParMois',
	}) as Montant<'EuroParMois'>

export const eurosParAn = (valeur: number): Montant<'EuroParAn'> =>
	makeMontant({
		valeur: arrondirAuCentime(valeur),
		unité: 'EuroParAn',
	}) as Montant<'EuroParAn'>

export const eurosParJour = (valeur: number): Montant<'EuroParJour'> =>
	makeMontant({
		valeur: arrondirAuCentime(valeur),
		unité: 'EuroParJour',
	}) as Montant<'EuroParJour'>

export const eurosParHeure = (valeur: number): Montant<'EuroParHeure'> =>
	makeMontant({
		valeur: arrondirAuCentime(valeur),
		unité: 'EuroParHeure',
	}) as Montant<'EuroParHeure'>

export const toEurosParMois = (
	montant: Montant<UnitéMonétaire>
): Montant<'EuroParMois'> => {
	let valeur = montant.valeur
	switch (montant.unité) {
		case 'EuroParAn':
			valeur = valeur / 12
			break
		case 'EuroParJour':
			valeur = (valeur * 365) / 12
			break
		case 'EuroParHeure':
			valeur = (valeur * 24 * 365) / 12
			break
	}

	return makeMontant({
		valeur: arrondirAuCentime(valeur),
		unité: 'EuroParMois',
	}) as Montant<'EuroParMois'>
}

export const toEurosParAn = (
	montant: Montant<UnitéMonétaire>
): Montant<'EuroParAn'> => {
	let valeur = montant.valeur
	switch (montant.unité) {
		case 'EuroParMois':
			valeur = valeur * 12
			break
		case 'EuroParJour':
			valeur = valeur * 365
			break
		case 'EuroParHeure':
			valeur = valeur * 24 * 365
			break
	}

	return makeMontant({
		valeur: arrondirAuCentime(valeur),
		unité: 'EuroParAn',
	}) as Montant<'EuroParAn'>
}

export const toEurosParJour = (
	montant: Montant<UnitéMonétaire>
): Montant<'EuroParJour'> => {
	let valeur = montant.valeur
	switch (montant.unité) {
		case 'EuroParAn':
			valeur = valeur / 365
			break
		case 'EuroParMois':
			valeur = (valeur * 12) / 365
			break
		case 'EuroParHeure':
			valeur = valeur * 24
			break
	}

	return makeMontant({
		valeur: arrondirAuCentime(valeur),
		unité: 'EuroParJour',
	}) as Montant<'EuroParJour'>
}

export const toEurosParHeure = (
	montant: Montant<UnitéMonétaire>
): Montant<'EuroParHeure'> => {
	let valeur = montant.valeur
	switch (montant.unité) {
		case 'EuroParAn':
			valeur = valeur / (365 * 24)
			break
		case 'EuroParMois':
			valeur = (valeur * 12) / (365 * 24)
			break
		case 'EuroParJour':
			valeur = valeur / 24
			break
	}

	return makeMontant({
		valeur: arrondirAuCentime(valeur),
		unité: 'EuroParHeure',
	}) as Montant<'EuroParHeure'>
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
	<M extends Montant>(b: M) => (a: M) => M,
	<M extends Montant>(a: M, b: M) => M
>(2, <M extends Montant>(a: M, b: M): M => {
	const valeurSomme = arrondirAuCentime(a.valeur + b.valeur)

	return makeMontant({ valeur: valeurSomme, unité: a.unité }) as M
})

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

export const toString = (montant: Montant): string => {
	return `${montant.valeur.toLocaleString('fr-FR')} ${unitéMonétaireToString(
		montant.unité
	)}`
}

export const montantToString = toString

export const unitéMonétaireToString = (u: UnitéMonétaire): string => Symbole[u]
