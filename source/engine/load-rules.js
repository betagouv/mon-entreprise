import R from 'ramda'

/*
TODO sélection temporaire de dossier, tant que toute la base de règles n'est pas vérifiée
*/

let requireAll = requireContext =>
  requireContext.keys().map(requireContext)

let rules= R.pipe(
  R.chain(
    requireAll,
  ),
  R.unnest,
  R.reject(R.isNil)
)( // This array can't be generated, as the arguments to require.context can't be literals :-|
  [
  require.context(
    '../../règles/rémunération-travail/cdd',
    true, /([A-Za-z\u00C0-\u017F]|\.|-|_)+.yaml$/),
  require.context(
    '../../règles/rémunération-travail/entités/ok',
    true, /([A-Za-z\u00C0-\u017F]|\.|-|_)+.yaml$/),
  require.context(
    '../../règles/rémunération-travail/cotisations/ok',
    true, /([A-Za-z\u00C0-\u017F]|\.|-|_)+.yaml$/),
])


export default rules
