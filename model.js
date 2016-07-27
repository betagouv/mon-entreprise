import parameters from './load-parameters'
import deepAssign from 'deep-assign'
import R from 'ramda'

/* Fonctions utiles */
let
	hasHistoryProp = R.pipe(JSON.stringify, R.contains('"historique":')),
	itemHasHistoricProp = (item, prop) => R.has(prop)(item) && hasHistoryProp(item[prop]),
	itemIsCalculable = item =>
		itemHasHistoricProp(item, 'linear') || itemHasHistoricProp(item, 'marginalRateTaxScale'),

	/*
		L'attribut tags est une hash map,
		ou une liste
		- de clés, qui sont un moyen courant d'exprimer [clef]: oui
		- de hash maps.
		Cette fonction fusionne tout ceci dans un objet

	*/
	handleHybridTags = R.when(R.isArrayLike,
		R.reduce((final, tag) =>
			R.merge(final, R.is(Object, tag) ? tag : {[tag]: 'oui'})
		, {})
	),

	tagsConflict = (tags1, tags2) =>
		R.compose(
			R.any(R.identity),
			R.values,
			R.mapObjIndexed((tagValue, tag) => tags2[tag] != undefined && tags2[tag] !== tagValue)
		)(tags1)

let
	groupedItemsByVariable = R.pipe(
		// Desugar tags
		R.map(p => R.merge(p, {tags: handleHybridTags(p.tags)})),
		R.groupBy(R.prop('variable'))
	)(parameters),
	mergedItemsByVariable =
		R.mapObjIndexed((variableItems, name) => {
			/* 	Les items sont des fragments de variables.
					Les premiers fragments vont être fusionnés dans les suivants,
					sauf s'ils provoquent l'écrasement d'un tag */
			let mergedVariableItems = R.tail(variableItems) // Le premier ne peut être étendu
			.reduce((mergedItems, item) =>
				[	...mergedItems,
					mergedItems.reduce((final, higherLevelItem) => {
						let oups = tagsConflict(higherLevelItem.tags, item.tags)
						return oups ? item : deepAssign({}, item, higherLevelItem)
					}, item)
				], R.of(R.head(variableItems)))

			return {
				name,
				// La variable de haut niveau, contenant la plupart du temps une description, etc.
				first: R.head(variableItems),
				// Tous les tags qui peuvent être trouvés dans les items de cette variable
				tags: R.pipe(
					R.pluck('tags'),
					R.map(R.map(R.of)),
					R.reduce(R.mergeWith(R.union), {})
				)(variableItems),
				// Gardons seulement les variables ayant une implémentation : capable de faire un calcul
				calculable: R.filter(itemIsCalculable)(mergedVariableItems)
			}}
		)(groupedItemsByVariable)

let	calculableItems =
		R.pipe(
			R.values,
			R.pluck('calculable'),
			R.unnest
		)(mergedItemsByVariable),
	mergedItems = R.values(mergedItemsByVariable)

export {
	groupedItemsByVariable,
	calculableItems,
	mergedItems
}
