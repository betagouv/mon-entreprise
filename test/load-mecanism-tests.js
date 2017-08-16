import R from 'ramda'

// This array can't be generated, as the arguments to require.context must be literals :-|
let directoryLoaders =
  [

  ]

// require.context returns an object which
// a) is a function behaving like 'requires', taking a filename and returning a module and
// b) has additional properties, some function-valued; keys() returns the files matched
// A "module" is simply the contents of a file according to a Webpack loader; this can be JS, JSON, etc.
// Thus, this weird loadAll returns an array, each item of which is the contents of each file in a directory
let loadAll = directoryLoaderFunction =>
  directoryLoaderFunction.keys().map(directoryLoaderFunction)

let directoryLoaderFunction =
	require.context('./mécanismes', true, /.yaml$/)

let items =
  loadAll(directoryLoaderFunction)
console.log('items', items)
export default items
