import R from 'ramda'

/* Load yaml files */


let cotisationsContext = require.context(
  './parameters/prélèvements-sociaux-activité/cotisations', false,
  /.yaml$/)
let cotisationsTags = require('./parameters/prélèvements-sociaux-activité/cotisations/_cotisations.yaml')
let cotisations = R.pipe(
  R.map(cotisationsContext),
  //flatten
  R.unnest,
  R.map(R.mergeWith(R.merge, {tags: cotisationsTags}))
)(cotisationsContext.keys())

let cout = require('./parameters/prélèvements-sociaux-activité/cout-du-travail.yaml')

export default R.concat(
  cotisations,
  cout
)
