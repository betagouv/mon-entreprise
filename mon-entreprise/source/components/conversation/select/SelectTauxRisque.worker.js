import Fuse from 'fuse.js'

let fuse = null
onmessage = function(event) {
	if (event.data.options)
		fuse = new Fuse(event.data.options, {
			keys: ['Nature du risque', 'Catégorie'],
			shouldSort: true
		})

	if (event.data.input) {
		let results = fuse.search(event.data.input).map(({ item }) => item)
		postMessage(results)
	}
}
