import graphlib from '@dagrejs/graphlib'
import parseRules from '../parseRules'
import { Rules } from '../types'
import {
	buildRulesDependencies,
	RulesDependencies,
	DependencyType
} from './rulesDependencies'

type GraphNodeRepr = string
type GraphCycles = Array<Array<GraphNodeRepr>>

export class GraphError extends Error {}

export function buildDependenciesGraph<Names extends string>(
	rulesDeps: RulesDependencies<Names>,
	assertNoMultiDependency = false
): graphlib.Graph {
	const g = new graphlib.Graph()
	const multiDependencies: Set<[Names, Names]> = new Set()

	rulesDeps.forEach(([ruleDottedName, dependencies]) => {
		dependencies.forEach(([depDottedName, depType]) => {
			if (
				assertNoMultiDependency &&
				g.edge(ruleDottedName, depDottedName) !== undefined &&
				g.edge(ruleDottedName, depDottedName).type != depType
			) {
				multiDependencies.add([ruleDottedName, depDottedName])
			}
			g.setEdge(ruleDottedName, depDottedName, { type: depType })
		})
	})

	if (assertNoMultiDependency && multiDependencies.size > 0)
		throw new GraphError(
			`The following rules dependencies have multiple types
			(formule, remplace and/or rend non applicable), which is
			forbidden:${Array.from(
				multiDependencies.values(),
				rules => '\n' + rules.join(' ➡️  ')
			)}`
		)

	return g
}
export function cyclicDependencies<Names extends string>(
	rawRules: Rules<Names> | string,
	assertNoMultiDependency = false
): GraphCycles {
	const parsedRules = parseRules(rawRules)
	const rulesDependencies = buildRulesDependencies(parsedRules)
	const dependenciesGraph = buildDependenciesGraph(
		rulesDependencies,
		assertNoMultiDependency
	)
	return graphlib.alg.findCycles(dependenciesGraph)
}
