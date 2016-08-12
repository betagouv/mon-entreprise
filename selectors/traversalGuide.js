import R from 'ramda'
// used to aseptise all yaml text, to avoid doing regexps on accents...
import removeDiacritics from '../utils/remove-diacritics'

/* When you encounter a variable, it may have a calculable key.
This file provides an object with these mappings :
	calculable-key -> extract variables called by the calculation value */

let scalarMult = value => {
	value = removeDiacritics(value)
	// 4 * assiette cotisations sociales
	let match = /(?:([0-9])*\s\*\s)?((?:[a-z0-9]|\s|_)+)/g.exec(value)
	if (match) return match[2]
}

let logicalCondition = value => {
	value = removeDiacritics(value)
	let match, variable
	// ! ma variable
	if (R.contains('!')(value)) {
		match = /!((?:[a-z0-9]|\s|_)+)/g.exec(value)
		if (match) return match[1]
	}

	// département établissement ⊂ [57 67 68]
	if (R.contains('⊂')(value)) {
		match = /((?:[a-z0-9]|\s|_)+)⊂*/g.exec(value)
		if (match) return match[1]
	}

	// ma cotisation > 20
	match = /((?:[a-z0-9]|\s|_)+)([<|>]=?)\s+[0-9]+/g.exec(value)
	if (match) return match[1]

	// 20 <= ma cotisation
	match = /[0-9]+\s+([<|>]=?)((?:[a-z0-9]|\s|_)+)/g.exec(value)
	if (match) return match[2]

	// ma variable = xxxx z
	match = /((?:[a-z0-9]|\s|_)+)=((?:[a-z0-9]|\s|_)+)/g.exec(value)
	if (match) return match[1]

	// ma variable
	match = /((?:[a-z0-9]|\s|_)+)/g.exec(value)
	if (match) return match[1]

}

/*
Ce YAML :
- cond1
- cond2:
	- cond2.1:
		- cond2.1.1
		- cond2.1.2
	- cond2.2
		cond2.2.1
- cond3

se traduit en :
cond1 || (
	cond2 && (
		(
			cond2.1 && (
				cond2.1.1 ||
				cond2.1.2
			)
		) || cond2.2
	)
) || cond3

(':-D)

*/
let logic = list => { // a list is a ||
	return list.reduce((variables, next) =>
		typeof next == 'string' ?
			[...variables, logicalCondition(next)] :
			// it's a single key object -> we're facing a && condition
			[...variables, logicalCondition(R.keys(next)[0]), ...logic(R.values(next))]
	, [])
}
R.uniq(logic)


let plusOrMinus = R.cond([
	[R.is(String), removeDiacritics],
	[R.isArrayLike, R.map(plusOrMinus)],
	[R.is(Object), R.identity]
])

let traversalGuide = {
	linear: {
		base: scalarMult,
		limit: scalarMult,
		historique: null
		// VAR/case: logic predicate
	},
	marginalRateTaxScale: {
		base: scalarMult
		// VAR/case: logic predicate
	},
	concerne: logic,
	'ne concerne pas': logic,
	logique: logic, // predicates leading to a boolean,
	'logique numérique': () => null, // predicates leading to a number
	'+': plusOrMinus, // It's a string or list of string representing variable calls, that's all we want for now :-)
	'-': plusOrMinus // Same :-)
}

export default traversalGuide
