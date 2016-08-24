import R from 'ramda'
import removeDiacritics from '../utils/remove-diacritics'


import { createSelector } from 'reselect'
import {variablesSelector} from './selectors'
import traversalGuide from './traversalGuide'

import dump from 'json!../adhoc-variable-dump/variables.json'

/* AIM : Parse all the variables and extract their references to other variables.
Rank the results by count. */

// Use http://regexr.com/ to understand and write regexps !!
let fetchVariables = false

let resolveVariable = (variable, name, callback) => {
	if (variable == null) return callback('TODO ' + name)
	let {formula} = variable
	if (formula && formula['input_variables']) {
		return callback({calls: formula['input_variables']})
	} else {
		return callback(name)
	}
}

let GETAdHocVariable = name => {
	let obscureName = name.trim().replace(/\s/g, '_')
	if (!fetchVariables){
		return new Promise(
			resolve => resolveVariable(
				dump.variables.find(v => v.name === obscureName),
				name,
				resolve)
		)
	}
	return new Promise(resolve =>
		window.fetch('https://api.openfisca.fr/api/1/variables/?name=' + obscureName)
			.then(res => res.json())
			.then(json => {
				let {error, variables} = json
				if (error && JSON.stringify(error).indexOf('Variable does not exist') + 1){
					resolveVariable(null, name, resolve)
				}
				if (variables) {
					resolveVariable(variables[0], name, resolve)
				}
			})
		)
}


async function getAdHocVariables(id) {
	let variable = await GETAdHocVariable(id)
	if (R.is(String, variable))
		return variable
	else
		return Promise.all(
			variable.calls.map(getAdHocVariables)
		)
}

// Returns a list of list of used variables
// recursive function
let findUsedVariables = (variables, schema, toAnalyse) =>
	/*TODO
	If instruction of GET call -> return Promise
	1) input var OK return string
	2) call to other variables -> list of promises
	*/
	R.cond([
		[R.isNil, () => []],
		[R.has('adHoc'), ({id}) => getAdHocVariables(id)],
		// The traversal of variables has found a parsable variable attribute.
		// Parse it to extract variables
		[R.is(Function), extractor =>
			R.pipe(
				extractor,
				R.unless(R.isArrayLike, R.of),
				R.map(R.cond([
					[R.is(String), name => findVariables(variables, name)],
					[R.is(Object), tags => findVariables(variables, null, tags)]
				])),
				R.unnest,
				R.map(
					/*TODO
					if instruction of GET call findUsedVariables(GET CALL)
						*/
					R.cond([
						[R.has('adHoc'), adHocSpec => findUsedVariables(variables, adHocSpec)],
						[R.is(String), R.identity],
						[R.T, found => findUsedVariables(variables, traversalGuide, found)]
					])
				)
			)(toAnalyse)
		],
		// Walk the graph using the guiding object until you find a parsable attribute
		[R.is(Object), traversalObject =>
			R.toPairs(traversalObject).reduce(
				(res, [key, value]) => {
					return toAnalyse[key] != null ?
						[...res, ...findUsedVariables(variables, value, toAnalyse[key])] :
						res
				}, []
		)],
		[R.T, () => []]
	])(schema)


let calculableVariables = createSelector(
	[variablesSelector],
	R.pipe(R.pluck('calculable'), R.unnest)
)

/************************************
 Functions to find variables */

let findVariablesByName = name =>
	R.filter(variable => removeDiacritics(variable.variable) == name)

let findVariablesByTags = tags =>
	R.filter(R.pipe(
		R.prop('tags'),
		R.whereEq(tags)
	))

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
	// Should do a query to openfisca web api
	({adHoc: true, id: name})

let variableNameCollision = (name, tags) =>
	`More than one variable corresponds to this name, tags tuple : ${name}, ${tags}`

/*****************************************/

export let usedVariables = createSelector(
	[state => state.rootVariables, calculableVariables],
	(roots, variables) => {
		// get all variables from these roots, rec !
		return R.compose(
			promises =>
				Promise.all(promises).then(
					R.pipe(
						R.flatten,
						R.countBy(R.identity),
						R.toPairs,
						R.sortBy(R.last),
						R.reverse
					)
				),
			R.flatten,
			R.map(rootObject => findUsedVariables(variables, traversalGuide, rootObject)),
			R.map(root => findVariables(variables, removeDiacritics(root))[0])
		)(roots)

	}
)
