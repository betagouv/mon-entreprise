import { SimulatorsDataParams } from '../_configs/types'

export function salariéMetadata(params: SimulatorsDataParams) {
	const { t, sitePaths } = params

	return {
		id: 'salarié',
		pathId: 'simulateurs.salarié',
		path: sitePaths.simulateurs.salarié,
		iframePath: 'simulateur-embauche',
		icône: '🤝',
		tracking: {
			chapter1: 'simulateurs',
			chapter2: 'salarie',
		},
		title: t(
			'pages.simulateurs.salarié.title',
			'Simulateur de revenus pour salarié'
		),
		shortName: t('pages.simulateurs.salarié.shortname', 'Salarié'),
		meta: {
			title: t(
				'pages.simulateurs.salarié.meta.titre',
				'Salaire brut / net : le convertisseur Urssaf'
			),
			description: t(
				'pages.simulateurs.salarié.meta.description',
				"Calculez le coût total d'une embauche et explorez les différentes options de rémunération : cadres, stages, apprentissages, heures supplémentaires, et bien plus !"
			),
		},
	} as const
}
