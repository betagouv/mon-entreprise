import graphlib from '@dagrejs/graphlib'
import parseRules from '../parseRules'
import { Rules } from '../types'
import {
	buildRulesDependencies,
	RulesDependencies,
	DependencyType
} from './rulesDependencies'

type Graph = any
type GraphNodeRepr = string
type GraphCycles = Array<Array<GraphNodeRepr>>

function buildNaiveDependenciesGraph<Names extends string>(
	rulesDeps: RulesDependencies<Names>
): Graph {
	const g = new graphlib.Graph()

	rulesDeps.forEach(([ruleDottedName, dependencies]) => {
		dependencies.forEach(([depDottedName, depType]) => {
			g.setEdge(ruleDottedName, depDottedName, { type: depType })
		})
	})

	return g
}

/**
 * If a part of a graph is like:
 *	A -formule-> B
 *	B -replacedBy-> A
 * (what is called a "remplace one-level loop" or "ROLL")
 * then split it in two separated sub-graphs
 *  Af -formule-> Bf
 *  Br -replacedBy-> Ar
 * and re-plug the other edges related to A and B on Af, Bf, Ar and Br.
 *
 * This operation is destroying the initial loop, and corresponds closely to
 * the behavior of the `parseReference.js:getApplicableReplacedBy` function.
 */
export function flattenOneLevelRemplaceLoops(naiveGraph: Graph) {
	const replacedByEdges = naiveGraph
		.edges()
		.filter(e => naiveGraph.edge(e).type == DependencyType.replacedBy)
	const ROLLEdges = replacedByEdges.flatMap(e => {
		// Note: there is at max one such reverse edge, because graphlib doesn't
		// store more than one edge with the same in and out.
		const reverseEdges = naiveGraph.inEdges(e.v, e.w)
		if (
			reverseEdges.length > 0 &&
			naiveGraph.edge(reverseEdges[0]).type == DependencyType.formule
		) {
			return [e, reverseEdges[0]]
		} else {
			return []
		}
	})

	// Map with default Set values:
	const ROLLNodesTypes = new Proxy(
		{},
		{
			get: (target, name) =>
				name in target ? target[name] : (target[name] = new Set())
		}
	)
	ROLLEdges.forEach(e => {
		ROLLNodesTypes[e.v].add(naiveGraph.edge(e).type)
		ROLLNodesTypes[e.w].add(naiveGraph.edge(e).type)
	})

	const flattenedGraph = new graphlib.Graph()

	const specifyNodeName = (depType, nodeName) =>
		`${nodeName} [depType: ${depType}]`

	naiveGraph.edges().forEach(e => {
		// Nodes which are forming the one-level remplace loop: duplicate them so as
		// to have 2 independent sub-graphs: one representing the formule
		// dependency, the other representing the remplace dependency.
		if (ROLLEdges.includes(e)) {
			const edgeType = naiveGraph.edge(e).type
			flattenedGraph.setEdge(
				specifyNodeName(edgeType, e.v),
				specifyNodeName(edgeType, e.w),
				{ type: edgeType }
			)
		}

		// Edges which are incoming or outgoing of the loop nodes: duplicate them on
		// sub-graphs.
		// Outgoing:
		else if (e.v in ROLLNodesTypes) {
			ROLLNodesTypes[e.v].forEach(depType => {
				flattenedGraph.setEdge(specifyNodeName(depType, e.v), e.w, {
					type: naiveGraph.edge(e).type
				})
			})
		}
		// Incoming:
		else if (e.w in ROLLNodesTypes) {
			// [XXX] To remove:
			if (e.v in ROLLNodesTypes) {
				throw new Error('shouldnt happen')
			}
			ROLLNodesTypes[e.w].forEach(depType => {
				flattenedGraph.setEdge(e.v, specifyNodeName(depType, e.w), {
					type: naiveGraph.edge(e).type
				})
			})
		}

		// Edges which are un-related: just copy them.
		else {
			flattenedGraph.setEdge(e.v, e.w, { type: naiveGraph.edge(e).type })
		}
	})
	return flattenedGraph
}

export function cyclicDependencies<Names extends string>(
	rawRules: Rules<Names> | string
): GraphCycles {
	const parsedRules = parseRules(rawRules)
	const rulesDependencies = buildRulesDependencies(parsedRules)
	const naiveGraph = buildNaiveDependenciesGraph(rulesDependencies)
	const flattenedGraph = flattenOneLevelRemplaceLoops(naiveGraph)
	debugger
	return graphlib.alg.findCycles(flattenedGraph)
}
