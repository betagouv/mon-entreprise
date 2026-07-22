import { SimulatorsDataParams } from '../_configs/types'

export function auxiliaireMédicalMetadata({
	t,
	sitePaths,
}: SimulatorsDataParams) {
	return {
		id: 'auxiliaire-médical',
		pathId: 'simulateurs.profession-libérale.auxiliaire',
		path: sitePaths.simulateurs['profession-libérale'].auxiliaire,
		iframePath: 'auxiliaire-medical',
		icône: '🩹',
		hidden: true,
		tracking: {
			chapter1: 'simulateurs',
			chapter2: 'profession_liberale',
			chapter3: 'auxiliaire_medical',
		},
		tooltip: t(
			'pages.simulateurs.auxiliaire-médical.tooltip',
			'Infirmiers, masseurs-kinésithérapeutes, pédicures-podologues, orthophonistes et orthoptistes'
		),
		title: t(
			'pages.simulateurs.auxiliaire-médical.title',
			'Simulateur de revenus pour auxiliaire médical en libéral'
		),
		shortName: t(
			'pages.simulateurs.auxiliaire-médical.shortname',
			'Auxiliaire médical'
		),
		meta: {
			title: t(
				'pages.simulateurs.auxiliaire-médical.meta.title',
				'Auxiliaire médical : simulateur de revenus'
			),
			description: t(
				'pages.simulateurs.auxiliaire-médical.meta.description',
				'Calcul du revenu net après cotisations à partir du total des recettes. Prise en compte des revenus non conventionnés.'
			),
		},
		codesCatégorieJuridique: ['1000', '5410'],
	} as const
}
