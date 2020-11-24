import graphlib from '@dagrejs/graphlib'
import * as R from 'ramda'
import parsePublicodes from '../parsePublicodes'
import { RuleNode } from '../rule'
import { reduceAST } from './index'
type RulesDependencies = Array<[string, Array<string>]>
type GraphCycles = Array<Array<string>>
type GraphCyclesWithDependencies = Array<RulesDependencies>

function buildRulesDependencies(
	parsedRules: Record<string, RuleNode>
): RulesDependencies {
	return Object.entries(parsedRules).map(([name, node]) => [
		name,
		R.uniq(buildRuleDependancies(node))
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
				case 'recalcul':
					node.explanation.amendedSituation.forEach(s => fn(s[1]))
					return
				case 'reference':
					return [...acc, node.dottedName as string]
				case 'rule':
					// Cycle from parent dependancies are ignored at runtime,
					// so we don' detect them statically
					return fn(rule.explanation.valeur)
				case 'variations':
					// a LOT of cycles with replacements... we disactivate them until we see clearer,
					if (node.rawNode && typeof node.rawNode === 'string') {
						return [...acc, node.rawNode]
					}
			}
		},
		[],
		rule
	)
}

function buildDependenciesGraph(rulesDeps: RulesDependencies): graphlib.Graph {
	const g = new (graphlib as any).Graph()
	rulesDeps.forEach(([ruleDottedName, dependencies]) => {
		dependencies.forEach(depDottedName => {
			g.setEdge(ruleDottedName, depDottedName)
		})
	})
	return g
}

type RawRules = Parameters<typeof parsePublicodes>[0]

export function cyclesInDependenciesGraph(rawRules: RawRules): GraphCycles {
	const parsedRules = parsePublicodes(rawRules)
	const rulesDependencies = buildRulesDependencies(parsedRules)
	const dependenciesGraph = buildDependenciesGraph(rulesDependencies)
	const cycles = (graphlib as any).alg.findCycles(dependenciesGraph)

	return cycles.map(c => c.reverse())
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
	const cycles = (graphlib as any).alg.findCycles(dependenciesGraph)
	const rulesDependenciesObject = R.fromPairs(rulesDependencies)

	return cycles.map(cycle => {
		const c = cycle.reverse()

		return c.reduce((acc, current) => {
			const previous = acc.slice(-1)[0]
			if (previous && !rulesDependenciesObject[previous].includes(current)) {
				return acc
			}
			return [...acc, current]
		}, [])
		// .map(name => [
		// 	name,
		// 	rulesDependenciesObject[name].filter(name => c.includes(name))
		// ])
	})
}
