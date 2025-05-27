import { pipe } from 'effect'
import * as A from 'effect/Array'
import * as N from 'effect/Number'
import * as O from 'effect/Option'
import { and, not } from 'effect/Predicate'
import * as R from 'effect/Record'

import * as M from '@/domaine/Montant'

import {
	DéclarationDeGarde,
	déclarationDeGardeEstAMA,
	déclarationDeGardeEstGED,
} from './déclaration-de-garde'
import { Enfant, enfantAMoinsDe6Ans, enfantNéEn } from './enfant'
import { SituationCMG } from './situationCMG'
import {
	détermineLaTypologieDeLaGarde,
	TypologieDeGarde,
} from './typologie-de-garde'

const PLAFOND_DE_RESSOURCES = M.euros(8_500)
const NOMBRE_MIN_MOIS_EMPLOYEUREUSE = 2
const PLANCHER_HEURES_DE_GARDE_PAR_TYPOLOGIE: Record<TypologieDeGarde, number> =
	{
		'AMA Enfant unique 0-3 ans': 100,
		'AMA Enfant unique 3-6 ans': 50,
		'AMA Fratrie 0-3 ans': 150,
		'AMA Fratrie 0-6 ans': 100,
		GED: 50,
	}
const ANNÉE_DE_NAISSANCE_EXCLUE = 2022

export const estÉligible = (situation: SituationCMG): boolean =>
	droitsOuvertsSurAuMoinsUnMois(situation.historique) &&
	ressourcesDeMaiInférieuresAuPlafond(situation.historique) &&
	nombreDeMoisEmployeureuseEtRessourcesSuffisant(situation.historique) &&
	moyenneHeuresDeGardeSupérieureAuPlancher(situation) &&
	auMoinsUnEnfantOuvrantDroitAuCMG(situation)

const droitsOuvertsSurAuMoinsUnMois = (
	historique: SituationCMG['historique']
): boolean =>
	pipe(
		historique,
		R.map((m) => m.droitsOuverts),
		R.values,
		A.filter(Boolean),
		A.isNonEmptyArray
	)

const ressourcesDeMaiInférieuresAuPlafond = (
	historique: SituationCMG['historique']
): boolean => {
	if (O.isNone(historique.mai.ressources)) {
		return false
	}

	return pipe(
		historique.mai.ressources.value,
		M.estPlusPetitQue(PLAFOND_DE_RESSOURCES)
	)
}

const nombreDeMoisEmployeureuseEtRessourcesSuffisant = (
	historique: SituationCMG['historique']
): boolean => {
	return (
		pipe(
			historique,
			R.map((m) => m.déclarationsDeGarde.length && O.isSome(m.ressources)),
			R.values,
			A.filter(Boolean),
			A.length
		) >= NOMBRE_MIN_MOIS_EMPLOYEUREUSE
	)
}

export const moyenneHeuresDeGardeSupérieureAuPlancher = (
	situation: SituationCMG
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
	situation: SituationCMG
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
	situation: SituationCMG
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
