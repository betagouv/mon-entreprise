import R from 'ramda'
import removeDiacritics from '../utils/remove-diacritics'


import { createSelector } from 'reselect'
import {variablesSelector} from './selectors'
import traversalGuide from './traversalGuide'

/* AIM : Parse all the variables and extract their references to other variables.
Rank the results by count. */

// Use http://regexr.com/ to understand and write regexps !!

let credits = 3 // 5 complex variables

// let GETAdHocVariable = id =>
// 	new Promise((resolve, reject) =>
// 		setTimeout(() =>
// 			resolve(
// 				Math.random() > 0.6 && credits ?
// 					credits -- && {calls: ['myVar' + Math.random(), 'myVar2' + Math.random()]}
// 				:	'myInputVariable' + Math.random()
// 			),
// 			Math.random() * 2000 + 1000
// 		)
// 	)

let GETAdHocVariable = name =>
	new Promise(resolve =>
		window.fetch('https://api.openfisca.fr/api/1/variables/?name=' + name.trim().replace(/\s/g, '_'))
			.then(res => res.json())
			.then(json => {
				let {error, variables} = json
				if (error && JSON.stringify(error).indexOf('Variable does not exist') + 1){
					resolve('TODO ' + name)
				}
				if (variables) {
					let {name, formula} = variables[0]
					if (formula && formula['input_variables']) {
						resolve({calls: formula['input_variables']})
					} else {
						resolve(name)
					}
				}
			})
		)


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

let accum = [] //aaw

setTimeout(() => console.log(R.countBy(R.identity)(accum)), 10000)

let resolvePromisesRec =
	R.pipe(
		R.unless(R.isArrayLike, R.of),
		R.map(R.cond([
			[R.is(Promise), p => p.then(resolvePromisesRec)],
			[R.is(String), string => accum.push(string)]
		]))
	)

export let usedVariables = createSelector(
	[state => state.rootVariables, calculableVariables],
	(roots, variables) => {
		// get all variables from these roots, rec !
		return R.compose(
			// R.uniq,
			resolvePromisesRec,
			R.flatten,
			R.map(rootObject => findUsedVariables(variables, traversalGuide, rootObject)),
			R.map(root => findVariables(variables, removeDiacritics(root))[0])
		)(roots)

	}
)
