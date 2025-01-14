import { Brand } from 'effect'
import { dual } from 'effect/Function'

import { SituationAvecEntreprise } from '../situation'

export type Effectif = number & Brand.Brand<'Effectif'>
export const Effectif = Brand.refined<Effectif>(
	(n) => Number.isInteger(n) && n >= 0,
	(n) => Brand.error(`${n} n'est pas un effectif valide`)
)

export const entrepriseAEffectifInférieurÀ = dual<
	(effectif: Effectif) => (situation: SituationAvecEntreprise) => boolean,
	(situation: SituationAvecEntreprise, plafond: Effectif) => boolean
>(
	2,
	(situation: SituationAvecEntreprise, plafond: Effectif) =>
		situation.entreprise.effectif <= plafond
)
