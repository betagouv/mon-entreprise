import { SimulatorsDataParams } from '../_configs/types'

export function chirurgienDentisteMetadata({
	t,
	sitePaths,
}: SimulatorsDataParams) {
	return {
		id: 'chirurgien-dentiste',
		pathId: 'simulateurs.profession-libérale.chirurgien-dentiste',
		path: sitePaths.simulateurs['profession-libérale']['chirurgien-dentiste'],
		iframePath: 'chirurgien-dentiste',
		icône: '🦷',
		hidden: true,
		tracking: {
			chapter1: 'simulateurs',
			chapter2: 'profession_liberale',
			chapter3: 'chirurgien_dentiste',
		},
		title: t(
			'pages.simulateurs.chirurgien-dentiste.title',
			'Simulateur de revenus pour chirurgien-dentiste en libéral'
		),
		shortName: t(
			'pages.simulateurs.chirurgien-dentiste.shortname',
			'Chirurgien-dentiste'
		),
		meta: {
			title: t(
				'pages.simulateurs.chirurgien-dentiste.meta.title',
				'Chirurgien-dentiste : simulateur de revenus'
			),
			description: t(
				'pages.simulateurs.chirurgien-dentiste.meta.description',
				'Calcul du revenu net après cotisations à partir du total des recettes.'
			),
		},
		codesCatégorieJuridique: ['1000', '5410'],
	} as const
}
