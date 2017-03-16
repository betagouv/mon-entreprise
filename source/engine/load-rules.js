import R from 'ramda'

/* TODO Ce fichier n'est pas propre.

C'est temporaire (séparation artificielle entre les règles d'entités et les règles d'objectif)
Elles seront à termes toutes dans le même fichier, ou toutes dans leur fichier respectif

*/

let objectivesContext = require.context(
  '../../règles/rémunération-travail/cdd', true,
  /([a-zA-Z]|-|_)+.yaml$/)

let entityContext = require.context(
  '../../règles/entités/salariat', true,
  /([a-zA-Z]|-|_)+.yaml$/)


let objectives = R.pipe(
  R.map(objectivesContext),
  R.unnest,
)(objectivesContext.keys())


let entities = R.pipe(
  R.map(entityContext),
  R.unnest,
)(entityContext.keys())


export default [...objectives, ...entities].filter(r => r != null)
