let directoryLoaderFunction = require.context('./mécanismes', true, /.yaml$/)

let items = directoryLoaderFunction
	.keys()
	.map((key) => [key.replace(/\.\/|\.yaml/g, ''), directoryLoaderFunction(key)])

export default items
