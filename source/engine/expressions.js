import removeDiacritics from './remove-diacritics'
import R from 'ramda'
import {parentName, nameLeaf} from './rules'

// Ces regexp sont trop complexe. TODO Ce n'est que temporaire !

// composants des regexps
let
	vp = '[A-Za-z\\u00C0-\\u017F\\s]+', // variable part
	sep = '\\s\\.\\s',
	vn = `(${vp}(?:${sep}${vp})*)`

let expressionTests = {
	// 'negatedVariable': v => /!((?:[a-z0-9]|\s|_)+)/g.exec(v),
	// 'variableIsIncludedIn': v => /((?:[a-z0-9]|\s|_)+)⊂*/g.exec(v),
	// 'variableComparedToNumber': v => /([\w\s]+(?:\s\.\s[\w\s]+)*)\s([<>]=?)\s([0-9]+)/g.exec(v),
	'variableComparedToNumber': v => new RegExp(`^${vn}\\s([<>]=?)\\s([0-9]+)$`, 'g').exec(v),
	'variableEqualsString': v => /([\w\s]+(?:\s\.\s[\w\s]+)*)\s=\s([\w\s]+)/g.exec(v),
	'variable': v => new RegExp(`^${vn}$`, 'g').exec(v)
}

export let recognizeExpression = value => {
	let match

	// match = expressionTests['negatedVariable'](value)
	// if (match) {
	// 	let [, variableName] = match
	// 	// return [variableName, `!${variableName}`]
	// 	return [variableName, situation => situation(variableName) == 'non']
	// }

	match = expressionTests['variableComparedToNumber'](value)
	if (match) {

		let [, variableName, symbol, number] = match
		return [variableName, situation => eval(`situation("${variableName}") ${symbol} ${number}`)] // eslint-disable-line no-unused-vars
	}

	match = expressionTests['variableEqualsString'](value)
	if (match) {
		let [, variableName, string] = match
		return [variableName, situation => situation(variableName) == string]
	}

	match = expressionTests['variable'](value)
	if (match) {
		let [variableName] = match
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
