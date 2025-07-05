import { pipe } from 'effect'
import * as A from 'effect/Array'
import * as N from 'effect/Number'
import * as O from 'effect/Option'
import * as R from 'effect/Record'

import * as M from '@/domaine/Montant'
import { round } from '@/utils/number'

import {
	COÛT_HORAIRE_MAXIMAL,
	COÛT_HORAIRE_MÉDIAN,
	TEH_PAR_GARDE_ET_NB_ENFANTS,
} from './constantes'
import {
	DéclarationDeGarde,
	toutesLesDéclarations,
} from './déclaration-de-garde'
import { EnfantsÀCharge } from './enfant'
import { ModeDeGarde } from './mode-de-garde'
import { SituationCMGValide } from './situation'

export const calculeComplémentTransitoire = (situation: SituationCMGValide) => {
	const ancienCMGMensuelMoyen = moyenneCMGPerçus(situation.salariées)
	const CMGRLinéariséMoyen = moyenneCMGRLinéarisés(situation)
	const différence = M.moins(ancienCMGMensuelMoyen, CMGRLinéariséMoyen)

	if (M.estNégatif(différence)) {
		return M.euros(0)
	}

	return différence
}

export const moyenneCMGPerçus = (salariées: SituationCMGValide['salariées']) =>
	pipe(
		salariées,
		toutesLesDéclarations,
		A.map((d) => O.getOrElse(d.CMGPerçu, () => M.euros(0)).valeur),
		N.sumAll,
		(sum) => sum / 3,
		M.euros
	)

export const moyenneCMGRLinéarisés = (situation: SituationCMGValide) =>
	pipe(
		situation.salariées,
		toutesLesDéclarations,
		A.map(
			(d) =>
				calculeCMGRLinéarisé(
					d,
					situation.enfantsÀCharge,
					M.toEurosParMois(situation.ressources.value)
				).valeur
		),
		N.sumAll,
		(sum) => sum / 3,
		M.euros
	)

export const calculeCMGRLinéarisé = (
	déclarationDeGarde: DéclarationDeGarde,
	enfantsÀCharge: EnfantsÀCharge,
	revenuMensuel: M.Montant<'€/mois'>
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
				if (enfantsÀCharge.enfants.length >= +nbEnfants) {
					résultat.TEHPourNbEnfantsÀCharge = teh
					résultat.indexPourNbEnfantsÀCharge++
				}

				return résultat
			}
		)
	)

	if (O.isNone(enfantsÀCharge.AeeH) || enfantsÀCharge.AeeH.value === 0) {
		return TEHPourNbEnfantsÀCharge
	}

	const TEHParNbEnfantsValeurs = Object.values(TEHParNbEnfants)
	const indexMax = TEHParNbEnfantsValeurs.length - 1
	const indexPourNbEnfantsAeeH =
		indexPourNbEnfantsÀCharge + enfantsÀCharge.AeeH.value

	return (
		TEHParNbEnfantsValeurs[indexPourNbEnfantsAeeH] ??
		TEHParNbEnfantsValeurs[indexMax]
	)
}

export const coûtMensuelDeLaGarde = (
	déclarationDeGarde: DéclarationDeGarde
) => {
	if (O.isNone(déclarationDeGarde.heuresDeGarde)) {
		return M.euros(0)
	}

	const coûtHoraireNet = round(
		O.getOrElse(déclarationDeGarde.rémunération, () => M.euros(0)).valeur /
			déclarationDeGarde.heuresDeGarde.value,
		2
	)
	const coûtHoraireAppliqué = Math.min(
		coûtHoraireNet,
		COÛT_HORAIRE_MAXIMAL[déclarationDeGarde.type]
	)

	return M.euros(coûtHoraireAppliqué * déclarationDeGarde.heuresDeGarde.value)
}
