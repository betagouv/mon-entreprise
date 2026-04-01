import rules from 'modele-social'
import { describe, expect, it } from 'vitest'

import { AssimiléSalariéContexte } from '@/domaine/AssimiléSalariéContexte'
import { configComparateurStatuts } from '@/pages/simulateurs/comparaison-statuts/simulationConfig'
import { engineFactory } from '@/utils/publicodes/engineFactory'

describe('Retraite complémentaire dans le comparateur de statuts', () => {
	it('les points AGIRC-ARRCO acquis par la SASU sont calculés sur une base annuelle, pas mensuelle (#4146)', () => {
		const engine = engineFactory(rules)
		engine.setSituation({
			...configComparateurStatuts.situation,
			...AssimiléSalariéContexte,
		})

		const pointsAcquis = engine.evaluate(
			'protection sociale . retraite . complémentaire . AGIRC ARRCO . points acquis'
		)

		// Avec 4000 €/mois de CA et 1000 €/mois de charges, les cotisations
		// retraite complémentaire salarié sont d'environ 169 €/mois soit ~2028 €/an.
		// Points annuels = (2028 / 1.27) / 20.1877 ≈ 79 points/an
		expect(pointsAcquis.nodeValue).toBeCloseTo(79, 0)
		expect(pointsAcquis.unit?.denominators).toContain('an')
	})
})
