import { config } from '../_configs/config'
import { SimulatorsDataParams } from '../_configs/types'
import { configAuxiliaire } from '../profession-liberale/simulationConfig'
import { AuxiliaireMédical } from './AuxiliaireMedical'
import { AvertissementAuxiliaireMédical } from './AvertissementAuxiliaireMedical'

export function auxiliaireMédicalConfig({
	t,
	sitePaths,
}: SimulatorsDataParams) {
	return config({
		id: 'auxiliaire-medical',
		hidden: true,
		tracking: {
			chapter1: 'simulateurs',
			chapter2: 'profession_liberale',
			chapter3: 'auxiliaire_medical',
		},
		tooltip: t(
			'pages.simulateurs.auxiliaire-medical.tooltip',
			'Infirmiers, masseurs-kinésithérapeutes, pédicures-podologues, orthophonistes et orthoptistes'
		),
		icône: '🩹',
		iframePath: 'auxiliaire-medical',
		pathId: 'simulateurs.profession-liberale.auxiliaire',
		shortName: t(
			'pages.simulateurs.auxiliaire-medical.shortname',
			'Auxiliaire médical'
		),
		title: t(
			'pages.simulateurs.auxiliaire-medical.title',
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
		path: sitePaths.simulateurs['profession-liberale'].auxiliaire,
		simulation: configAuxiliaire,
		codesCatégorieJuridique: ['1000', '5410'],
		component: AuxiliaireMédical,
		conseillersEntreprisesVariant: 'professions_liberales',
		warning: AvertissementAuxiliaireMédical,
	} as const)
}
