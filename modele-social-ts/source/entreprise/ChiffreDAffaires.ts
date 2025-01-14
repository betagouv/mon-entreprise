import { Brand } from 'effect'
import { dual } from 'effect/Function'

import { SituationAvecEntreprise } from '../situation'

export type ChiffreDAffairesAnnuel = number &
	Brand.Brand<'Entreprise.ChiffreDAffairesAnnuel'>

export const ChiffreDAffairesAnnuel = Brand.refined<ChiffreDAffairesAnnuel>(
	(n) => n >= 0,
	(n) => Brand.error(`${n} n'est pas un chiffre d’affaires valide`)
)

export const aChiffreDAffairesAnnuelInférieurÀ = dual<
	<S extends SituationAvecEntreprise>(
		effectif: ChiffreDAffairesAnnuel
	) => (situation: S) => boolean,
	<S extends SituationAvecEntreprise>(
		situation: S,
		effectif: ChiffreDAffairesAnnuel
	) => boolean
>(
	2,
	(situation: SituationAvecEntreprise, plafond: ChiffreDAffairesAnnuel) =>
		situation.entreprise.effectif <= plafond
)
