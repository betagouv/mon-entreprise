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
} from './déclaration-de-garde'
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

export const auMoinsUneDéclaration = (salariée: Salariée): boolean =>
	R.some(salariée, O.isSome)

export const estSalariéeGEDValide = (salariée: SalariéeGED): boolean =>
	auMoinsUneDéclaration(salariée) &&
	pipe(salariée, R.getSomes, R.every(estDéclarationDeGardeGEDValide))

export const estSalariéeAMAValide = (salariée: SalariéeAMA<string>): boolean =>
	auMoinsUneDéclaration(salariée) &&
	pipe(salariée, R.getSomes, R.every(estDéclarationDeGardeAMAValide))

export const estSalariéesValide = (
	salariées: SituationCMG['salariées']
): boolean =>
	auMoinsUneSalariée(salariées) &&
	chaqueSalariéeAAuMoinsUneDéclaration(salariées) &&
	chaqueSalariéeAMAEstValide(salariées) &&
	chaqueSalariéeGEDEstValide(salariées)

export const auMoinsUneSalariée = (
	salariées: SituationCMG['salariées']
): boolean =>
	A.isNonEmptyArray(salariées.AMA) || A.isNonEmptyArray(salariées.GED)

export const chaqueSalariéeAAuMoinsUneDéclaration = (
	salariées: SituationCMG['salariées']
): boolean =>
	pipe(salariées.AMA, A.every(auMoinsUneDéclaration)) &&
	pipe(salariées.GED, A.every(auMoinsUneDéclaration))

export const chaqueSalariéeAMAEstValide = (
	salariées: SituationCMG['salariées']
): boolean =>
	salariées.AMA.every((salariée) =>
		pipe(
			salariée,
			R.every(
				(déclaration) =>
					O.isNone(déclaration) ||
					estDéclarationDeGardeAMAValide(déclaration.value)
			)
		)
	)

export const chaqueSalariéeGEDEstValide = (
	salariées: SituationCMG['salariées']
): boolean =>
	salariées.GED.every((salariée) =>
		pipe(
			salariée,
			R.every(
				(déclaration) =>
					O.isNone(déclaration) ||
					estDéclarationDeGardeGEDValide(déclaration.value)
			)
		)
	)
