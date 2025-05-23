import { pipe } from 'effect'
import * as A from 'effect/Array'
import * as N from 'effect/Number'
import * as O from 'effect/Option'
import * as R from 'effect/Record'

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
const DATE_RÉFORME = new Date('2025-09-01')
const ANNÉE_DE_NAISSANCE_EXCLUE = 2022

interface SituationCMG {
	enfantsÀCharge: EnfantsÀCharge
	enfantsGardés: Array<Enfant>
	historique: {
		mars: MoisHistorique
		avril: MoisHistorique
		mai: MoisHistorique
	}
}

export interface EnfantsÀCharge {
	total: number
	AeeH: number
}
interface MoisHistorique {
	droitsOuverts: boolean
	ressources: O.Option<M.Montant<'Euro'>>
	employeureuse: boolean
	modeDeGardes: Array<DéclarationDeGarde>
}

type DéclarationDeGarde = DéclarationDeGardeGED | DéclarationDeGardeAMA
interface DéclarationDeGardeGED {
	type: 'GED'
	heuresDeGarde: number
}
interface DéclarationDeGardeAMA {
	type: 'AMA'
	heuresDeGarde: number
	typologieDeGarde: TypologieDeGardeAMA
}
type TypologieDeGardeAMA =
	| 'AMA Enfant unique 0-3 ans'
	| 'AMA Enfant unique 3-6 ans'
	| 'AMA Fratrie 0-3 ans'
	| 'AMA Fratrie 0-6 ans'

type TypologieDeGarde = TypologieDeGardeAMA | 'GED'

interface Enfant {
	dateDeNaissance: Date
}

export const estÉligible = (situation: SituationCMG): boolean =>
	droitsOuvertsSurAuMoinsUnMois(situation.historique) &&
	ressourcesDeMaiInférieuresAuPlafond(situation.historique) &&
	nombreDeMoisEmployeureuseSuffisant(situation.historique) &&
	moyenneHeuresDeGardeSupérieureAuPlancher(situation.historique) &&
	auMoinsUnEnfantOuvrantDroitAuCMG(situation.enfantsGardés)

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

const nombreDeMoisEmployeureuseSuffisant = (
	historique: SituationCMG['historique']
): boolean => {
	return (
		pipe(
			historique,
			R.map((m) => m.employeureuse && O.isSome(m.ressources)),
			R.values,
			A.filter(Boolean),
			A.length
		) >= NOMBRE_MIN_MOIS_EMPLOYEUREUSE
	)
}

export const moyenneHeuresDeGardeSupérieureAuPlancher = (
	historique: SituationCMG['historique']
): boolean => {
	return pipe(
		historique,
		moyenneHeuresParTypologieDeGarde,
		R.some(
			(moyenneHeuresDeGarde, typologieDeGarde) =>
				moyenneHeuresDeGarde >=
				PLANCHER_HEURES_DE_GARDE_PAR_TYPOLOGIE[typologieDeGarde]
		)
	)
}

export const moyenneHeuresParTypologieDeGarde = (
	historique: SituationCMG['historique']
): Record<TypologieDeGarde, number> => {
	return pipe(
		historique,
		R.values,
		A.flatMap((m) => m.modeDeGardes),
		groupeLesDéclarationsParTypologieDeGarde,
		R.map(faitLaMoyenneDesHeuresDeGarde)
	)
}

const groupeLesDéclarationsParTypologieDeGarde: (
	liste: DéclarationDeGarde[]
) => Record<TypologieDeGarde, DéclarationDeGarde[]> = A.groupBy(
	(d: DéclarationDeGarde): TypologieDeGarde =>
		d.type === 'GED' ? 'GED' : d.typologieDeGarde
)

const faitLaMoyenneDesHeuresDeGarde = (liste: DéclarationDeGarde[]) =>
	pipe(
		liste,
		A.map((d) => d.heuresDeGarde),
		N.sumAll,
		(sum) => Math.ceil(sum / 3)
	)

const auMoinsUnEnfantOuvrantDroitAuCMG = (
	enfantsGardés: Array<Enfant>
): boolean => A.some(enfantsGardés, enfantOuvreDroitAuCMG)

export const enfantOuvreDroitAuCMG = (enfant: Enfant): boolean => {
	if (enfant.dateDeNaissance.getFullYear() === ANNÉE_DE_NAISSANCE_EXCLUE) {
		return false
	}

	const date6Ans = new Date(enfant.dateDeNaissance.valueOf())
	date6Ans.setFullYear(enfant.dateDeNaissance.getFullYear() + 6)

	return date6Ans > DATE_RÉFORME
}
