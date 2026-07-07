import { pipe } from 'effect'
import * as A from 'effect/Array'
import * as O from 'effect/Option'
import * as R from 'effect/Record'

import {
	DéclarationDeGarde,
	DéclarationDeGardeAMA,
	DéclarationDeGardeGED,
	estDéclarationDeGardeAMAValide,
	estDéclarationDeGardeGEDValide,
} from './declaration-de-garde'
import { SituationCMG } from './situation'

export interface Salariée {
	mars: O.Option<DéclarationDeGarde>
	avril: O.Option<DéclarationDeGarde>
	mai: O.Option<DéclarationDeGarde>
}
export interface SalariéeGED {
	mars: O.Option<DéclarationDeGardeGED>
	avril: O.Option<DéclarationDeGardeGED>
	mai: O.Option<DéclarationDeGardeGED>
}
export interface SalariéeAMA<PrénomsEnfants extends string> {
	mars: O.Option<DéclarationDeGardeAMA<PrénomsEnfants>>
	avril: O.Option<DéclarationDeGardeAMA<PrénomsEnfants>>
	mai: O.Option<DéclarationDeGardeAMA<PrénomsEnfants>>
}

export const auMoinsUneDéclaration = (salariee: Salariée): boolean =>
	R.some(salariee, O.isSome)

export const estSalariéeGEDValide = (salariee: SalariéeGED): boolean =>
	auMoinsUneDéclaration(salariee) &&
	pipe(salariee, R.getSomes, R.every(estDéclarationDeGardeGEDValide))

export const estSalariéeAMAValide = (salariee: SalariéeAMA<string>): boolean =>
	auMoinsUneDéclaration(salariee) &&
	pipe(salariee, R.getSomes, R.every(estDéclarationDeGardeAMAValide))

export const estSalariéesValide = (
	salariees: SituationCMG['salariees']
): boolean =>
	auMoinsUneSalariée(salariees) &&
	chaqueSalariéeAAuMoinsUneDéclaration(salariees) &&
	chaqueSalariéeAMAEstValide(salariees) &&
	chaqueSalariéeGEDEstValide(salariees)

export const auMoinsUneSalariée = (
	salariees: SituationCMG['salariees']
): boolean =>
	A.isNonEmptyArray(salariees.AMA) || A.isNonEmptyArray(salariees.GED)

export const chaqueSalariéeAAuMoinsUneDéclaration = (
	salariees: SituationCMG['salariees']
): boolean =>
	pipe(salariees.AMA, A.every(auMoinsUneDéclaration)) &&
	pipe(salariees.GED, A.every(auMoinsUneDéclaration))

export const chaqueSalariéeAMAEstValide = (
	salariees: SituationCMG['salariees']
): boolean =>
	salariees.AMA.every((salariee) =>
		pipe(
			salariee,
			R.every(
				(declaration) =>
					O.isNone(declaration) ||
					estDéclarationDeGardeAMAValide(declaration.value)
			)
		)
	)

export const chaqueSalariéeGEDEstValide = (
	salariees: SituationCMG['salariees']
): boolean =>
	salariees.GED.every((salariee) =>
		pipe(
			salariee,
			R.every(
				(declaration) =>
					O.isNone(declaration) ||
					estDéclarationDeGardeGEDValide(declaration.value)
			)
		)
	)
