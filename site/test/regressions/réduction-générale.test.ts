import { it } from 'vitest'

import { configRéductionGénérale } from '@/pages/simulateurs/reduction-generale/simulationConfig'

import réductionGénéraleSituation from './réduction-générale.yaml'
import { runSimulations } from './utils'

it('calculate simulations-dividendes', () => {
	runSimulations(
		réductionGénéraleSituation,
		[
			...(configRéductionGénérale['objectifs exclusifs'] ?? []),
			...(configRéductionGénérale.objectifs ?? []),
			'salarié . cotisations . exonérations . réduction générale . imputation retraite complémentaire',
			'salarié . cotisations . exonérations . réduction générale . imputation sécurité sociale',
			'salarié . cotisations . exonérations . réduction générale . imputation chômage',
		],
		configRéductionGénérale.situation
	)
})
