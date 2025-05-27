import { addYears, getYear, isAfter, isBefore } from 'date-fns/fp'
import { pipe } from 'effect'

import { DATE_RÉFORME } from '@/contextes/cmg/domaine/constantes'

export interface Enfant {
	dateDeNaissance: Date
}

export const enfantAPlusDe3Ans = (enfant: Enfant): boolean =>
	pipe(enfant.dateDeNaissance, addYears(3), isBefore(DATE_RÉFORME))

export const enfantNéEn = (année: number) => (enfant: Enfant) =>
	getYear(enfant.dateDeNaissance) === année

export const enfantAMoinsDe6Ans = (enfant: Enfant) =>
	pipe(enfant.dateDeNaissance, addYears(6), isAfter(DATE_RÉFORME))
