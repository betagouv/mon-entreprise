import { config } from '../_configs/config'
import { SimulatorsDataParams } from '../_configs/types'
import { SeoExplanations } from './components/SeoExplanations'
import salaireBrutNetPreviewEN from './images/SalaireBrutNetPreviewEN.png'
import salaireBrutNetPreviewFR from './images/SalaireBrutNetPreviewFR.png'
import SalariéSimulation from './Salarie'
import { configSalarié } from './simulationConfig'

export function salarieConfig(params: SimulatorsDataParams) {
	const { t, sitePaths, language } = params

	return config({
		id: 'salarie',
		tracking: {
			chapter1: 'simulateurs',
			chapter2: 'salarie',
		},
		icône: '🤝',
		title: t(
			'pages.simulateurs.salarie.title',
			'Simulateur de revenus pour salarie'
		),
		iframePath: 'simulateur-embauche',
		meta: {
			description: t(
				'pages.simulateurs.salarie.meta.description',
				"Calculez le coût total d'une embauche et explorez les différentes options de rémunération : cadres, stages, apprentissages, heures supplémentaires, et bien plus !"
			),
			ogDescription: t(
				'pages.simulateurs.salarie.meta.ogDescription',
				"Optimisez vos finances en un clic ! Calculez instantanément votre revenu net en tant que salarie et évaluez le coût total d'une embauche en tant qu'employeur. Notre simulateur, élaboré avec les experts de l'Urssaf, s'ajuste à votre situation (cadre, stage, apprentissage, heures supplémentaires, avantages, temps partiel, convention collective, etc.) pour des décisions éclairées"
			),
			ogTitle: t(
				'pages.simulateurs.salarie.meta.ogTitle',
				'Salaire brut, net, net après impôt, coût total : le simulateur tout-en-un pour salaries et employeurs'
			),
			title: t(
				'pages.simulateurs.salarie.meta.titre',
				'Salaire brut / net : le convertisseur Urssaf'
			),
			ogImage:
				language === 'fr' ? salaireBrutNetPreviewFR : salaireBrutNetPreviewEN,
		},
		pathId: 'simulateurs.salarie',
		shortName: t('pages.simulateurs.salarie.shortname', 'Salarié'),
		path: sitePaths.simulateurs.salarie,
		simulation: configSalarié,
		component: SalariéSimulation,
		seoExplanations: SeoExplanations,
		conseillersEntreprisesVariant: 'recrutement',
	} as const)
}
