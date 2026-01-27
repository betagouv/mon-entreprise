import { config } from '../_configs/config'
import { SimulatorsDataParams } from '../_configs/types'
import { configMédecin } from '../profession-libérale/simulationConfig'
import { AvertissementMédecin } from './AvertissementMédecin'
import Médecin from './Médecin'

export function médecinConfig({ t, sitePaths }: SimulatorsDataParams) {
	return config({
		id: 'médecin',
		hidden: true,
		tracking: {
			chapter1: 'simulateurs',
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
		codesCatégorieJuridique: ['1000', '5410'],
		component: Médecin,
		warning: AvertissementMédecin,
	} as const)
}
