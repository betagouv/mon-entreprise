/* Load all yaml files in a dir */
let requireContext = require.context('./parameters/prélèvements-sociaux-activité/cotisations', false, /(vieillesse|chomage|agirc|arrco|agff).yaml$/)
export default requireContext.keys()
  .map( requireContext )
  //flatten
  .reduce((acc, next) => acc.concat(next), [])
