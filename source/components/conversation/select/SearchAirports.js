import airports from './airports.csv'
import Fuse from 'fuse.js'

let searchWeights = [
	{
		name: 'ville',
		weight: 0.3
	},
	{
		name: 'nom',
		weight: 0.2
	}
]

let fuse = new Fuse(airports, {
	keys: searchWeights
})

onmessage = function(event) {
	var results = fuse.search(event.data.input)
	postMessage({ which: event.data.which, results })
}
