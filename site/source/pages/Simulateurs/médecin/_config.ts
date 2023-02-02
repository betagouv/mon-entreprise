import { IndépendantPLSimulation } from '../Indépendant'
import { config } from '../configs/config'
import { configMédecin } from '../configs/professionLibérale'
import { SimulatorsDataParams } from '../configs/types'

export function médecinConfig({ t, sitePaths }: SimulatorsDataParams) {
	return config({
		id: 'médecin',
		tracking: {
			chapter2: 'profession_liberale',
			chapter3: 'medecin',
		},
		meta: {
			title: t(
				'pages.simulateurs.médecin.meta.title',
				'Médecin : simulateur de revenus'
			),
			description: t(
				'pages.simulateurs.médecin.meta.description',
				'Calcul du revenu net après déduction des cotisations à partir du total des recettes. Secteur 1, secteur 2, et dépassement d’honoraire pris en compte'
			),
		},
		icône: '🩺',
		iframePath: 'medecin',
		pathId: 'simulateurs.profession-libérale.médecin',
		shortName: t('pages.simulateurs.médecin.shortname', 'Médecin'),
		title: t(
			'pages.simulateurs.médecin.title',
			'Simulateur de revenus pour médecin en libéral'
		),
		path: sitePaths.simulateurs['profession-libérale'].médecin,
		simulation: configMédecin,
		component: IndépendantPLSimulation,
	} as const)
}
