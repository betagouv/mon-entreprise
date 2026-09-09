import { addYears, getYear, isAfter, isBefore } from 'date-fns/fp'
import { pipe } from 'effect'
import * as A from 'effect/Array'
import { dual } from 'effect/Function'
import * as O from 'effect/Option'

import { DATE_RÉFORME } from './constantes'

export interface EnfantsÀCharge<Prénom extends string = string> {
	enfants: Array<Enfant<Prénom>>
	perçoitAeeH: O.Option<boolean>
	AeeH: O.Option<number>
}

export interface Enfant<Prénom extends string = string> {
	prénom: O.Option<Prénom>
	dateDeNaissance: O.Option<Date>
}

export interface EnfantValide extends Enfant {
	prénom: O.Some<string>
	dateDeNaissance: O.Some<Date>
}

export const estEnfantsÀChargeValide = (
	enfantsÀCharge: EnfantsÀCharge
): boolean =>
	A.isNonEmptyArray(enfantsÀCharge.enfants) &&
	tousLesEnfantsSontValides(enfantsÀCharge.enfants) &&
	pasDePrénomEndouble(enfantsÀCharge.enfants) &&
	estAeeHValide(enfantsÀCharge)

export const tousLesEnfantsSontValides = (enfants: Array<Enfant>): boolean =>
	pipe(enfants, A.every(estEnfantValide))

const estEnfantValide = (enfant: Enfant): enfant is EnfantValide =>
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
	O.isSome(enfantsÀCharge.perçoitAeeH) &&
	(!enfantsÀCharge.perçoitAeeH.value ||
		(enfantsÀCharge.perçoitAeeH.value && O.isSome(enfantsÀCharge.AeeH)))

export const estAeeHInférieurOuÉgalAuNombreDEnfants = (
	enfantsÀCharge: EnfantsÀCharge
): boolean =>
	O.isNone(enfantsÀCharge.AeeH) ||
	enfantsÀCharge.AeeH.value <= enfantsÀCharge.enfants.length

export const estEnfantGardable = (enfant: Enfant): enfant is EnfantValide =>
	estEnfantValide(enfant) && enfantAMoinsDe6Ans(enfant)

export const isEnfantValide = (e: Enfant): e is EnfantValide =>
	O.isSome(e.prénom) && O.isSome(e.dateDeNaissance)

export const enfantAPlusDe3Ans = (enfant: O.Option<Enfant>): boolean =>
	O.isSome(enfant) &&
	O.isSome(enfant.value.dateDeNaissance) &&
	pipe(enfant.value.dateDeNaissance.value, addYears(3), isBefore(DATE_RÉFORME))

export const enfantNéEn = (année: number) => (enfant: Enfant) =>
	O.isSome(enfant.dateDeNaissance) &&
	getYear(enfant.dateDeNaissance.value) === année

export const enfantAMoinsDe6Ans = (enfant: Enfant) =>
	O.isSome(enfant.dateDeNaissance) &&
	pipe(enfant.dateDeNaissance.value, addYears(6), isAfter(DATE_RÉFORME))

export const getEnfantFromPrénom = dual<
	<Prénom extends string>(
		enfants: Array<Enfant<Prénom>>
	) => (prénom: Prénom) => O.Option<Enfant>,
	<Prénom extends string>(
		prénom: Prénom,
		enfants: Array<Enfant<Prénom>>
	) => O.Option<Enfant>
>(
	2,
	<Prénom extends string>(
		prénom: Prénom,
		enfants: Array<Enfant<Prénom>>
	): O.Option<Enfant> =>
		pipe(
			enfants,
			A.findFirst(
				(enfant: Enfant) =>
					O.isSome(enfant.prénom) && enfant.prénom.value === prénom
			)
		)
)
