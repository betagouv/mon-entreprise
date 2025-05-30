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
	DéclarationDeGardeAMA,
	toutesLesDéclarations,
} from './déclaration-de-garde'
import { Enfant, enfantAMoinsDe6Ans, enfantNéEn } from './enfant'
import { Salariée } from './salariée'
import { SituationCMGValide } from './situation'
import {
	détermineLaTypologieDeLaGarde,
	TypologieDeGarde,
} from './typologie-de-garde'

interface Historique<PrénomsEnfants extends string = string> {
	mars: Array<DéclarationDeGarde<PrénomsEnfants>>
	avril: Array<DéclarationDeGarde<PrénomsEnfants>>
	mai: Array<DéclarationDeGarde<PrénomsEnfants>>
}

export const estÉligible = (situation: SituationCMGValide): boolean =>
	CMGPerçu(situation.modesDeGarde) &&
	ressourcesInférieuresAuPlafond(situation.ressources) &&
	nombreDeMoisEmployeureuseSuffisant(situation) &&
	moyenneHeuresDeGardeSupérieureAuPlancher(situation) &&
	auMoinsUnEnfantOuvrantDroitAuCMG(situation)

const CMGPerçu = (modesDeGarde: SituationCMGValide['modesDeGarde']): boolean =>
	pipe(
		modesDeGarde,
		toutesLesDéclarations,
		A.map((d) => O.isSome(d.CMGPerçu) && d.CMGPerçu.value.valeur > 0),
		A.filter(Boolean),
		A.isNonEmptyArray
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
	situation: SituationCMGValide
): boolean => {
	const historique = construireHistorique(situation.modesDeGarde)

	return (
		pipe(
			historique,
			R.map((m) => m.length),
			R.values,
			A.filter(Boolean),
			A.length
		) >= NOMBRE_MIN_MOIS_EMPLOYEUREUSE
	)
}

const construireHistorique = (
	modesDeGarde: SituationCMGValide['modesDeGarde']
): Historique => {
	const salariées = pipe(modesDeGarde, R.values, A.flatten)

	return {
		mars: déclarationsPourLeMois(salariées, 'mars'),
		avril: déclarationsPourLeMois(salariées, 'avril'),
		mai: déclarationsPourLeMois(salariées, 'mai'),
	}
}

const déclarationsPourLeMois = (
	salariées: Array<Salariée>,
	mois: keyof Salariée
): Array<DéclarationDeGarde> =>
	pipe(
		salariées,
		A.map((salariée) => salariée[mois]),
		A.filter(O.isSome),
		A.map((déclaration) => déclaration.value as DéclarationDeGarde)
	)

export const moyenneHeuresDeGardeSupérieureAuPlancher = (
	situation: SituationCMGValide
): boolean =>
	pipe(
		situation.modesDeGarde,
		toutesLesDéclarations,
		moyenneHeuresParTypologieDeGarde(situation.enfantsÀCharge.enfants),
		R.some(
			(moyenneHeuresDeGarde, typologieDeGarde) =>
				moyenneHeuresDeGarde >=
				PLANCHER_HEURES_DE_GARDE_PAR_TYPOLOGIE[typologieDeGarde]
		)
	)

export const moyenneHeuresParTypologieDeGarde =
	(enfants: Record<string, Enfant>) =>
	(
		déclarationsDeGarde: Array<DéclarationDeGarde>
	): Record<TypologieDeGarde, number> =>
		pipe(
			déclarationsDeGarde,
			groupeLesDéclarationsParTypologieDeGarde(enfants),
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
	// Si GED : au moins 1 enfant **à charge** ouvrant droit
	if (A.isNonEmptyArray(situation.modesDeGarde.GED)) {
		return R.some(situation.enfantsÀCharge.enfants, enfantOuvreDroitAuCMG)
	}

	// Si AMA uniquement : au moins 1 enfant **gardé** ouvrant droit
	const enfantsGardésEnAMA = pipe(
		situation.modesDeGarde.AMA,
		A.flatMap((s) => R.values(s)),
		A.filter(O.isSome),
		A.map((d: O.Some<DéclarationDeGardeAMA<string>>) => d.value.enfantsGardés),
		A.flatten,
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
