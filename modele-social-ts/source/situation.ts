import * as Optic from '@fp-ts/optic'

import { SituationEntreprise } from './entreprise/SituationEntreprise'
import { Commune } from './territoire'

export interface Situation {
	commune: Commune
	catégorieJuridique?: string
}

export interface SituationAvecEntreprise extends Situation {
	entreprise: SituationEntreprise
}

const LensAvecEntreprise = Optic.id<SituationAvecEntreprise>()

export const setEntrepriseDansSituation = Optic.replace(
	LensAvecEntreprise.at('entreprise')
)
export const changeEntrepriseDansSituation = Optic.modify(
	LensAvecEntreprise.at('entreprise')
)
