/* Load all yaml files in a dir */
let requireContext = require.context('./parameters/cotisations', false, /(chomage|agirc|arrco|agff).yaml$/)
export default requireContext.keys()
  .map( requireContext )
  //flatten
  .reduce((acc, next) => acc.concat(next), [])
