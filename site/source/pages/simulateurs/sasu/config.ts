import { config } from '../_configs/config'
import { SimulatorsDataParams } from '../_configs/types'
import RémunérationSASUPreview from '../_images/RémunérationSASUPreview.png'
import { SASUSimulation, SeoExplanations } from './SASU'
import { configSASU } from './simulationConfig'

export function sasuConfig({ t, sitePaths }: SimulatorsDataParams) {
	return config({
		id: 'sasu',
		tracking: {
			chapter1: 'simulateurs',
			chapter2: 'statut_entreprise',
			chapter3: 'SASU',
		},
		icône: '📘',
		iframePath: 'simulateur-assimilesalarie',
		meta: {
			description: t(
				'pages.simulateurs.sasu.meta.description',
				'Calcul du salaire net à partir du total alloué à la rémunération et inversement'
			),
			ogDescription: t(
				'pages.simulateurs.sasu.meta.ogDescription',
				'En tant que dirigeant assimilé-salarié, calculez immédiatement votre revenu net après impôt à partir du total alloué à votre rémunération.'
			),
			ogTitle: t(
				'pages.simulateurs.sasu.meta.ogTitle',
				'Rémunération du dirigeant de SAS(U) : un simulateur pour connaître votre salaire net'
			),
			title: t(
				'pages.simulateurs.sasu.meta.titre',
				'SASU : simulateur de revenus pour dirigeant'
			),
			ogImage: RémunérationSASUPreview,
		},
		pathId: 'simulateurs.sasu',
		shortName: t('pages.simulateurs.sasu.shortname', 'SAS(U)'),
		title: t(
			'pages.simulateurs.sasu.title',
			'Simulateur de revenus pour dirigeant de SAS(U)'
		),
		path: sitePaths.simulateurs.sasu,
		simulation: configSASU,
		codesCatégorieJuridique: ['5710'],
		component: SASUSimulation,
		seoExplanations: SeoExplanations,
		conseillersEntreprisesVariant: 'revenus_par_statut',
	} as const)
}
