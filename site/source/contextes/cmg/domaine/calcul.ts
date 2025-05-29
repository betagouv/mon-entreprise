import { pipe } from 'effect'
import * as A from 'effect/Array'
import * as N from 'effect/Number'
import * as O from 'effect/Option'
import * as R from 'effect/Record'

import * as M from '@/domaine/Montant'
import { round } from '@/utils/number'

import { DéclarationDeGarde } from './déclaration-de-garde'
import { EnfantsÀCharge } from './enfant'
import { ModeDeGarde } from './mode-de-garde'
import { SituationCMG } from './situationCMG'

const TEH_PAR_GARDE_ET_NB_ENFANTS = {
	AMA: {
		1: 0.0619,
		2: 0.0516,
		3: 0.0413,
		4: 0.031,
		8: 0.0206,
	},
	GED: {
		1: 0.1238,
		2: 0.1032,
		3: 0.0826,
		4: 0.062,
		8: 0.0412,
	},
}

const COÛT_HORAIRE_MAXIMAL = {
	AMA: 8,
	GED: 15,
}
const COÛT_HORAIRE_MÉDIAN = {
	AMA: 4.85,
	GED: 10.38,
}

// TODO: à finir
// export const calculeComplémentTransitoire = (situation: SituationCMG) => {
// 	const ancienCMGMensuelMoyen = moyenneCMGPerçus(situation.historique)
// 	const CMGRLinéariséMoyen = moyenneCMGRLinéarisés(situation)
// }

export const moyenneCMGPerçus = (historique: SituationCMG['historique']) =>
	pipe(
		historique,
		R.values,
		A.flatMap((m) => m.déclarationsDeGarde),
		A.map((d) => O.getOrElse(d.CMGPerçu, () => M.euros(0)).valeur),
		N.sumAll,
		(sum) => sum / 3,
		M.euros
	)

export const moyenneCMGRLinéarisés = (situation: SituationCMG) =>
	pipe(
	situation.historique,
	R.values,
	A.flatMap((m) => m.déclarationsDeGarde),
		A.map(
			(d) =>
				calculeCMGRLinéarisé(
					d,
					situation.enfantsÀCharge,
					M.toEurosParMois(situation.ressources)
				).valeur
		),
	N.sumAll,
	(sum) => sum / 3,
	M.euros
)

export const calculeCMGRLinéarisé = (
	déclarationDeGarde: DéclarationDeGarde,
	enfantsÀCharge: EnfantsÀCharge,
	revenuMensuel: M.Montant<'EuroParMois'>
) => {
	const teh = tauxEffortHoraire(déclarationDeGarde.type, enfantsÀCharge) / 100
	const coûtMensuel = coûtMensuelDeLaGarde(déclarationDeGarde)
	const coûtHoraireMédian = COÛT_HORAIRE_MÉDIAN[déclarationDeGarde.type]

	return M.euros(
		coûtMensuel.valeur * (1 - (revenuMensuel.valeur * teh) / coûtHoraireMédian)
	)
}

export const tauxEffortHoraire = (
	modeDeGarde: ModeDeGarde,
	enfantsÀCharge: EnfantsÀCharge
): number => {
	const TEHParNbEnfants = TEH_PAR_GARDE_ET_NB_ENFANTS[modeDeGarde]

	const { TEHPourNbEnfantsÀCharge, indexPourNbEnfantsÀCharge } = pipe(
		TEHParNbEnfants,
		R.reduce(
			{ TEHPourNbEnfantsÀCharge: 0, indexPourNbEnfantsÀCharge: -1 },
			(résultat, teh, nbEnfants) => {
				if (R.values(enfantsÀCharge.enfants).length >= +nbEnfants) {
					résultat.TEHPourNbEnfantsÀCharge = teh
					résultat.indexPourNbEnfantsÀCharge++
				}

				return résultat
			}
		)
	)

	if (enfantsÀCharge.AeeH === 0) {
		return TEHPourNbEnfantsÀCharge
	}

	const TEHParNbEnfantsValeurs = Object.values(TEHParNbEnfants)
	const indexMax = TEHParNbEnfantsValeurs.length - 1
	const indexPourNbEnfantsAeeH = indexPourNbEnfantsÀCharge + enfantsÀCharge.AeeH

	return (
		TEHParNbEnfantsValeurs[indexPourNbEnfantsAeeH] ??
		TEHParNbEnfantsValeurs[indexMax]
	)
}

export const coûtMensuelDeLaGarde = (
	déclarationDeGarde: DéclarationDeGarde
) => {
	const coûtHoraireNet = round(
		déclarationDeGarde.rémunération.valeur / déclarationDeGarde.heuresDeGarde,
		2
	)
	const coûtHoraireAppliqué = Math.min(
		coûtHoraireNet,
		COÛT_HORAIRE_MAXIMAL[déclarationDeGarde.type]
	)

	return M.euros(coûtHoraireAppliqué * déclarationDeGarde.heuresDeGarde)
}
