import * as R from 'ramda'
import graphlib from '@dagrejs/graphlib'
import parseRules from '../parseRules'
import { Rules } from '../types'
import {
	buildRulesDependencies,
	RuleDependencies,
	RulesDependencies
} from './rulesDependencies'

type GraphNodeRepr<Names extends string> = Names
type GraphCycles<Names extends string> = Array<Array<GraphNodeRepr<Names>>>
type GraphCyclesWithDependencies<Names extends string> = Array<
	Array<[GraphNodeRepr<Names>, RuleDependencies<Names>]>
>

function buildDependenciesGraph<Names extends string>(
	rulesDeps: RulesDependencies<Names>
): graphlib.Graph {
	const g = new graphlib.Graph()

	rulesDeps.forEach(([ruleDottedName, dependencies]) => {
		dependencies.forEach(depDottedName => {
			g.setEdge(ruleDottedName, depDottedName)
		})
	})

	return g
}

export function cyclesInDependenciesGraph<Names extends string>(
	rawRules: Rules<Names> | string
): GraphCycles<Names> {
	const parsedRules = parseRules(rawRules)
	const rulesDependencies = buildRulesDependencies(parsedRules)
	const dependenciesGraph = buildDependenciesGraph(rulesDependencies)
	const cycles = graphlib.alg.findCycles(dependenciesGraph)

	return cycles
}

/**
 * This function is useful so as to print the dependencies at each node of the
 * cycle.
 * ⚠️  Indeed, the graphlib.findCycles function returns the cycle found using the
 * Tarjan method, which is **not necessarily the smallest cycle**. However, the
 * smallest cycle would be the most legibe one…
 */
export function cyclicDependencies<Names extends string>(
	rawRules: Rules<Names> | string
): GraphCyclesWithDependencies<Names> {
	const parsedRules = parseRules(rawRules)
	const rulesDependencies = buildRulesDependencies(parsedRules)
	const dependenciesGraph = buildDependenciesGraph(rulesDependencies)
	const cycles = graphlib.alg.findCycles(dependenciesGraph)

	const rulesDependenciesObject = R.fromPairs(rulesDependencies)

	return cycles.map(cycle =>
		cycle.map(ruleName => [ruleName, rulesDependenciesObject[ruleName]])
	)
}
