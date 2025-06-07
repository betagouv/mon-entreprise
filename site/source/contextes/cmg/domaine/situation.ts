import { pipe } from 'effect'
import * as A from 'effect/Array'
import * as O from 'effect/Option'
import * as R from 'effect/Record'

import * as M from '@/domaine/Montant'
import { Situation } from '@/domaine/Situation'

import {
	estDéclarationDeGardeAMAValide,
	estDéclarationDeGardeGEDValide,
} from './déclaration-de-garde'
import { EnfantsÀCharge } from './enfant'
import {
	auMoinsUneDéclaration,
	estSalariéeAMAValide,
	estSalariéeGEDValide,
	SalariéeAMA,
	SalariéeGED,
} from './salariée'

export interface SituationCMG<PrénomsEnfants extends string = string>
	extends Situation {
	aPerçuCMG: O.Option<boolean>
	plusDe2MoisDeDéclaration: O.Option<boolean>
	parentIsolé: O.Option<boolean>
	ressources: O.Option<M.Montant<'EuroParAn'>>
	enfantsÀCharge: EnfantsÀCharge<PrénomsEnfants>
	modesDeGarde: {
		GED: Array<SalariéeGED>
		AMA: Array<SalariéeAMA<PrénomsEnfants>>
	}
}

export interface SituationCMGValide extends SituationCMG {
	aPerçuCMG: O.Some<boolean>
	plusDe2MoisDeDéclaration: O.Some<boolean>
	parentIsolé: O.Some<boolean>
	ressources: O.Some<M.Montant<'EuroParAn'>>
}

export const estSituationCMGValide = (
	situation: SituationCMG
): situation is SituationCMGValide =>
	O.isSome(situation.aPerçuCMG) &&
	O.isSome(situation.plusDe2MoisDeDéclaration) &&
	O.isSome(situation.parentIsolé) &&
	O.isSome(situation.ressources) &&
	O.isSome(situation.enfantsÀCharge.perçoitAeeH) &&
	!!R.size(situation.enfantsÀCharge.enfants) &&
	(A.isNonEmptyArray(situation.modesDeGarde.AMA) ||
		A.isNonEmptyArray(situation.modesDeGarde.GED)) &&
	A.every(situation.modesDeGarde.AMA, estSalariéeAMAValide) &&
	A.every(situation.modesDeGarde.GED, estSalariéeGEDValide)

export const initialSituationCMG: SituationCMG = {
	_tag: 'Situation',
	aPerçuCMG: O.none(),
	plusDe2MoisDeDéclaration: O.none(),
	parentIsolé: O.none(),
	ressources: O.none(),
	enfantsÀCharge: {
		enfants: {},
		perçoitAeeH: O.none(),
		AeeH: O.none(),
	},
	modesDeGarde: {
		GED: [],
		AMA: [],
	},
}

export const estModesDeGardeValide = (
	modesDeGarde: SituationCMG['modesDeGarde']
): boolean =>
	// Il y a au moins une salariée
	(A.isNonEmptyArray(modesDeGarde.AMA) ||
		A.isNonEmptyArray(modesDeGarde.GED)) &&
	// et chaque salariée a au moins une déclaration
	pipe(modesDeGarde.AMA, A.every(auMoinsUneDéclaration)) &&
	pipe(modesDeGarde.GED, A.every(auMoinsUneDéclaration)) &&
	// et chaque déclaration est soit vide, soit valide.
	modesDeGarde.AMA.every((déclarations) =>
		R.every(
			déclarations,
			(déclaration) =>
				O.isNone(déclaration) ||
				estDéclarationDeGardeAMAValide(déclaration.value)
		)
	) &&
	modesDeGarde.GED.every((déclarations) =>
		R.every(
			déclarations,
			(déclaration) =>
				O.isNone(déclaration) ||
				estDéclarationDeGardeGEDValide(déclaration.value)
		)
	)
