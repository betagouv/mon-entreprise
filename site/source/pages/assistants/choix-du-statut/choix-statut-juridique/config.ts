// import {NavigateToChoixStatutJuridique} from '.'

import { NavigateToChoixStatutJuridique } from '.'
import ChoixDuStatut from '..'
import { config } from '../../../Simulateurs/configs/config'
import { SimulatorsDataParams } from '../../../Simulateurs/configs/types'
import GuideStatut from '../GuideStatut'

export function choixStatutJuridiqueConfig({
	t,
	sitePaths,
}: SimulatorsDataParams) {
	return config({
		id: 'choix-statut',
		pathId: 'assistants.choix-du-statut.guideStatut.index',
		path: sitePaths.assistants['choix-du-statut'].index,
		iframePath: 'choix-statut-juridique',
		icône: '📚',
		tracking: {
			chapter1: 'creer',
			chapter2: 'guide',
		},
		meta: {
			title: t(
				'pages.choix-statut.meta.title',
				'Aide au choix du statut juridique'
			),
			description: t(
				'pages.choix-statut.meta.description',
				'SASU, EURL, auto-entrepreneur, EIRL : choisissez le statut qui vous convient le mieux grâce à cet assistant'
			),
		},
		title: t(
			'pages.choix-statut.title',
			'Assistant au choix du statut juridique'
		),
		shortName: t('pages.choix-statut.shortname', 'Assistant statut juridique'),
		component: ChoixDuStatut,
	} as const)
}
