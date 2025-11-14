import rules from 'modele-social'
import { it } from 'vitest'

import { configRéductionGénérale } from '@/pages/simulateurs/reduction-generale/simulationConfig'
import { engineFactory } from '@/utils/publicodes/engineFactory'

import réductionGénéraleSituation from './réduction-générale.yaml'
import { runSimulations } from './utils'

it('calculate réduction générale', () => {
	runSimulations(
		engineFactory(rules),
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
