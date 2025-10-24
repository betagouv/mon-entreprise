import CoutCreationEntreprise from '.'
import { config } from '../_configs/config'
import { SimulatorsDataParams } from '../_configs/types'

export function coûtCréationEntrepriseConfig({
	t,
	sitePaths,
}: SimulatorsDataParams) {
	return config({
		id: 'coût-création-entreprise',
		path: sitePaths.simulateurs['coût-création-entreprise'],
		iframePath: 'cout-creation-entreprise',
		icône: '✨',
		tracking: 'cout_creation_entreprise',
		pathId: 'simulateurs.coût-création-entreprise',
		meta: {
			title: t(
				'pages.simulateurs.coût-création-entreprise.meta.title',
				"Coût de création d'une entreprise"
			),
			description: t(
				'pages.simulateurs.coût-création-entreprise.meta.description',
				"Estimez les coûts des formalités administratives obligatoires à la création d'une entreprise"
			),
		},
		shortName: t(
			'pages.simulateurs.coût-création-entreprise.shortName',
			'Coût de création'
		),
		title: t(
			'pages.simulateurs.coût-création-entreprise.title',
			"Simulateur de coût de création d'une entreprise"
		),
		simulation: {
			'objectifs exclusifs': [],
			objectifs: ['entreprise . coût formalités . création'],
			questions: {
				'liste noire': ['entreprise . activité . nature'],
				'non prioritaires': ['établissement . commune'],
			},
			situation: {
				'entreprise . catégorie juridique . association': {
					'applicable si': 'non',
				},
			},
		},
		component: CoutCreationEntreprise,
		nextSteps: ['choix-statut'],

		// Remove this "as const" when we upgrade to typescript v5:
	} as const)
}
