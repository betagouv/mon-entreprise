import { pipe } from 'effect'
import * as A from 'effect/Array'
import * as N from 'effect/Number'
import * as O from 'effect/Option'
import { and, not } from 'effect/Predicate'
import * as R from 'effect/Record'

import * as M from '@/domaine/Montant'

import {
	ANNÉE_DE_NAISSANCE_EXCLUE,
	MAJORATION_PAR_ENFANT,
	MAJORATION_PARENT_ISOLÉ,
	NOMBRE_MIN_MOIS_EMPLOYEUREUSE,
	PLAFOND_DE_RESSOURCES_COUPLE_1_ENFANT,
	PLANCHER_HEURES_DE_GARDE_PAR_TYPOLOGIE,
} from './constantes'
import {
	DéclarationDeGarde,
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

interface Éligibilité {
	estÉligible: boolean
	raisonsInéligibilité: Array<RaisonInéligibilité>
}
type RaisonInéligibilité =
	| 'CMG-perçu'
	| 'ressources'
	| 'déclarations'
	| 'heures-de-garde'
	| 'enfants'

export const éligibilité = (situation: SituationCMGValide): Éligibilité => {
	let estÉligible = true
	const raisonsInéligibilité = []

	if (!CMGPerçu(situation.modesDeGarde)) {
		estÉligible = false
		raisonsInéligibilité.push('CMG-perçu')
	}

	if (!ressourcesInférieuresAuPlafond(situation)) {
		estÉligible = false
		raisonsInéligibilité.push('ressources')
	}

	if (!nombreDeMoisEmployeureuseSuffisant(situation)) {
		estÉligible = false
		raisonsInéligibilité.push('déclarations')
	}

	if (!moyenneHeuresDeGardeSupérieureAuPlancher(situation)) {
		estÉligible = false
		raisonsInéligibilité.push('heures-de-garde')
	}

	if (!auMoinsUnEnfantOuvrantDroitAuCMG(situation)) {
		estÉligible = false
		raisonsInéligibilité.push('enfants')
	}

	return {
		estÉligible,
		raisonsInéligibilité: raisonsInéligibilité as Array<RaisonInéligibilité>,
	}
}

const CMGPerçu = (modesDeGarde: SituationCMGValide['modesDeGarde']): boolean =>
	pipe(
		modesDeGarde,
		toutesLesDéclarations,
		A.map((d) => O.isSome(d.CMGPerçu) && d.CMGPerçu.value.valeur > 0),
		A.filter(Boolean),
		A.isNonEmptyArray
	)

const ressourcesInférieuresAuPlafond = (
	situation: SituationCMGValide
): boolean =>
	pipe(
		situation.ressources.value,
		M.estPlusPetitOuÉgalÀ(
			plafondDeRessources(
				R.size(situation.enfantsÀCharge.enfants),
				situation.parentIsolé.value
			)
		)
	)

export const plafondDeRessources = (nbEnfants: number, parentIsolé: boolean) =>
	pipe(
		PLAFOND_DE_RESSOURCES_COUPLE_1_ENFANT,
		M.plus(M.fois(MAJORATION_PAR_ENFANT, nbEnfants - 1)),
		M.fois(parentIsolé ? MAJORATION_PARENT_ISOLÉ : 1)
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
		A.getSomes
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
		A.getSomes,
		A.map((d) => d.enfantsGardés),
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
