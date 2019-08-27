import airports from './airports.csv'
import { pick } from 'ramda'
import Fuse from 'fuse.js'

let searchWeights = [
	{
		name: 'ville',
		weight: 0.3
	},
	{
		name: 'nom',
		weight: 0.2
	},
]

let fuse = new Fuse(
	airports.map(pick(['ville', 'nom', 'pays', 'latitude', 'longitude'])),
	{
		keys: searchWeights
	}
)

onmessage = function(event) {
	var results = fuse.search(event.data.input)
	postMessage({ which: event.data.which, results })
}
