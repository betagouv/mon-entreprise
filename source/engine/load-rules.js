import R from 'ramda'

/*
TODO sélection temporaire de dossier, tant que toute la base de règles n'est pas vérifiée
*/

let objectivesContext = require.context(
  '../../règles/rémunération-travail/cdd', true,
  // /([a-zA-Z]|-|_)+.yaml$/)
  /(CIF|indemnité_fin_contrat|indemnité_compensatrice_congés_payés|majoration-chomage).yaml/)


let entityContext = require.context(
  '../../règles/rémunération-travail/entités/ok', true)


let objectives = R.pipe(
  R.map(objectivesContext),
  R.unnest,
)(objectivesContext.keys())


let entities = R.pipe(
  R.map(entityContext),
  R.unnest,
)(entityContext.keys())


export default [...objectives, ...entities].filter(r => r != null)
