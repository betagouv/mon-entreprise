import removeDiacritics from './remove-diacritics'

// TODO: handle dotted variable syntax
// ([\w\s]+(\s\.?\s\w+)+)\s([<?>?]?=?)\s([\w\s]+)
var replace = "regex";
var re = new RegExp(replace,"g");
"mystring".replace(re, "newstring");

// Ces regexp sont trop complexe. Ce n'est que temporaire !

let expressionTests = {
	// 'negatedVariable': v => /!((?:[a-z0-9]|\s|_)+)/g.exec(v),
	// 'variableIsIncludedIn': v => /((?:[a-z0-9]|\s|_)+)⊂*/g.exec(v),
	'variableComparedToNumber': v => /([\w\s]+(?:\s\.\s[\w\s]+)*)\s([<>]=?)\s([0-9]+)/g.exec(v),
	'variableEqualsString': v => /([\w\s]+(?:\s\.\s[\w\s]+)*)\s=\s([\w\s]+)/g.exec(v),
	'variable': v => /^([\w\s]+(?:\s\.\s[\w\s]+)*)$/g.exec(v)
}

export let recognizeExpression = rawValue => {
	let
		value = removeDiacritics(rawValue).toLowerCase(),
		match

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
		return [variableName, situation => situation(variableName) == number]
	}

	match = expressionTests['variable'](value)
	if (match) {
		let [variableName] = match
		return [variableName, situation => situation(variableName) == 'oui']
	}
}
