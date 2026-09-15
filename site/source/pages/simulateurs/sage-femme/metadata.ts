import { PageMetadataParams } from '../_configs/types'

export function sageFemmeMetadata({ t, sitePaths }: PageMetadataParams) {
	return {
		id: 'sage-femme',
		pathId: 'simulateurs.profession-libérale.sage-femme',
		path: sitePaths.simulateurs['profession-libérale']['sage-femme'],
		iframePath: 'sage-femme',
		icône: '👶',
		hidden: true,
		tracking: {
			chapter1: 'simulateurs',
			chapter2: 'profession_liberale',
			chapter3: 'sage_femme',
		},
		title: t(
			'pages.simulateurs.sage-femme.title',
			'Simulateur de revenus pour sage-femme en libéral'
		),
		shortName: t('pages.simulateurs.sage-femme.shortname', 'Sage-femme'),
		meta: {
			title: t(
				'pages.simulateurs.sage-femme.meta.title',
				'Sage-femme : simulateur de revenus'
			),
			description: t(
				'pages.simulateurs.sage-femme.meta.description',
				"Calcul du revenu net après cotisations à partir du total des recettes. Prise en compte des dépassements d'honoraires et des revenus non conventionnés."
			),
		},
		codesCatégorieJuridique: ['1000', '5410'],
	} as const
}
