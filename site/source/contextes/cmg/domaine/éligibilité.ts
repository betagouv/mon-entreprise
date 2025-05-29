import { pipe } from 'effect'
import * as A from 'effect/Array'
import * as N from 'effect/Number'
import * as O from 'effect/Option'
import { and, not } from 'effect/Predicate'
import * as R from 'effect/Record'

import * as M from '@/domaine/Montant'

import {
	ANNÉE_DE_NAISSANCE_EXCLUE,
	NOMBRE_MIN_MOIS_EMPLOYEUREUSE,
	PLAFOND_DE_RESSOURCES,
	PLANCHER_HEURES_DE_GARDE_PAR_TYPOLOGIE,
} from './constantes'
import {
	DéclarationDeGarde,
	déclarationDeGardeEstAMA,
	déclarationDeGardeEstGED,
} from './déclaration-de-garde'
import { Enfant, enfantAMoinsDe6Ans, enfantNéEn } from './enfant'
import { SituationCMGValide } from './situation'
import {
	détermineLaTypologieDeLaGarde,
	TypologieDeGarde,
} from './typologie-de-garde'

export const estÉligible = (situation: SituationCMGValide): boolean =>
	CMGPerçu(situation.historique) &&
	ressourcesInférieuresAuPlafond(situation.ressources) &&
	nombreDeMoisEmployeureuseSuffisant(situation.historique) &&
	moyenneHeuresDeGardeSupérieureAuPlancher(situation) &&
	auMoinsUnEnfantOuvrantDroitAuCMG(situation)

const CMGPerçu = (historique: SituationCMGValide['historique']): boolean =>
	pipe(
		historique,
		R.values,
		A.flatMap((m) => m.déclarationsDeGarde),
		A.some((d: DéclarationDeGarde) => O.isSome(d.CMGPerçu))
	)

const ressourcesInférieuresAuPlafond = (
	ressources: SituationCMGValide['ressources']
): boolean =>
	pipe(
		ressources.value,
		M.toEurosParMois,
		M.estPlusPetitQue(PLAFOND_DE_RESSOURCES)
	)

const nombreDeMoisEmployeureuseSuffisant = (
	historique: SituationCMGValide['historique']
): boolean => {
	return (
		pipe(
			historique,
			R.map((m) => m.déclarationsDeGarde.length),
			R.values,
			A.filter(Boolean),
			A.length
		) >= NOMBRE_MIN_MOIS_EMPLOYEUREUSE
	)
}

export const moyenneHeuresDeGardeSupérieureAuPlancher = (
	situation: SituationCMGValide
): boolean => {
	return pipe(
		situation,
		moyenneHeuresParTypologieDeGarde,
		R.some(
			(moyenneHeuresDeGarde, typologieDeGarde) =>
				moyenneHeuresDeGarde >=
				PLANCHER_HEURES_DE_GARDE_PAR_TYPOLOGIE[typologieDeGarde]
		)
	)
}

export const moyenneHeuresParTypologieDeGarde = (
	situation: SituationCMGValide
): Record<TypologieDeGarde, number> =>
	pipe(
		situation.historique,
		R.values,
		A.flatMap((m) => m.déclarationsDeGarde),
		groupeLesDéclarationsParTypologieDeGarde(situation.enfantsÀCharge.enfants),
		R.map(faitLaMoyenneDesHeuresDeGarde)
	)

const groupeLesDéclarationsParTypologieDeGarde =
	<Prénom extends string>(enfants: Record<Prénom, Enfant>) =>
	(
		liste: DéclarationDeGarde<Prénom>[]
	): Record<TypologieDeGarde, DéclarationDeGarde[]> =>
		A.groupBy(liste, détermineLaTypologieDeLaGarde(enfants))

const faitLaMoyenneDesHeuresDeGarde = (liste: DéclarationDeGarde[]) =>
	pipe(
		liste,
		A.map((d) => d.heuresDeGarde),
		N.sumAll,
		(sum) => Math.ceil(sum / 3)
	)

export const auMoinsUnEnfantOuvrantDroitAuCMG = (
	situation: SituationCMGValide
): boolean => {
	const gardeGED = pipe(
		situation.historique,
		R.values,
		A.flatMap((m) => m.déclarationsDeGarde),
		A.some(déclarationDeGardeEstGED)
	)
	if (gardeGED) {
		return R.some(situation.enfantsÀCharge.enfants, enfantOuvreDroitAuCMG)
	}
	const enfantsGardésEnAMA = pipe(
		situation.historique,
		R.values,
		A.flatMap((m) => m.déclarationsDeGarde),
		A.filter(déclarationDeGardeEstAMA),
		A.flatMap((d) => d.enfantsGardés),
		A.dedupe,
		R.fromIterableWith((prénom) => [
			prénom,
			situation.enfantsÀCharge.enfants[prénom],
		])
	)

	return R.some(enfantsGardésEnAMA, enfantOuvreDroitAuCMG)
}

export const enfantOuvreDroitAuCMG = and<Enfant>(
	not(enfantNéEn(ANNÉE_DE_NAISSANCE_EXCLUE)),
	enfantAMoinsDe6Ans
)
