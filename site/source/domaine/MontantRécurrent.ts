import { Either } from 'effect'
import { dual, pipe } from 'effect/Function'

import { DivisionParZéro, estZéro, montant, Montant } from './Montant'
import { pourcentage, Quantité } from './Quantite'
import { UnitéMonétaireRécurrente } from './Unites'

export type MontantRécurrent = Montant<UnitéMonétaireRécurrente>

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

export const eurosParMois = (valeur: number): Montant<'€/mois'> =>
	montant(valeur, '€/mois')

export const eurosParAn = (valeur: number): Montant<'€/an'> =>
	montant(valeur, '€/an')

export const eurosParJour = (valeur: number): Montant<'€/jour'> =>
	montant(valeur, '€/jour')

export const eurosParHeure = (valeur: number): Montant<'€/heure'> =>
	montant(valeur, '€/heure')

export const convertitEn: {
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
		convertitEn[cible.unité](montantÀAligner)

const aligneLesValeurs = (
	montantA: MontantRécurrent,
	montantB: MontantRécurrent
): [valeurA: number, valeurB: number] => {
	if (montantA.unité !== montantB.unité) {
		const aligné = pipe(montantB, aligneSur(montantA))

		return [montantA.valeur, aligné.valeur]
	}

	return [montantA.valeur, montantB.valeur]
}

export const plus = dual<
	(
		montantB: MontantRécurrent
	) => <A extends MontantRécurrent>(montantA: A) => A,
	<A extends MontantRécurrent>(montantA: A, montantB: MontantRécurrent) => A
>(
	2,
	<A extends MontantRécurrent>(montantA: A, montantB: MontantRécurrent): A => {
		const [valeurA, valeurB] = aligneLesValeurs(montantA, montantB)

		return montant(valeurA + valeurB, montantA.unité) as A
	}
)

export const moins = dual<
	(
		montantB: MontantRécurrent
	) => <A extends MontantRécurrent>(montantA: A) => A,
	<A extends MontantRécurrent>(montantA: A, montantB: MontantRécurrent) => A
>(
	2,
	<A extends MontantRécurrent>(montantA: A, montantB: MontantRécurrent): A => {
		const [valeurA, valeurB] = aligneLesValeurs(montantA, montantB)

		return montant(valeurA - valeurB, montantA.unité) as A
	}
)

export const sommeEnEurosParMois = (
	montants: ReadonlyArray<MontantRécurrent>
): Montant<'€/mois'> =>
	montants.map(toEurosParMois).reduce(plus, eurosParMois(0))

export const sommeEnEurosParAn = (
	montants: ReadonlyArray<MontantRécurrent>
): Montant<'€/an'> => montants.map(toEurosParAn).reduce(plus, eurosParAn(0))

/**
 * Calcule la proportion d'un montant par rapport à un autre.
 * Retourne un nombre représentant le ratio (sans unité).
 *
 * @param a - Le montant numérateur
 * @param diviseur - Le montant dénominateur (ne peut pas être zéro)
 * @returns Un nombre représentant le ratio a/diviseur, ou une erreur DivisionParZéro
 *
 * @example
 * // 25 €/mois par rapport à 100 €/mois donne 0.25 (soit 25%)
 * const résultat = parRapportÀ(eurosParMois(25), eurosParMois(100)) // Right(0.25)
 */
export const parRapportÀ = dual<
	(
		diviseur: MontantRécurrent
	) => (montantA: MontantRécurrent) => Either.Either<number, DivisionParZéro>,
	(
		montantA: MontantRécurrent,
		diviseur: MontantRécurrent
	) => Either.Either<number, DivisionParZéro>
>(
	2,
	(
		montantA: MontantRécurrent,
		diviseur: MontantRécurrent
	): Either.Either<number, DivisionParZéro> => {
		if (estZéro(diviseur)) {
			return Either.left(new DivisionParZéro())
		}

		const [numérateur, dénominateur] = aligneLesValeurs(montantA, diviseur)

		return Either.right(numérateur / dénominateur)
	}
)

export const pourcentageParRapportÀ = dual<
	(
		diviseur: MontantRécurrent
	) => (
		montantA: MontantRécurrent
	) => Either.Either<Quantité<'%'>, DivisionParZéro>,
	(
		montantA: MontantRécurrent,
		diviseur: MontantRécurrent
	) => Either.Either<Quantité<'%'>, DivisionParZéro>
>(
	2,
	(
		montantA: MontantRécurrent,
		diviseur: MontantRécurrent
	): Either.Either<Quantité<'%'>, DivisionParZéro> => {
		if (estZéro(diviseur)) {
			return Either.left(new DivisionParZéro())
		}

		const [numérateur, dénominateur] = aligneLesValeurs(montantA, diviseur)

		return Either.right(pourcentage((100 * numérateur) / dénominateur))
	}
)

export const estPlusGrandQue = dual<
	(montantB: MontantRécurrent) => (montantA: MontantRécurrent) => boolean,
	(montantA: MontantRécurrent, montantB: MontantRécurrent) => boolean
>(2, (montantA: MontantRécurrent, montantB: MontantRécurrent): boolean => {
	const [valeurA, valeurB] = aligneLesValeurs(montantA, montantB)

	return valeurA > valeurB
})

export const estPlusPetitQue = dual<
	(montantB: MontantRécurrent) => (montantA: MontantRécurrent) => boolean,
	(montantA: MontantRécurrent, montantB: MontantRécurrent) => boolean
>(2, (montantA: MontantRécurrent, montantB: MontantRécurrent): boolean => {
	const [valeurA, valeurB] = aligneLesValeurs(montantA, montantB)

	return valeurA < valeurB
})

export const estPlusGrandOuÉgalÀ = dual<
	(montantB: MontantRécurrent) => (montantA: MontantRécurrent) => boolean,
	(montantA: MontantRécurrent, montantB: MontantRécurrent) => boolean
>(2, (montantA: MontantRécurrent, montantB: MontantRécurrent): boolean => {
	const [valeurA, valeurB] = aligneLesValeurs(montantA, montantB)

	return valeurA >= valeurB
})

export const estPlusPetitOuÉgalÀ = dual<
	(montantB: MontantRécurrent) => (montantA: MontantRécurrent) => boolean,
	(montantA: MontantRécurrent, montantB: MontantRécurrent) => boolean
>(2, (montantA: MontantRécurrent, montantB: MontantRécurrent): boolean => {
	const [valeurA, valeurB] = aligneLesValeurs(montantA, montantB)

	return valeurA <= valeurB
})
