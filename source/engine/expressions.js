import R from 'ramda'
import {parentName, nameLeaf, findRuleByDottedName} from './rules'

// Ces regexp sont trop complexe. TODO Ce n'est que temporaire !

// composants des regexps
let
	vp = '[A-Za-z\\u00C0-\\u017F\\s]+', // variable part
	sep = '\\s\\.\\s',
	vn = `(${vp}(?:${sep}${vp})*)`

//TODO rewrite expressionTests to contain the awful code of the recognizeExpression swith
let expressionTests = {
	// 'negatedVariable': v => /!((?:[a-z0-9]|\s|_)+)/g.exec(v),
	// 'variableIsIncludedIn': v => /((?:[a-z0-9]|\s|_)+)⊂*/g.exec(v),
	// 'variableComparedToNumber': v => /([\w\s]+(?:\s\.\s[\w\s]+)*)\s([<>]=?)\s([0-9]+)/g.exec(v),
	'variableComparedToNumber': v => new RegExp(`^${vn}\\s([<>]=?)\\s([0-9]+)$`, 'g').exec(v),
	'variableEqualsString': v => /([\w\s]+(?:\s\.\s[\w\s]+)*)\s=\s([\w\s]+)/g.exec(v),
	'variable': v => new RegExp(`^${vn}$`, 'g').exec(v)
}

/* Les variables peuvent être exprimées dans une règle relativement à son contexte, son 'attache', pour une plus grande lisibilité. Cette fonction résoud cette ambiguité.
*/
let completeVariableName = ({attache, name}, partialName) => {
	return partialName
	let
		fragments = attache.split(' . '),
		pathPossibilities = R.pipe(
      R.length,
      R.inc,
			R.range(1),
			R.map(R.take(R.__, fragments)),
			R.reverse
		)(fragments),

		found = R.reduce((res, path) =>
			R.when(
				R.is(Object), R.reduced
			)(findRuleByDottedName([...path, partialName].join(' . ')))
		, null, pathPossibilities)

	found && found.dottedName || do {throw `OUUUUPS la référence ${partialName} dans la règle : ${name} est introuvable dans la base`}
}



export let recognizeExpression = (rule, value) => {
	let match

	// match = expressionTests['negatedVariable'](value)
	// if (match) {
	// 	let [, variableName] = match
	// 	// return [variableName, `!${variableName}`]
	// 	return [variableName, situation => situation(variableName) == 'non']
	// }

	match = expressionTests['variableComparedToNumber'](value)
	if (match) {

		let [, variablePartialName, symbol, number] = match,
			variableName = completeVariableName(rule, variablePartialName)
		return [variableName, situation => eval(`situation("${variableName}") ${symbol} ${number}`)] // eslint-disable-line no-unused-vars
	}

	match = expressionTests['variableEqualsString'](value)
	if (match) {
		let [, variablePartialName, string] = match,
			variableName = completeVariableName(rule, variablePartialName)
		return [variableName, situation => situation(variableName) == string]
	}

	match = expressionTests['variable'](value)
	if (match) {
		let [variablePartialName] = match,
			variableName = completeVariableName(rule, variablePartialName)

		return [
			variableName,
			situation => {
				// let yo = parentName(variableName),
				// ya = nameLeaf(variableName),
				// yi = situation(parentName(variableName))
				// debugger
				return situation(variableName) == 'oui' ||
				situation(parentName(variableName)) == nameLeaf(variableName)
			}]
	}
}
