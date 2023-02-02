import { IndépendantPLSimulation } from '../Indépendant'
import { config } from '../configs/config'
import { configAuxiliaire } from '../configs/professionLibérale'
import { SimulatorsDataParams } from '../configs/types'

export function auxiliaireMédicalConfig({
	t,
	sitePaths,
}: SimulatorsDataParams) {
	return config({
		id: 'auxiliaire-médical',
		tracking: {
			chapter2: 'profession_liberale',
			chapter3: 'auxiliaire_medical',
		},
		tooltip: t(
			'pages.simulateurs.auxiliaire.tooltip',
			'Infirmiers, masseurs-kinésithérapeutes, pédicures-podologues, orthophonistes et orthoptistes'
		),
		icône: '🩹',
		iframePath: 'auxiliaire-medical',
		pathId: 'simulateurs.profession-libérale.auxiliaire',
		shortName: t(
			'pages.simulateurs.auxiliaire.shortname',
			'Auxiliaire médical'
		),
		title: t(
			'pages.simulateurs.auxiliaire.title',
			'Simulateur de revenus pour auxiliaire médical en libéral'
		),
		meta: {
			title: t(
				'pages.simulateurs.auxiliaire-medical.meta.title',
				'Auxiliaire médical : simulateur de revenus'
			),
			description: t(
				'pages.simulateurs.auxiliaire-medical.meta.description',
				'Calcul du revenu net après cotisations à partir du total des recettes. Prise en compte des revenus non conventionnés.'
			),
		},
		path: sitePaths.simulateurs['profession-libérale'].auxiliaire,
		simulation: configAuxiliaire,
		component: IndépendantPLSimulation,
	} as const)
}
