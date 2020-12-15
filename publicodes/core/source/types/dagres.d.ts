declare module '@dagrejs/graphlib' {
	export interface Graph {
		setEdge(n1: string, n2: string): void
	}
	export type alg = {
		findCycles: (g: Graph) => Array<Array<string>>
	}
}
