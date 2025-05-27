import * as O from 'effect/Option'

import * as M from '@/domaine/Montant'

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

export const déclarationDeGardeEstAMA = <Prénom extends string = string>(
	d: DéclarationDeGarde
): d is DéclarationDeGardeAMA<Prénom> => d.type === 'AMA'

export const déclarationDeGardeEstGED = (
	d: DéclarationDeGarde
): d is DéclarationDeGardeGED => d.type === 'GED'
