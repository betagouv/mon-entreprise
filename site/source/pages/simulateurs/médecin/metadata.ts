import { PageMetadataParams } from '../_configs/types'

export function médecinMetadata({ t, sitePaths }: PageMetadataParams) {
	return {
		id: 'médecin',
		pathId: 'simulateurs.profession-libérale.médecin',
		path: sitePaths.simulateurs['profession-libérale'].médecin,
		iframePath: 'medecin',
		icône: '🩺',
		hidden: true,
		tracking: {
			chapter1: 'simulateurs',
			chapter2: 'profession_liberale',
			chapter3: 'medecin',
		},
		title: t(
			'pages.simulateurs.médecin.title',
			'Simulateur de revenus pour médecin en libéral'
		),
		shortName: t('pages.simulateurs.médecin.shortname', 'Médecin'),
		meta: {
			title: t(
				'pages.simulateurs.médecin.meta.title',
				'Médecin : simulateur de revenus'
			),
			description: t(
				'pages.simulateurs.médecin.meta.description',
				'Calcul du revenu net après déduction des cotisations à partir du total des recettes. Secteur 1, secteur 2, dépassements d’honoraires et revenus non conventionnés pris en compte.'
			),
		},
		codesCatégorieJuridique: ['1000', '5410'],
	} as const
}
