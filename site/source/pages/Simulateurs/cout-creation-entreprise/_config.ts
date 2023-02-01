import { ImmutableType } from '@/types/utils'

import CoutCreationEntreprise from '.'
import { PageConfig } from '../configs/types'
import { SimulatorsDataParams } from '../metadata'

export function configCoûtCréationEntreprise({
	t,
	sitePaths,
}: SimulatorsDataParams) {
	return config({
		id: 'coût-création-entreprise',
		beta: true,
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
			},
			situation: {},
		},
		component: CoutCreationEntreprise,

		// Remove this "as const" when we upgrade to typescript v5:
	} as const)
}

// Replace type by commented line when we upgrade to typescript v5:
function config<
	// const	Base extends Immutable<PageConfig>
	Base extends ImmutableType<PageConfig>
>(base: Base) {
	return {
		[base.id]: base,
	} as ImmutableType<{ [k in Base['id']]: Base }>
}
