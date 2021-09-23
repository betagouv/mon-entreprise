import { ASTNode } from './types'
import parsePublicodes from '../parsePublicodes'
import { RuleNode } from '../rule'
import { getChildrenNodes, iterAST } from './index'
import { findCycles, Graph } from './findCycles'

type RulesDependencies = [string, string[]][]
type GraphCycles = string[][]

function buildRulesDependencies(
	parsedRules: Record<string, RuleNode>
): RulesDependencies {
	const uniq = <T>(arr: Array<T>): Array<T> => [...new Set(arr)]
	return Object.entries(parsedRules).map(([name, node]) => [
		name,
		uniq(getDependencies(node)),
	])
}

function getReferenceName(node: ASTNode): string | undefined {
	switch (node.nodeKind) {
		case 'reference':
			return node.dottedName as string
	}
}
/**
 * Recursively selects the children nodes that have the ability to include a reference
 * to a rule.
 */
function getReferencingDescendants(node: ASTNode): ASTNode[] {
	return iterAST((node) => {
		switch (node.nodeKind) {
			case 'replacementRule':
			case 'inversion':
			case 'une possibilité':
			case 'reference':
			case 'résoudre référence circulaire':
				// "résoudre référence circulaire" is a chained mechanism. When returning `[]` we prevent
				// iteration inside of the rule's `valeur`, meaning the rule returns no descendants at all.
				return []
			case 'recalcul':
				return node.explanation.amendedSituation.map(([, astNode]) => astNode)
			case 'rule':
				return [node.explanation.valeur]
			case 'variations':
				if (node.visualisationKind === 'replacement') {
					return node.explanation
						.filter(({ condition }) => condition.isDefault)
						.map(({ consequence }) => consequence)
						.filter((consequence) => consequence.nodeKind === 'reference')
				}
		}
		return getChildrenNodes(node)
	}, node)
}
function getDependencies(node: ASTNode): string[] {
	const descendantNodes = Array.from(getReferencingDescendants(node))
	const descendantsReferences = descendantNodes
		.map(getReferenceName)
		.filter((refName): refName is string => refName !== undefined)
	return descendantsReferences
}

function buildDependenciesGraph(rulesDeps: RulesDependencies) {
	const g = new Graph()
	rulesDeps.forEach(([ruleDottedName, dependencies]) => {
		dependencies.forEach((depDottedName) => {
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
	const cycles = findCycles(dependenciesGraph)

	return cycles.map((c) => c.reverse())
}

/**
 * Make the cycle as small as possible.
 */
export function squashCycle(
	rulesDependenciesObject: Record<string, string[]>,
	cycle: string[]
): string[] {
	function* loopFrom(i: number) {
		let j = i
		while (true) {
			yield cycle[j++ % cycle.length]
		}
	}
	const smallCycleStartingAt: string[][] = []
	for (let i = 0; i < cycle.length; i++) {
		const smallCycle: string[] = []
		let previousVertex: string | undefined = undefined
		for (const vertex of loopFrom(i)) {
			if (previousVertex === undefined) {
				smallCycle.push(vertex)
				previousVertex = vertex
			} else if (rulesDependenciesObject[previousVertex].includes(vertex)) {
				if (smallCycle.includes(vertex)) {
					smallCycle.splice(0, smallCycle.lastIndexOf(vertex))
					break
				}
				smallCycle.push(vertex)
				previousVertex = vertex
			}
		}
		smallCycleStartingAt.push(smallCycle)
	}

	const smallest = smallCycleStartingAt.reduce((minCycle, someCycle) =>
		someCycle.length > minCycle.length ? minCycle : someCycle
	)
	return smallest
}

/**
 * This function is useful so as to print the dependencies at each node of the
 * cycle.
 * ⚠️  Indeed, the findCycles function returns the cycle found using the
 * Tarjan method, which is **not necessarily the smallest cycle**. However, the
 * smallest cycle is more readable.
 */
export function cyclicDependencies(
	rawRules: RawRules
): [GraphCycles, string[]] {
	const parsedRules = parsePublicodes(rawRules)
	const rulesDependencies = buildRulesDependencies(parsedRules)
	const dependenciesGraph = buildDependenciesGraph(rulesDependencies)
	const cycles = findCycles(dependenciesGraph)

	const reversedCycles = cycles.map((c) => c.reverse())
	const rulesDependenciesObject = Object.fromEntries(
		rulesDependencies
	) as Record<string, string[]>
	const smallCycles = reversedCycles.map((cycle) =>
		squashCycle(rulesDependenciesObject, cycle)
	)

	const printableStronglyConnectedComponents = reversedCycles.map((c, i) =>
		printInDotFormat(dependenciesGraph, c, smallCycles[i])
	)

	return [smallCycles, printableStronglyConnectedComponents]
}

/**
 * Is edge in the cycle, in the same order?
 */
const edgeIsInCycle = (cycle: string[], v: string, w: string): boolean => {
	for (let i = 0; i < cycle.length + 1; i++) {
		if (v === cycle[i] && w === cycle[(i + 1) % cycle.length]) return true
	}
	return false
}

export function printInDotFormat(
	dependenciesGraph: Graph,
	cycle: string[],
	subCycleToHighlight: string[]
) {
	const edgesSet = new Set()
	cycle.forEach((vertex) => {
		dependenciesGraph
			.outEdges(vertex)
			.filter(({ w }) => cycle.includes(w))
			.forEach(({ v, w }) => {
				edgesSet.add(
					`"${v}" -> "${w}"` +
						(edgeIsInCycle(subCycleToHighlight, v, w) ? ' [color=red]' : '')
				)
			})
	})
	return `digraph Cycle {\n\t${[...edgesSet].join(';\n\t')};\n}`
}
