import { config } from '../_configs/config'
import { SimulatorsDataParams } from '../_configs/types'
import { SeoExplanations } from './components/SeoExplanations'
import salaireBrutNetPreviewEN from './images/SalaireBrutNetPreviewEN.png'
import salaireBrutNetPreviewFR from './images/SalaireBrutNetPreviewFR.png'
import SalariéSimulation from './Salarié'
import { configSalarié } from './simulationConfig'

export function salariéConfig(params: SimulatorsDataParams) {
	const { t, sitePaths, language } = params

	return config({
		id: 'salarié',
		tracking: {
			chapter1: 'simulateurs',
			chapter2: 'salarie',
		},
		icône: '🤝',
		title: t(
			'pages.simulateurs.salarié.title',
			'Simulateur de revenus pour salarié'
		),
		iframePath: 'simulateur-embauche',
		meta: {
			description: t(
				'pages.simulateurs.salarié.meta.description',
				"Calculez le coût total d'une embauche et explorez les différentes options de rémunération : cadres, stages, apprentissages, heures supplémentaires, et bien plus !"
			),
			ogDescription: t(
				'pages.simulateurs.salarié.meta.ogDescription',
				"Optimisez vos finances en un clic ! Calculez instantanément votre revenu net en tant que salarié et évaluez le coût total d'une embauche en tant qu'employeur. Notre simulateur, élaboré avec les experts de l'Urssaf, s'ajuste à votre situation (cadre, stage, apprentissage, heures supplémentaires, avantages, temps partiel, convention collective, etc.) pour des décisions éclairées"
			),
			ogTitle: t(
				'pages.simulateurs.salarié.meta.ogTitle',
				'Salaire brut, net, net après impôt, coût total : le simulateur tout-en-un pour salariés et employeurs'
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
		path: sitePaths.simulateurs.salarié,
		simulation: configSalarié,
		component: SalariéSimulation,
		seoExplanations: SeoExplanations,
	} as const)
}
