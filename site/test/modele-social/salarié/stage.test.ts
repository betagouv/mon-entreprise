import rules, { RègleModèleSocial } from 'modele-social'
import Engine from 'publicodes'
import { beforeEach, describe, expect, it } from 'vitest'

describe('En stage', () => {
	let engine: Engine<RègleModèleSocial>
	beforeEach(() => {
		engine = new Engine(rules).setSituation({
			'salarié . contrat': "'stage'",
			'salarié . contrat . salaire brut': '700 €/mois',
			'salarié . cotisations . exonérations . JEI': 'oui',
		})
	})

	it.each([
		['patronales', 'salarié . cotisations . exonérations . employeur'],
		['salariales', 'salarié . cotisations . exonérations . salarié'],
	] as const)(
		'n’ouvre droit à aucune exonération de cotisations %s',
		(_, exonérations) => {
			expect(engine).not.toBeApplicable(exonérations)
		}
	)
})
