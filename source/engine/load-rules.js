import R from 'ramda'

// This is a mock of webpack's require.context, for testing purposes
if (typeof __webpack_require__ === 'undefined') {
	const fs = require('fs')
	const path = require('path')

	require.context = (
		base = '.',
		scanSubDirectories = false,
		regularExpression = /\.js$/
	) => {
		const yaml = require('js-yaml')

		const files = {}

		function readDirectory(directory) {
			fs.readdirSync(directory).forEach(file => {
				const fullPath = path.resolve(directory, file)

				if (fs.statSync(fullPath).isDirectory()) {
					if (scanSubDirectories) readDirectory(fullPath)

					return
				}

				if (!regularExpression.test(fullPath)) return

				files[fullPath] = true
			})
		}

		readDirectory(path.resolve(__dirname, base))

		function Module(file) {
			return yaml.safeLoad(fs.readFileSync(file, 'utf8'))
		}

		Module.keys = () => Object.keys(files)

		return Module
	}
}

// This array can't be generated, as the arguments to require.context must be literals :-|
let directoryLoaders = [
	require.context('../../règles/rémunération-travail/cdd', true, /.yaml$/),
	require.context(
		'../../règles/rémunération-travail/entités/ok',
		true,
		/.yaml$/
	),
	require.context(
		'../../règles/rémunération-travail/cotisations/ok',
		true,
		/.yaml$/
	),
	require.context('../../règles/rémunération-travail/aides/ok', true, /.yaml$/)
]

// require.context returns an object which
// a) is a function behaving like 'requires', taking a filename and returning a module and
// b) has additional properties, some function-valued; keys() returns the files matched
// A "module" is simply the contents of a file according to a Webpack loader; this can be JS, JSON, etc.
// Thus, this weird loadAll returns an array, each item of which is the contents of each file in a directory
let loadAll = directoryLoaderFunction =>
	directoryLoaderFunction.keys().map(directoryLoaderFunction)

let rules = R.pipe(R.map(loadAll), R.flatten, R.reject(R.isNil))(
	directoryLoaders
)

export default rules
