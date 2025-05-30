import * as O from 'effect/Option'

import {
	DéclarationDeGarde,
	DéclarationDeGardeAMA,
	DéclarationDeGardeGED,
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
