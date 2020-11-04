import graphlib from '@dagrejs/graphlib'
import * as R from 'ramda'
import parsePublicodes from '../parsePublicodes'
import { RuleNode } from '../rule'
import { reduceAST } from './index'

type RulesDependencies = Array<[string, Array<string>]>
type GraphCycles = Array<Array<string>>
type GraphCyclesWithDependencies = Array<RulesDependencies>

export function buildRulesDependencies(
	parsedRules: Record<string, RuleNode>
): RulesDependencies {
	return Object.entries(parsedRules).map(([name, node]) => [
		name,
		buildRuleDependancies(node)
	])
}

function buildRuleDependancies(rule: RuleNode): Array<string> {
	return reduceAST<string[]>(
		(acc, node, fn) => {
			switch (node.nodeKind) {
				case 'replacement':
				case 'inversion':
				case 'une possibilité':
					return acc
				case 'reference':
					return [...acc, node.dottedName as string]
				case 'rule':
					// Cycle from parent dependancies are ignored at runtime
					return fn(rule.explanation.valeur)
			}
		},
		[],
		rule
	)
}

function buildDependenciesGraph(rulesDeps: RulesDependencies): graphlib.Graph {
	const g = new graphlib.Graph()
	rulesDeps.forEach(([ruleDottedName, dependencies]) => {
		dependencies.forEach(depDottedName => {
			g.setEdge(ruleDottedName, depDottedName)
		})
	})
	return g
}

type ArgsType<T> = T extends (...args: infer U) => any ? U : never
type RawRules = ArgsType<typeof parsePublicodes>[0]

export function cyclesInDependenciesGraph(rawRules: RawRules): GraphCycles {
	const parsedRules = parsePublicodes(rawRules)
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
	rawRules: RawRules
): GraphCyclesWithDependencies {
	const parsedRules = parsePublicodes(rawRules)
	const rulesDependencies = buildRulesDependencies(parsedRules)
	const dependenciesGraph = buildDependenciesGraph(rulesDependencies)
	const cycles = graphlib.alg.findCycles(dependenciesGraph)

	const rulesDependenciesObject = R.fromPairs(rulesDependencies)

	return cycles.map(cycle =>
		cycle.map(ruleName => [ruleName, rulesDependenciesObject[ruleName]])
	)
}
