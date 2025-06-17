import { addYears, getYear, isAfter, isBefore } from 'date-fns/fp'
import { pipe } from 'effect'
import * as A from 'effect/Array'
import { dual } from 'effect/Function'
import * as O from 'effect/Option'
import { and, not } from 'effect/Predicate'

import { ANNÉE_DE_NAISSANCE_EXCLUE, DATE_RÉFORME } from './constantes'

export interface EnfantsÀCharge<Prénom extends string = string> {
	enfants: Array<Enfant<Prénom>>
	AeeH: O.Option<number>
}

export interface Enfant<Prénom extends string = string> {
	prénom: O.Option<Prénom>
	dateDeNaissance: O.Option<Date>
}
export interface EnfantsÀChargeValide<Prénom extends string = string>
	extends EnfantsÀCharge {
	enfants: Array<EnfantValide<Prénom>>
	AeeH: O.Some<number>
}

export interface EnfantValide<Prénom extends string = string> extends Enfant {
	prénom: O.Some<Prénom>
	dateDeNaissance: O.Some<Date>
}

export const estEnfantsÀChargeValide = (
	enfantsÀCharge: EnfantsÀCharge
): enfantsÀCharge is EnfantsÀChargeValide =>
	A.isNonEmptyArray(enfantsÀCharge.enfants) &&
	tousLesEnfantsSontValides(enfantsÀCharge.enfants) &&
	pasDePrénomEndouble(enfantsÀCharge.enfants) &&
	estAeeHValide(enfantsÀCharge)

export const tousLesEnfantsSontValides = (enfants: Array<Enfant>): boolean =>
	pipe(enfants, A.every(estEnfantValide))

export const estEnfantValide = (enfant: Enfant): enfant is EnfantValide =>
	O.isSome(enfant.prénom) &&
	!!enfant.prénom.value &&
	O.isSome(enfant.dateDeNaissance) &&
	pipe(enfant.dateDeNaissance.value, isBefore(new Date('2025-06-01')))

export const pasDePrénomEndouble = (enfants: Array<Enfant>): boolean =>
	pipe(
		enfants,
		A.map((enfant) => enfant.prénom),
		A.getSomes,
		A.dedupe,
		A.length
	) === enfants.length

export const estAeeHValide = (enfantsÀCharge: EnfantsÀCharge): boolean =>
	estAeeHRépondue(enfantsÀCharge) &&
	estAeeHInférieurOuÉgalAuNombreDEnfants(enfantsÀCharge)

export const estAeeHRépondue = (enfantsÀCharge: EnfantsÀCharge): boolean =>
	O.isSome(enfantsÀCharge.AeeH)

export const estAeeHInférieurOuÉgalAuNombreDEnfants = (
	enfantsÀCharge: EnfantsÀCharge
): boolean =>
	O.isNone(enfantsÀCharge.AeeH) ||
	enfantsÀCharge.AeeH.value <= enfantsÀCharge.enfants.length

export const estEnfantGardable = (enfant: Enfant): enfant is EnfantValide =>
	estEnfantValide(enfant) && enfantAMoinsDe6Ans(enfant)

export const isEnfantValide = (e: Enfant): e is EnfantValide =>
	O.isSome(e.prénom) && O.isSome(e.dateDeNaissance)

export const enfantAPlusDe3Ans = (enfant: O.Option<EnfantValide>): boolean =>
	O.isSome(enfant) &&
	pipe(enfant.value.dateDeNaissance.value, addYears(3), isBefore(DATE_RÉFORME))

export const enfantNéEn = (année: number) => (enfant: Enfant) =>
	O.isSome(enfant.dateDeNaissance) &&
	getYear(enfant.dateDeNaissance.value) === année

export const enfantAMoinsDe6Ans = (enfant: EnfantValide) =>
	pipe(enfant.dateDeNaissance.value, addYears(6), isAfter(DATE_RÉFORME))

export const getEnfantFromPrénom = dual<
	<Prénom extends string>(
		enfants: Array<EnfantValide<Prénom>>
	) => (prénom: Prénom) => O.Option<EnfantValide>,
	<Prénom extends string>(
		prénom: Prénom,
		enfants: Array<EnfantValide<Prénom>>
	) => O.Option<EnfantValide>
>(
	2,
	<Prénom extends string>(
		prénom: Prénom,
		enfants: Array<EnfantValide<Prénom>>
	): O.Option<EnfantValide> =>
		pipe(
			enfants,
			A.findFirst((enfant: EnfantValide) => enfant.prénom.value === prénom)
		)
)

export const enfantOuvreDroitAuCMG = and<EnfantValide>(
	not(enfantNéEn(ANNÉE_DE_NAISSANCE_EXCLUE)),
	enfantAMoinsDe6Ans
)
