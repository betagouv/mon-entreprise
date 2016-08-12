import R from 'ramda'
import removeDiacritics from '../utils/remove-diacritics'


import { createSelector } from 'reselect'
import {variablesSelector} from './selectors'
import traversalGuide from './traversalGuide'

/* AIM : Parse all the variables and extract their references to other variables.
Rank the results by count. */

// Use http://regexr.com/ to understand and write regexps !!



// Returns a list of used variables
let findUsedVariables = (schema, toAnalyse, variables) =>
	R.cond([
		[R.is(Function), extractor =>
			R.pipe(
				extractor,
				R.unless(R.isArrayLike, R.of),
				R.map(R.cond([
					[R.is(String), name => findVariables(variables, name)],
					[R.is(Object), tags => findVariables(variables, null, tags)]
				])),
				R.unnest,
				R.map(R.unless(R.is(String), found => findUsedVariables(traversalGuide, found, variables)))
			)(toAnalyse)
		],
		[R.is(Object), traversalObject =>
			R.toPairs(traversalObject).reduce(
				(res, [key, value]) => {
					return toAnalyse[key] != null ?
						[...res, ...findUsedVariables(value, toAnalyse[key], variables)] :
						res
				}, []
		)],
		[R.T, yo => []]
	])(schema)

		// R.cond([
		// 	[R.isArrayLike, R.map(name => {
		// 		let found = findVariables(variables, name)
		// 		return typeof found == 'object' ?
		// 			findUsedVariables(traversalGuide, found, variables)
		// 		: found
		// 	})],
		// 	[R.is(Object), tags => {
		// 		let found = findVariables(variables, null, tags)
		// 		return typeof found == 'object' ?
		// 			findUsedVariables(traversalGuide, found, variables)
		// 		: found
		// 	}]
		// ])(schema(toAnalyse))


let calculableVariables = createSelector(
	[variablesSelector],
	R.pipe(R.pluck('calculable'), R.unnest)
)


// let data = require('../sertarien.yaml')
// let getAllUsedVariables = R.pipe(
// 	R.map(findUsedVariables(traversalGuide)),
// 	R.flatten,
// 	R.countBy(R.identity),
// 	R.toPairs,
// 	R.sortBy(R.last),
// 	R.reverse,
// 	R.map(R.join(': '))
// )

let findVariablesByName = name =>
	R.filter(variable => removeDiacritics(variable.variable) == name)

let findVariablesByTags = tags =>
	R.filter(R.pipe(
		R.prop('tags'),
		R.whereEq(tags)
	))
//
// let findVariables = (variables, name, tags) => {
// 	// Raise error if searching on both name and tags provided gives multiple results
// 	let results = variables
// 	if (R.is(String, name)) {
// 		results = findVariablesByName(name)(variables)
// 		if (!results.length)
// 			return `Final variable ${name}`
// 	}
// 	if (tags != null) {
// 		results = findVariablesByTags(tags)(variables)
// 	}
// 	if (results.length == 0)
// 		return `Final variable ${name}`
// 	if (name != null && results.length > 1)
// 		return `More than one variable corresponds to this name, tags tuple : ${name}, ${tags}`
//
// 	return results
// }

let findVariables = (variables, name, tags) =>
	R.pipe(
		variables => R.is(String, name)
			? findVariablesByName(name)(variables)
			: variables,
		variables => R.is(Object, tags)
			? findVariablesByTags(tags)(variables)
			: variables,
		R.cond([
			[	R.isEmpty, () => variableNotFound(name)],
			[	(variables) => R.is(String, name) && variables.length > 1,
				() => variableNameCollision(name, tags)],
			[	R.T,
				R.identity]
		]),
	)(variables)

let variableNotFound = name =>
	`Final variable ${name}`
	// Should do a query to openfisca web api
	// - input var -> end with an input var object
	// - var calling other vars -> recursively call

let variableNameCollision = (name, tags) =>
	`More than one variable corresponds to this name, tags tuple : ${name}, ${tags}`


export let usedVariables = createSelector(
	[state => state.rootVariables, calculableVariables],
	(roots, variables) => {
		// get all variables from these roots, rec !
		return R.compose(
			R.uniq,
			R.flatten,
			R.map(rootObject => findUsedVariables(traversalGuide, rootObject, variables)),
			R.map(root => findVariables(variables, removeDiacritics(root))[0])
		)(roots)

	}
)


// export let usedVariables = createSelector(
// 	[calculableVariables],
// 	getAllUsedVariables
// )
