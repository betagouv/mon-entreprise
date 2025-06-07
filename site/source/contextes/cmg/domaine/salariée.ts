import { pipe } from 'effect'
import * as O from 'effect/Option'
import * as R from 'effect/Record'

import {
	DéclarationDeGarde,
	DéclarationDeGardeAMA,
	DéclarationDeGardeGED,
	estDéclarationDeGardeAMAValide,
	estDéclarationDeGardeGEDValide,
} from './déclaration-de-garde'

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
