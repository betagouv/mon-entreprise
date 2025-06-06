import { addYears, getYear, isAfter, isBefore } from 'date-fns/fp'
import { pipe } from 'effect'
import * as O from 'effect/Option'

import { DATE_RÉFORME } from './constantes'

export interface EnfantsÀCharge<Prénom extends string = string> {
	enfants: Record<Prénom, Enfant>
	perçoitAeeH: O.Option<boolean>
	AeeH: O.Option<number>
}

export interface Enfant {
	prénom: O.Option<string>
	dateDeNaissance: O.Option<Date>
}

export interface EnfantValide extends Enfant {
	prénom: O.Some<string>
	dateDeNaissance: O.Some<Date>
}

function estEnfantValide(enfant: Enfant): enfant is EnfantValide {
	return O.isSome(enfant.prénom) && O.isSome(enfant.dateDeNaissance)
}

export function estEnfantGardable(enfant: Enfant): enfant is EnfantValide {
	return estEnfantValide(enfant) && enfantAMoinsDe6Ans(enfant)
}

export const isEnfantValide = (e: Enfant): e is EnfantValide =>
	O.isSome(e.prénom) && O.isSome(e.dateDeNaissance)

export const enfantAPlusDe3Ans = (enfant: Enfant): boolean =>
	O.isSome(enfant.dateDeNaissance) &&
	pipe(enfant.dateDeNaissance.value, addYears(3), isBefore(DATE_RÉFORME))

export const enfantNéEn = (année: number) => (enfant: Enfant) =>
	O.isSome(enfant.dateDeNaissance) &&
	getYear(enfant.dateDeNaissance.value) === année

export const enfantAMoinsDe6Ans = (enfant: Enfant) =>
	O.isSome(enfant.dateDeNaissance) &&
	pipe(enfant.dateDeNaissance.value, addYears(6), isAfter(DATE_RÉFORME))
