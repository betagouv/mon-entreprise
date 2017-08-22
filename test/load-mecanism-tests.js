import R from 'ramda'

let directoryLoaderFunction =
	require.context('./mécanismes', true, /.yaml$/)

let items = directoryLoaderFunction.keys().map(directoryLoaderFunction)

export default items
