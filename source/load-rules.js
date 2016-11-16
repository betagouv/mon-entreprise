import R from 'ramda'

/* Load yaml files */

let context = require.context(
  '../règles/rémunération-travail/cotisations', false,
  /([a-zA-Z]|\.|-|_)+.yaml$/)


let rules = R.pipe(
  R.map(context),
  //flatten
  R.unnest,
)(context.keys())

export default rules
