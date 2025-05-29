import { addYears, getYear, isAfter, isBefore } from 'date-fns/fp'
import { pipe } from 'effect'
import * as O from 'effect/Option'

import { DATE_RÉFORME } from './constantes'

export interface EnfantsÀCharge<Prénom extends string = string> {
	enfants: Record<Prénom, Enfant>
	AeeH: O.Option<number>
}

export interface Enfant {
	dateDeNaissance: Date
}

export const enfantAPlusDe3Ans = (enfant: Enfant): boolean =>
	pipe(enfant.dateDeNaissance, addYears(3), isBefore(DATE_RÉFORME))

export const enfantNéEn = (année: number) => (enfant: Enfant) =>
	getYear(enfant.dateDeNaissance) === année

export const enfantAMoinsDe6Ans = (enfant: Enfant) =>
	pipe(enfant.dateDeNaissance, addYears(6), isAfter(DATE_RÉFORME))
