import { IndépendantPLSimulation } from '../Indépendant'
import { config } from '../configs/config'
import { configDentiste } from '../configs/professionLibérale'
import { SimulatorsDataParams } from '../configs/types'

export function chirurgienDentisteConfig({
	t,
	sitePaths,
}: SimulatorsDataParams) {
	return config({
		id: 'chirurgien-dentiste',
		icône: '🦷',
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
		tracking: {
			chapter2: 'profession_liberale',
			chapter3: 'chirurgien_dentiste',
		},
		iframePath: 'chirurgien-dentiste',
		pathId: 'simulateurs.profession-libérale.chirurgien-dentiste',
		shortName: t(
			'pages.simulateurs.chirurgien-dentiste.shortname',
			'Chirurgien-dentiste'
		),
		title: t(
			'pages.simulateurs.chirurgien-dentiste.title',
			'Simulateur de revenus pour chirurgien-dentiste en libéral'
		),
		path: sitePaths.simulateurs['profession-libérale']['chirurgien-dentiste'],
		simulation: configDentiste,
		component: IndépendantPLSimulation,
	} as const)
}
