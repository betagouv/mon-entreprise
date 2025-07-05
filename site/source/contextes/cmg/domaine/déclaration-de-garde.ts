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
	heuresDeGarde: O.Option<number>
	rémunération: O.Option<M.Montant<'€'>>
	CMGPerçu: O.Option<M.Montant<'€'>>
}

export interface DéclarationDeGardeAMA<PrénomsEnfants extends string> {
	type: 'AMA'
	heuresDeGarde: O.Option<number>
	rémunération: O.Option<M.Montant<'€'>>
	enfantsGardés: Array<PrénomsEnfants>
	CMGPerçu: O.Option<M.Montant<'€'>>
}

const estOptionVide = (option: O.Option<unknown>): boolean =>
	O.isNone(option) || (O.isSome(option) && !option.value)

export const estDéclarationGEDVide = (
	déclaration: O.Option<DéclarationDeGardeGED>
): boolean =>
	O.isSome(déclaration) &&
	estOptionVide(déclaration.value.heuresDeGarde) &&
	estOptionVide(déclaration.value.rémunération) &&
	estOptionVide(déclaration.value.CMGPerçu)

export const estDéclarationAMAVide = (
	déclaration: O.Option<DéclarationDeGardeAMA<string>>
): boolean =>
	O.isSome(déclaration) &&
	A.isEmptyArray(déclaration.value.enfantsGardés) &&
	estOptionVide(déclaration.value.heuresDeGarde) &&
	estOptionVide(déclaration.value.rémunération) &&
	estOptionVide(déclaration.value.CMGPerçu)

export const estDéclarationDeGardeGEDValide = ({
	heuresDeGarde,
	rémunération,
}: DéclarationDeGardeGED): boolean =>
	O.isSome(heuresDeGarde) &&
	heuresDeGarde.value > 0 &&
	O.isSome(rémunération) &&
	M.estPositif(rémunération.value)

export const estDéclarationDeGardeAMAValide = ({
	heuresDeGarde,
	rémunération,
	enfantsGardés,
}: DéclarationDeGardeAMA<string>): boolean =>
	estDéclarationDeGardeGEDValide({
		heuresDeGarde,
		rémunération,
	} as DéclarationDeGardeGED) && A.isNonEmptyArray(enfantsGardés)

export const toutesLesDéclarations = (
	salariées: SituationCMGValide['salariées']
): Array<DéclarationDeGarde> =>
	pipe(
		salariées,
		R.values,
		A.flatten,
		A.flatMap((s: Salariée) => R.values(s)),
		A.getSomes
	)
