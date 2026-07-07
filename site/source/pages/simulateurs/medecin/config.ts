import { config } from '../_configs/config'
import { SimulatorsDataParams } from '../_configs/types'
import { configMédecin } from '../profession-liberale/simulationConfig'
import { AvertissementMédecin } from './AvertissementMedecin'
import { Médecin } from './Medecin'

export function medecinConfig({ t, sitePaths }: SimulatorsDataParams) {
	return config({
		id: 'medecin',
		hidden: true,
		tracking: {
			chapter1: 'simulateurs',
			chapter2: 'profession_liberale',
			chapter3: 'medecin',
		},
		meta: {
			title: t(
				'pages.simulateurs.medecin.meta.title',
				'Médecin : simulateur de revenus'
			),
			description: t(
				'pages.simulateurs.medecin.meta.description',
				'Calcul du revenu net après déduction des cotisations à partir du total des recettes. Secteur 1, secteur 2, et dépassement d’honoraire pris en compte'
			),
		},
		icône: '🩺',
		iframePath: 'medecin',
		pathId: 'simulateurs.profession-liberale.medecin',
		shortName: t('pages.simulateurs.medecin.shortname', 'Médecin'),
		title: t(
			'pages.simulateurs.medecin.title',
			'Simulateur de revenus pour medecin en libéral'
		),
		path: sitePaths.simulateurs['profession-liberale'].medecin,
		simulation: configMédecin,
		codesCatégorieJuridique: ['1000', '5410'],
		component: Médecin,
		conseillersEntreprisesVariant: 'professions_liberales',
		warning: AvertissementMédecin,
	} as const)
}
