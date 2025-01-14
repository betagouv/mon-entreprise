import { dual } from 'effect/Function'
import { t } from 'i18next'

import { setActivitéÉligibleLodeomInnovationEtCroissance } from '../../../../entreprise/SituationEntreprise'
import { Question } from '../../../../Question'
import { changeEntrepriseDansSituation } from '../../../../situation'
import {
	Départements,
	entrepriseDansUnDesDépartements,
} from '../../../../territoire/département'
import { SituationSalarié } from '../../../situation'
import { BarèmeCompétitivité } from './barèmeCompétitivité'
import { BarèmeCompétitivitéRenforcée } from './barèmeCompétitivitéRenforcée'
import { BarèmeInnovationEtCroissance } from './barèmeInnovationEtCroissance'

export interface Barème {
	nom: string
	estÉligible: (entreprise: SituationSalarié) => boolean
}

const seuilInflexion = (situation: SituationSalarié): number => {
	if (
		entrepriseDansUnDesDépartements(situation, [
			Départements.Guadeloupe,
			Départements.Martinique,
		])
	) {
		return 0
	}

	return 0
}

const Barèmes = [
	BarèmeInnovationEtCroissance,
	BarèmeCompétitivitéRenforcée,
	BarèmeCompétitivité,
] as const

const AucunBarème = 'AucunBarème'

type BarèmeLodeom =
	| typeof BarèmeCompétitivité.nom
	| typeof BarèmeCompétitivitéRenforcée.nom
	| typeof BarèmeInnovationEtCroissance.nom
	| typeof AucunBarème

const getBarème = (situation: SituationSalarié): BarèmeLodeom =>
	Barèmes.find((b: Barème) => b.estÉligible(situation.entreprise))?.nom ||
	AucunBarème

export const déclareÉligibilitéLodeomInnovationEtCroissance = dual<
	<S extends SituationSalarié>(éligible: boolean) => (situation: S) => S,
	<S extends SituationSalarié>(situation: S, éligible: boolean) => S
>(
	2,
	<S extends SituationSalarié>(situation: S, éligible: boolean) =>
		changeEntrepriseDansSituation(
			setActivitéÉligibleLodeomInnovationEtCroissance(éligible)
		)(situation) as S
)

export const questionEstÉligibleLodeomInnovationEtCroissance: Question<
	boolean,
	SituationSalarié
> = {
	libellé: t('Êtes-vous éligible au barème Lodeom Innovation & Croissance ?'),
	applicable: BarèmeInnovationEtCroissance.estÉligible,
	répond: déclareÉligibilitéLodeomInnovationEtCroissance,
	estRépondue: (situation) =>
		undefined !==
		situation.entreprise.activité.éligibleLodeomÉligibleInnovationEtCroissance,
}
