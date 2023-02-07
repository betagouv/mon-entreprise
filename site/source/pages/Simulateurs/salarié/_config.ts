import { config } from '../configs/config'
import { SimulatorsDataParams } from '../configs/types'
import salaireBrutNetPreviewEN from './SalaireBrutNetPreviewEN.png'
import salaireBrutNetPreviewFR from './SalaireBrutNetPreviewFR.png'
import SalariéSimulation, { SeoExplanations } from './Salarié'
import { configSalarié } from './_simulationConfig'

export function salariéConfig(params: SimulatorsDataParams) {
	const { t, sitePaths, language } = params

	return config({
		id: 'salarié',
		tracking: 'salarie',
		icône: '🤝',
		title: t(
			'pages.simulateurs.salarié.title',
			'Simulateur de revenus pour salarié'
		),
		iframePath: 'simulateur-embauche',
		meta: {
			description: t(
				'pages.simulateurs.salarié.meta.description',
				"Calcul du salaire net, net après impôt et coût total employeur. Beaucoup d'options disponibles (cadre, stage, apprentissage, heures supplémentaires, etc.)"
			),
			ogDescription: t(
				'pages.simulateurs.salarié.meta.ogDescription',
				"En tant que salarié, calculez immédiatement votre revenu net après impôt à partir du brut mensuel ou annuel. En tant qu'employé, estimez le coût total d'une embauche à partir du brut. Ce simulateur est développé avec les experts de l'Urssaf, et il adapte les calculs à votre situation (statut cadre, stage, apprentissage, heures supplémentaire, titre-restaurants, mutuelle, temps partiel, convention collective, etc.)"
			),
			ogTitle: t(
				'pages.simulateurs.salarié.meta.ogTitle',
				'Salaire brut, net, net après impôt, coût total : le simulateur ultime pour salariés et employeurs'
			),
			title: t(
				'pages.simulateurs.salarié.meta.titre',
				'Salaire brut / net : le convertisseur Urssaf'
			),
			ogImage:
				language === 'fr' ? salaireBrutNetPreviewFR : salaireBrutNetPreviewEN,
		},
		pathId: 'simulateurs.salarié',
		shortName: t('pages.simulateurs.salarié.shortname', 'Salarié'),
		nextSteps: ['chômage-partiel'],
		path: sitePaths.simulateurs.salarié,
		simulation: configSalarié,
		component: SalariéSimulation,
		seoExplanations: SeoExplanations,
	} as const)
}
