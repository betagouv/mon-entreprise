import { pipe } from 'effect'
import * as R from 'effect/Record'

import { EnfantsÀCharge } from './éligibilité'

const TEH_PAR_GARDE_ET_NB_ENFANTS = {
	AMA: {
		1: 0.061,
		2: 0.0508,
		3: 0.0406,
		4: 0.0305,
		8: 0.0203,
	},
	GED: {
		1: 0.122,
		2: 0.1016,
		3: 0.0812,
		4: 0.061,
		8: 0.0406,
	},
}

type ModeDeGarde = 'AMA' | 'GED'

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
				if (enfantsÀCharge.total >= +nbEnfants) {
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
