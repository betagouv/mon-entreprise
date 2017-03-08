import R from 'ramda'
import {parentName, nameLeaf, findRuleByDottedName} from './rules'

// Ces regexp sont trop complexe. TODO Ce n'est que temporaire !

// Exemple de grammaire Instaparse (Clojure[script])
// https://github.com/Engelberg/instaparse#transforming-the-tree
// http://instaparse-live.matt.is/
/*
expr = add-sub
<add-sub> = mul-div | add | sub
add = add-sub <' + '> mul-div
sub = add-sub <' - '> mul-div
<mul-div> = term | mul | div
mul = mul-div <' * '> term
div = mul-div <' / '> term
<term> = variable | number | <'('> add-sub <')'>
number = #'[0-9]+'
<letter> = #'[a-zA-Z\u00C0-\u017F\s]'
variable-fragment = letter+
whitespace = #'\s'
dot = #'\s\.\s'
variable = variable-fragment (<dot> variable-fragment)*
*/

/*
Parsers en JS :
https://pegjs.org/online
Jison
Ce qui me semble le mieux : Nearley https://github.com/Hardmath123/nearley
*/



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
export let completeVariableName = ({attache, name}, partialName) => {
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

	return found && found.dottedName || do {throw `OUUUUPS la référence ${partialName} dans la règle : ${name} est introuvable dans la base`}
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

export let knownVariable = (situationGate, variableName) =>
		situationGate(variableName) != null
||	situationGate(parentName(variableName)) != null
// pour 'usage', 'motif' ( le parent de 'usage') = 'usage'

export let evaluateVariable = (situationGate, variableName) => {
	let value = situationGate(variableName)

	return R.is(Number)(value)
    ? value
    : value == 'oui' ||
        situationGate(parentName(variableName)) == nameLeaf(variableName)
}
