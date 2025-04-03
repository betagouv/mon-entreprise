import { Data, Either } from 'effect'
import { dual } from 'effect/Function'

export type UnitéMonétaire =
	| 'Euro'
	| 'EuroParMois'
	| 'EuroParAn'
	| 'EuroParJour'
	| 'EuroParHeure'

export interface Montant {
	readonly _tag: 'Montant'
	readonly valeur: number
	readonly unité: UnitéMonétaire
}

export interface Euro extends Montant {
	readonly unité: 'Euro'
}

export interface EuroParMois extends Montant {
	readonly unité: 'EuroParMois'
}

export interface EuroParAn extends Montant {
	readonly unité: 'EuroParAn'
}

export interface EuroParJour extends Montant {
	readonly unité: 'EuroParJour'
}

export interface EuroParHeure extends Montant {
	readonly unité: 'EuroParHeure'
}

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

export const estEuro = (montant: Montant): montant is Euro =>
	montant.unité === 'Euro'
export const estEuroParMois = (montant: Montant): montant is EuroParMois =>
	montant.unité === 'EuroParMois'
export const estEuroParAn = (montant: Montant): montant is EuroParAn =>
	montant.unité === 'EuroParAn'
export const estEuroParJour = (montant: Montant): montant is EuroParJour =>
	montant.unité === 'EuroParJour'
export const estEuroParHeure = (montant: Montant): montant is EuroParHeure =>
	montant.unité === 'EuroParHeure'

export const euros = (valeur: number): Euro =>
	makeMontant({ valeur: arrondirAuCentime(valeur), unité: 'Euro' }) as Euro

export const eurosParMois = (valeur: number): EuroParMois =>
	makeMontant({
		valeur: arrondirAuCentime(valeur),
		unité: 'EuroParMois',
	}) as EuroParMois

export const eurosParAn = (valeur: number): EuroParAn =>
	makeMontant({
		valeur: arrondirAuCentime(valeur),
		unité: 'EuroParAn',
	}) as EuroParAn

export const eurosParJour = (valeur: number): EuroParJour =>
	makeMontant({
		valeur: arrondirAuCentime(valeur),
		unité: 'EuroParJour',
	}) as EuroParJour

export const eurosParHeure = (valeur: number): EuroParHeure =>
	makeMontant({
		valeur: arrondirAuCentime(valeur),
		unité: 'EuroParHeure',
	}) as EuroParHeure

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
	return `${montant.valeur.toLocaleString('fr-FR')} ${Symbole[montant.unité]}`
}
