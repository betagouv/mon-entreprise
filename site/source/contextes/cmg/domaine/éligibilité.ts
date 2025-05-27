import { pipe } from 'effect'
import * as A from 'effect/Array'
import * as N from 'effect/Number'
import * as O from 'effect/Option'
import { and, not } from 'effect/Predicate'
import * as R from 'effect/Record'

import {
	déclarationDeGardeEstAMA,
	déclarationDeGardeEstGED,
} from '@/contextes/cmg/domaine/déclaration-de-garde'
import {
	Enfant,
	enfantAMoinsDe6Ans,
	enfantAPlusDe3Ans,
	enfantNéEn,
} from '@/contextes/cmg/domaine/enfant'
import * as M from '@/domaine/Montant'

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

export interface SituationCMG<PrénomsEnfants extends string = string> {
	enfantsÀCharge: EnfantsÀCharge<PrénomsEnfants>
	historique: {
		mars: MoisHistorique<PrénomsEnfants>
		avril: MoisHistorique<PrénomsEnfants>
		mai: MoisHistorique<PrénomsEnfants>
	}
}

export interface EnfantsÀCharge<Prénom extends string = string> {
	enfants: Record<Prénom, Enfant>
	AeeH: number
}

export interface MoisHistorique<PrénomsEnfants extends string = string> {
	// TODO: à remplacer par l'utilisation de déclarationDeGarde.CMGPerçu
	droitsOuverts: boolean
	ressources: O.Option<M.Montant<'Euro'>>
	déclarationsDeGarde: Array<DéclarationDeGarde<PrénomsEnfants>>
}

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
type TypologieDeGardeAMA =
	| 'AMA Enfant unique 0-3 ans'
	| 'AMA Enfant unique 3-6 ans'
	| 'AMA Fratrie 0-3 ans'
	| 'AMA Fratrie 0-6 ans'

type TypologieDeGarde = TypologieDeGardeAMA | 'GED'

export type Salariée = SalariéeAMA | SalariéeGED

export interface SalariéeAMA {
	type: 'AMA'
	salaireNet: number
	indemnitésEntretien: number
	fraisDeRepas: number
}
interface SalariéeGED {
	type: 'GED'
	salaireNet: number
}

export type ModeDeGarde = 'AMA' | 'GED'

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

const détermineLaTypologieDeLaGarde =
	<Prénom extends string>(enfants: Record<Prénom, Enfant>) =>
	(déclarationDeGarde: DéclarationDeGarde<Prénom>): TypologieDeGarde => {
		if (déclarationDeGarde.type === 'GED') {
			return 'GED'
		}

		if (déclarationDeGarde.enfantsGardés.length > 1) {
			const unEnfantDePlusDe3Ans = déclarationDeGarde.enfantsGardés.some(
				(prénom: Prénom) => enfantAPlusDe3Ans(enfants[prénom])
			)
			if (unEnfantDePlusDe3Ans) {
				return 'AMA Fratrie 0-6 ans'
			} else {
				return 'AMA Fratrie 0-3 ans'
			}
		} else {
			const prénom = déclarationDeGarde.enfantsGardés[0]
			if (enfantAPlusDe3Ans(enfants[prénom])) {
				return 'AMA Enfant unique 3-6 ans'
			} else {
				return 'AMA Enfant unique 0-3 ans'
			}
		}
	}

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
