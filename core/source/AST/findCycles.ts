/* eslint-disable prefer-rest-params */
/* eslint-disable @typescript-eslint/no-this-alias */
// Adapted from https://github.com/dagrejs/graphlib (MIT license)
// and https://github.com/lodash/lodash (MIT license)

// TODO: type this

function has(obj, key) {
	return obj != null && Object.prototype.hasOwnProperty.call(obj, key)
}
function constant(value) {
	return function (...args) {
		return value
	}
}

const DEFAULT_EDGE_NAME = '\x00'
const EDGE_KEY_DELIM = '\x01'

const incrementOrInitEntry = (map, k) => {
	if (map[k]) {
		map[k]++
	} else {
		map[k] = 1
	}
}

const decrementOrRemoveEntry = (map, k) => {
	if (!--map[k]) {
		delete map[k]
	}
}

const edgeArgsToId = (isDirected, v_, w_, name) => {
	let v = '' + v_
	let w = '' + w_
	if (!isDirected && v > w) {
		const tmp = v
		v = w
		w = tmp
	}
	return (
		v +
		EDGE_KEY_DELIM +
		w +
		EDGE_KEY_DELIM +
		(name === undefined ? DEFAULT_EDGE_NAME : name)
	)
}

const edgeArgsToObj = (isDirected, v_, w_, name) => {
	let v = '' + v_
	let w = '' + w_
	if (!isDirected && v > w) {
		const tmp = v
		v = w
		w = tmp
	}
	const edgeObj: any = { v: v, w: w }
	if (name) {
		edgeObj.name = name
	}
	return edgeObj
}

const edgeObjToId = (isDirected, edgeObj) => {
	return edgeArgsToId(isDirected, edgeObj.v, edgeObj.w, edgeObj.name)
}
export class Graph {
	private _nodeCount = 0
	private _edgeCount = 0

	private _isDirected: any

	private _label: undefined
	private _defaultNodeLabelFn: (...args: any[]) => any
	private _defaultEdgeLabelFn: (...args: any[]) => any
	private _nodes: Record<string, any>
	private _in: Record<string, any>
	private _preds: Record<string, Record<string, number>>
	private _out: Record<string, Record<string, string>>
	private _sucs: Record<string, Record<string, number>>
	private _edgeObjs: Record<any, any>
	private _edgeLabels: Record<any, string>

	constructor(opts: Record<string, boolean> = {}) {
		this._isDirected = has(opts, 'directed') ? opts.directed : true

		// Label for the graph itself
		this._label = undefined

		// Defaults to be set when creating a new node
		this._defaultNodeLabelFn = constant(undefined)

		// Defaults to be set when creating a new edge
		this._defaultEdgeLabelFn = constant(undefined)

		// v -> label
		this._nodes = {}

		// v -> edgeObj
		this._in = {}

		// u -> v -> Number
		this._preds = {}

		// v -> edgeObj
		this._out = {} as Record<string, Record<string, string>>

		// v -> w -> Number
		this._sucs = {}

		// e -> edgeObj
		this._edgeObjs = {}

		// e -> label
		this._edgeLabels = {}
	}

	/* === Graph functions ========= */

	isDirected() {
		return this._isDirected
	}
	setGraph(label) {
		this._label = label
		return this
	}
	graph() {
		return this._label
	}

	/* === Node functions ========== */

	nodeCount() {
		return this._nodeCount
	}
	nodes() {
		return Object.keys(this._nodes)
	}
	setNode(v, value: any = undefined) {
		if (has(this._nodes, v)) {
			if (arguments.length > 1) {
				this._nodes[v] = value
			}
			return this
		}

		this._nodes[v] = arguments.length > 1 ? value : this._defaultNodeLabelFn(v)
		this._in[v] = {}
		this._preds[v] = {}
		this._out[v] = {}
		this._sucs[v] = {}
		++this._nodeCount
		return this
	}
	setNodes(vs, value) {
		vs.forEach((v) => {
			if (value !== undefined) {
				this.setNode(v, value)
			} else {
				this.setNode(v)
			}
		})
		return this
	}
	node(v) {
		return this._nodes[v]
	}
	hasNode(v) {
		return has(this._nodes, v)
	}
	successors(v) {
		const sucsV = this._sucs[v]
		if (sucsV) {
			return Object.keys(sucsV)
		}
	}

	/* === Edge functions ========== */

	edgeCount() {
		return this._edgeCount
	}
	edges() {
		return Object.values(this._edgeObjs)
	}
	setEdge(
		v: string,
		w: string,
		value: any = undefined,
		name: string | undefined = undefined
	) {
		v = '' + v
		w = '' + w

		const e = edgeArgsToId(this._isDirected, v, w, name)
		if (has(this._edgeLabels, e)) {
			if (value !== undefined) {
				this._edgeLabels[e] = value
			}
			return this
		}

		// It didn't exist, so we need to create it.
		// First ensure the nodes exist.
		this.setNode(v)
		this.setNode(w)

		this._edgeLabels[e] =
			value !== undefined ? value : this._defaultEdgeLabelFn(v, w, name)

		const edgeObj = edgeArgsToObj(this._isDirected, v, w, name)
		// Ensure we add undirected edges in a consistent way.
		v = edgeObj.v
		w = edgeObj.w

		Object.freeze(edgeObj)
		this._edgeObjs[e] = edgeObj
		incrementOrInitEntry(this._preds[w], v)
		incrementOrInitEntry(this._sucs[v], w)
		this._in[w][e] = edgeObj
		this._out[v][e] = edgeObj
		this._edgeCount++
		return this
	}

	edge(v, w, name) {
		const e =
			arguments.length === 1
				? edgeObjToId(this._isDirected, arguments[0])
				: edgeArgsToId(this._isDirected, v, w, name)
		return this._edgeLabels[e]
	}

	hasEdge(v, w, name) {
		const e =
			arguments.length === 1
				? edgeObjToId(this._isDirected, arguments[0])
				: edgeArgsToId(this._isDirected, v, w, name)
		return has(this._edgeLabels, e)
	}

	removeEdge(v, w, name) {
		const e =
			arguments.length === 1
				? edgeObjToId(this._isDirected, arguments[0])
				: edgeArgsToId(this._isDirected, v, w, name)
		const edge = this._edgeObjs[e]
		if (edge) {
			v = edge.v
			w = edge.w
			delete this._edgeLabels[e]
			delete this._edgeObjs[e]
			decrementOrRemoveEntry(this._preds[w], v)
			decrementOrRemoveEntry(this._sucs[v], w)
			delete this._in[w][e]
			delete this._out[v][e]
			this._edgeCount--
		}
		return this
	}

	outEdges(v: string, w: string | undefined = undefined) {
		const outV = this._out[v]
		if (outV) {
			const edges: any = Object.values(outV)
			if (w === undefined) {
				return edges
			}
			return edges.filter(function (edge) {
				return edge.w === w
			})
		}
	}
}

/** Cycles stuff **/

function tarjan(graph) {
	let index = 0
	const stack: any[] = []
	const visited = {} // node id -> { onStack, lowlink, index }
	const results: any[] = []

	function dfs(v) {
		const entry = (visited[v] = {
			onStack: true,
			lowlink: index,
			index: index++,
		})
		stack.push(v)

		graph.successors(v).forEach(function (w) {
			if (!Object.prototype.hasOwnProperty.call(visited, w)) {
				dfs(w)
				entry.lowlink = Math.min(entry.lowlink, visited[w].lowlink)
			} else if (visited[w].onStack) {
				entry.lowlink = Math.min(entry.lowlink, visited[w].index)
			}
		})

		if (entry.lowlink === entry.index) {
			const cmpt: any[] = []
			let w
			do {
				w = stack.pop()
				visited[w].onStack = false
				cmpt.push(w)
			} while (v !== w)
			results.push(cmpt)
		}
	}

	graph.nodes().forEach(function (v) {
		if (!Object.prototype.hasOwnProperty.call(visited, v)) {
			dfs(v)
		}
	})

	return results
}

export function findCycles(graph): string[][] {
	return tarjan(graph).filter(function (cmpt) {
		return (
			cmpt.length > 1 || (cmpt.length === 1 && graph.hasEdge(cmpt[0], cmpt[0]))
		)
	})
}
