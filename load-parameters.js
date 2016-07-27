/* Load all yaml files in a dir */
let requireContext = require.context(
  './parameters/prélèvements-sociaux-activité/cotisations', false,
  /(agff|agirc|ags|apec|arrco|chomage|vieillesse|contribution_solidarité_autonomie|cotisation_exceptionnelle_temporaire).yaml$/)
export default requireContext.keys()
  .map( requireContext )
  //flatten
  .reduce((acc, next) => acc.concat(next), [])
