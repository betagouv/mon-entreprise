import ExonérationCovid from '.'
import { config } from '../configs/config'
import { SimulatorsDataParams } from '../configs/types'

export function exonérationCovidConfig({ t, sitePaths }: SimulatorsDataParams) {
	return config({
		id: 'exonération-covid',
		icône: '😷',
		tracking: 'exoneration_covid',
		iframePath: 'exoneration-covid',
		pathId: 'simulateurs.exonération-covid',
		meta: {
			title: t(
				'pages.simulateurs.exonération-covid.meta.title',
				'Exonération de cotisations covid'
			),
			description: t(
				'pages.simulateurs.exonération-covid.meta.description',
				'Déterminez les éléments à déclarer pour bénéficier de l’exonération Covid et obtenir les codes « norme EDI »'
			),
		},
		shortName: t(
			'pages.simulateurs.exonération-covid.shortName',
			'Simulateur d’exonération COVID'
		),
		title: t(
			'pages.simulateurs.exonération-covid.title',
			'Simulateur d’exonération de cotisations Covid pour indépendant'
		),
		nextSteps: ['déclaration-charges-sociales-indépendant'],
		path: sitePaths.simulateurs['exonération-covid'],
		component: ExonérationCovid,
	} as const)
}
