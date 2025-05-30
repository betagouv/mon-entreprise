import { pipe } from 'effect'
import * as A from 'effect/Array'
import * as O from 'effect/Option'
import * as R from 'effect/Record'

import * as M from '@/domaine/Montant'

import { Salariée } from './salariée'
import { SituationCMGValide } from './situation'

export type DéclarationDeGarde<PrénomsEnfants extends string = string> =
	| DéclarationDeGardeGED
	| DéclarationDeGardeAMA<PrénomsEnfants>

export interface DéclarationDeGardeGED {
	type: 'GED'
	heuresDeGarde: number
	rémunération: M.Montant<'Euro'>
	CMGPerçu: O.Option<M.Montant<'Euro'>>
}

export interface DéclarationDeGardeAMA<PrénomsEnfants extends string> {
	type: 'AMA'
	heuresDeGarde: number
	rémunération: M.Montant<'Euro'>
	enfantsGardés: Array<PrénomsEnfants>
	CMGPerçu: O.Option<M.Montant<'Euro'>>
}

export const toutesLesDéclarations = (
	modesDeGarde: SituationCMGValide['modesDeGarde']
): Array<DéclarationDeGarde> =>
	pipe(
		modesDeGarde,
		R.values,
		A.flatten,
		A.flatMap((s: Salariée) => R.values(s)),
		A.filter(O.isSome),
		A.map((d: O.Some<DéclarationDeGarde>) => d.value)
	)
