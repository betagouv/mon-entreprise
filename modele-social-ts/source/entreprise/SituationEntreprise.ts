import * as Optic from '@fp-ts/optic'

import { ChiffreDAffairesAnnuel } from './ChiffreDAffaires'
import { Effectif } from './Effectif'

export interface SituationEntreprise {
	effectif: Effectif
	chiffreDAffaires: ChiffreDAffairesAnnuel
	activité: {
		éligibleLodeomÉligibleInnovationEtCroissance?: boolean
	}
}

const Lens = Optic.id<SituationEntreprise>()

export const setActivitéÉligibleLodeomInnovationEtCroissance = Optic.replace(
	Lens.at('activité').at('éligibleLodeomÉligibleInnovationEtCroissance')
)

declare const situation: SituationEntreprise

setActivitéÉligibleLodeomInnovationEtCroissance(true)(situation)
