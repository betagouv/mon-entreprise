import { pipe } from 'effect'
import * as R from 'effect/Record'

import { round } from '@/utils/number'

import { DéclarationDeGarde, EnfantsÀCharge, ModeDeGarde } from './éligibilité'

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
	AMA: 8.15,
	GED: 10.3,
}

type TEHArgs = {
	modeDeGarde: ModeDeGarde
	enfantsÀCharge: EnfantsÀCharge
}

export const tauxEffortHoraire = ({
	modeDeGarde,
	enfantsÀCharge,
}: TEHArgs): number | null => {
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
		déclarationDeGarde.rémunération / déclarationDeGarde.heuresDeGarde,
		2
	)
	const coûtHoraireAppliqué = Math.min(
		coûtHoraireNet,
		COÛT_HORAIRE_MAXIMAL[déclarationDeGarde.type]
	)

	return coûtHoraireAppliqué * déclarationDeGarde.heuresDeGarde
}
