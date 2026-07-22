import { SimulatorsDataParams } from '../_configs/types'

export function eurlMetadata({ t, sitePaths }: SimulatorsDataParams) {
	return {
		id: 'eurl',
		pathId: 'simulateurs.eurl',
		path: sitePaths.simulateurs.eurl,
		iframePath: 'simulateur-eurl',
		icône: '📕',
		tracking: {
			chapter1: 'simulateurs',
			chapter2: 'statut_entreprise',
			chapter3: 'EURL',
		},
		title: t(
			'pages.simulateurs.eurl.title',
			"Simulateur de revenus pour dirigeant d'EURL"
		),
		shortName: t('pages.simulateurs.eurl.shortname', 'EURL'),
		meta: {
			title: t(
				'pages.simulateurs.eurl.meta.titre',
				'EURL : simulateur de revenus pour dirigeant'
			),
			description: t(
				'pages.simulateurs.eurl.meta.description',
				'Calcul du salaire net à partir du total alloué à la rémunération et inversement'
			),
		},
		codesCatégorieJuridique: [
			'5410',
			'5415',
			'5422',
			'5426',
			'5430',
			'5431',
			'5432',
			'5442',
			'5443',
			'5451',
			'5453',
			'5454',
			'5455',
			'5458',
			'5459',
			'5460',
			'5499',
		],
	} as const
}
