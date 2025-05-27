import { addYears, getYear, isAfter, isBefore } from 'date-fns/fp'
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

interface SituationCMG<PrénomsEnfants extends string = string> {
	enfantsÀCharge: EnfantsÀCharge<PrénomsEnfants>
	historique: {
		mars: MoisHistorique<PrénomsEnfants>
		avril: MoisHistorique<PrénomsEnfants>
		mai: MoisHistorique<PrénomsEnfants>
	}
}

export interface EnfantsÀCharge<Prénom extends string = string> {
	enfants: Record<Prénom,Enfant>
	AeeH: number
}

export interface MoisHistorique<PrénomsEnfants extends string = string> {
	droitsOuverts: boolean
	ressources: O.Option<M.Montant<'Euro'>>
	déclarationsDeGarde: Array<DéclarationDeGarde<PrénomsEnfants>>
	// salariées: Array<Salariée>
}

export type DéclarationDeGarde<PrénomsEnfants extends string = string> = DéclarationDeGardeGED | DéclarationDeGardeAMA<PrénomsEnfants>

export interface DéclarationDeGardeGED {
	type: 'GED'
	heuresDeGarde: number
}
export interface DéclarationDeGardeAMA<PrénomsEnfants extends string> {
	type: 'AMA'
	heuresDeGarde: number
	enfantsGardés: Array<PrénomsEnfants>
}
export interface Enfant {
	dateDeNaissance: Date
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
	situation: SituationCMG,
): Record<TypologieDeGarde, number> => pipe(
	situation.historique,
	R.values,
	A.flatMap((m) => m.déclarationsDeGarde),
	groupeLesDéclarationsParTypologieDeGarde(situation.enfantsÀCharge.enfants),
	R.map(faitLaMoyenneDesHeuresDeGarde)
)

const détermineLaTypologieDeLaGarde = <Prénom extends string>(enfants: Record<Prénom, Enfant>) => 
	(déclarationDeGarde: DéclarationDeGarde<Prénom>): TypologieDeGarde => {
	if (déclarationDeGarde.type === 'GED') {
		return 'GED'
	}

	let typologie = 'AMA'
	if (déclarationDeGarde.enfantsGardés.length > 1) {
		typologie += ' Fratrie'
		const unEnfantDePlusDe3Ans = déclarationDeGarde.enfantsGardés.some((prénom: Prénom) => enfantAPlusDe3Ans(enfants[prénom]))
		if (unEnfantDePlusDe3Ans) {
			typologie += ' 0-6 ans'
		} else {
			typologie += ' 0-3 ans'
		}
	} else {
		typologie += ' Enfant unique'
		const prénom = déclarationDeGarde.enfantsGardés[0]

		const enfant = enfants[prénom]
		if (enfantAPlusDe3Ans(enfant)) {
			typologie += ' 3-6 ans'
		} else {
			typologie += ' 0-3 ans'
		}
	}

	return typologie as TypologieDeGarde
}

const groupeLesDéclarationsParTypologieDeGarde =  <Prénom extends string>(enfants: Record<Prénom, Enfant>) => 
	(liste: DéclarationDeGarde<Prénom>[]): Record<TypologieDeGarde, DéclarationDeGarde[]> => 
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
		A.some((d: DéclarationDeGarde) => d.type === 'GED')
	)

	if (gardeGED) {
		return R.some(situation.enfantsÀCharge.enfants, enfantOuvreDroitAuCMG)
	}

	// console.log(gardeGED)
	// TODO: déterminer l'ouverture des droits pour AMA

	return true
}

export const enfantOuvreDroitAuCMG = (enfant: Enfant): boolean =>
	getYear(enfant.dateDeNaissance) !== ANNÉE_DE_NAISSANCE_EXCLUE &&
	pipe(enfant.dateDeNaissance, addYears(6), isAfter(DATE_RÉFORME))

const enfantAPlusDe3Ans = (enfant: Enfant): boolean =>
	pipe(enfant.dateDeNaissance, addYears(3), isBefore(DATE_RÉFORME))
