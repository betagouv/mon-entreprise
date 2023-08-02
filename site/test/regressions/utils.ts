// The goal of these tests is to avoid deploying unwanted changes in the calculations. We run a number
// of simulations and persist their results in a snapshot (ie, a file commited in git). Our test runner,
// Jest, then compare the existing snapshot with the current Engine calculation and reports any difference.
//
// We only persist targets values in the file system, in order to be resilient to rule renaming (if a rule is
// renamed the test configuration may be adapted but the persisted snapshot will remain unchanged).
import rules, { DottedName } from 'modele-social'
import { EvaluatedNode, Evaluation } from 'publicodes'
import { expect } from 'vitest'

import { engineFactory } from '@/components/utils/EngineContext'
import { Simulation } from '@/store/reducers/rootReducer'

type SituationsSpecs = Record<string, Simulation['situation'][]>

export const engine = engineFactory(rules, {
	logger: {
		warn: () => undefined,
		// eslint-disable-next-line no-console
		error: (m: string) => console.error(m),
		log: () => undefined,
	},
})
export const runSimulations = (
	situationsSpecs: SituationsSpecs,
	objectifs: DottedName[],
	baseSituation: Simulation['situation'] = {}
) =>
	Object.entries(situationsSpecs).map(([name, situations]) =>
		situations.forEach((situation) => {
			engine.setSituation({ ...baseSituation, ...situation })
			const formatValue = (value: Evaluation) =>
				typeof value === 'number' ? Math.round(value) : JSON.stringify(value)

			const res = objectifs
				.sort()
				.map(
					(objectif) =>
						`${objectif}: ${formatValue(engine.evaluate(objectif).nodeValue)}`
				)
				.join('\n')

			const evaluatedNotifications = Object.values(engine.getParsedRules())
				.filter(
					(rule) =>
						rule.rawNode.type === 'notification' &&
						engine.evaluate(rule.dottedName).nodeValue === true
				)
				.map((node) => node.dottedName)

			const snapshotedDisplayedNotifications = evaluatedNotifications.length
				? `\n\nNotifications affichées : ${evaluatedNotifications.join(', ')}`
				: ''
			// Display result in a single line in the snapshot,
			// which reduce the number of lines of this snapshot
			// and improve its readability.
			// eslint-disable-next-line jest/no-standalone-expect
			expect(res + snapshotedDisplayedNotifications).toMatchSnapshot(name)
		})
	)

export function getMissingVariables(node: EvaluatedNode) {
	return Object.keys(node.missingVariables).sort()
}
