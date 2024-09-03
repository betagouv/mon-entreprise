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
			'salarié . cotisations . exonérations . réduction générale . part retraite',
			'salarié . cotisations . exonérations . réduction générale . part Urssaf',
			'salarié . cotisations . exonérations . réduction générale . part Urssaf . part chômage',
		],
		configRéductionGénérale.situation
	)
})
