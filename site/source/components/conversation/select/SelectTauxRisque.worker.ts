import Fuse from 'fuse.js'

import { Result } from './SelectTauxRisque'

let fuse: Fuse<Result> | null = null

onmessage = function (
	event: MessageEvent<{ options: Result[]; input: string }>
) {
	if (event.data.options)
		fuse = new Fuse(event.data.options, {
			keys: ['Nature du risque', 'Catégorie'],
			shouldSort: true,
		})

	if (event.data.input && fuse) {
		const results = fuse.search(event.data.input).map(({ item }) => item)
		postMessage(results)
	}
}
