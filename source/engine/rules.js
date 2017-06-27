
// Séparation artificielle, temporaire, entre ces deux types de règles
import rawRules from './load-rules'
import R from 'ramda'
import possibleVariableTypes from './possibleVariableTypes.yaml'
import marked from './marked'

 // console.log('rawRules', rawRules.map(({espace, nom}) => espace + nom))
/***********************************
 Méthodes agissant sur une règle */

// Enrichissement de la règle avec des informations évidentes pour un lecteur humain
export let enrichRule = rule => {
	let
		type = possibleVariableTypes.find(t => R.has(t, rule)),
		name = rule['nom'],
		ns = rule['espace'],
		dottedName = ns ? [
			ns,
			name
		].join(' . ') : name,
		subquestionMarkdown = rule['sous-question'],
		subquestion = subquestionMarkdown && marked(subquestionMarkdown)

	return {...rule, type, name, ns, dottedName, subquestion}
}

export let hasKnownRuleType = rule => rule && enrichRule(rule).type

export let
	splitName = R.split(' . '),
	joinName = R.join(' . ')

export let parentName = R.pipe(
	splitName,
	R.dropLast(1),
	joinName
)
export let nameLeaf = R.pipe(
	splitName,
	R.last
)

export let encodeRuleName = name => name.replace(/\s/g, '-')
export let decodeRuleName = name => name.replace(/\-/g, ' ')

/* Les variables peuvent être exprimées dans la formule d'une règle relativement à son propre espace de nom, pour une plus grande lisibilité. Cette fonction résoud cette ambiguité.
*/

export let disambiguateRuleReference = (allRules, {ns, name}, partialName) => {
	let
		fragments = ns.split(' . '), // ex. [CDD . événements . rupture]
		pathPossibilities = // -> [ [CDD . événements . rupture], [CDD . événements], [CDD] ]
			R.range(0, fragments.length + 1)
			.map(nbEl => R.take(nbEl)(fragments))
			.reverse(),
		found = R.reduce((res, path) =>
			R.when(
				R.is(Object), R.reduced
			)(findRuleByDottedName(allRules, [...path, partialName].join(' . ')))
		, null, pathPossibilities)

	return found && found.dottedName || do {throw `OUUUUPS la référence '${partialName}' dans la règle '${name}' est introuvable dans la base`}
}

// On enrichit la base de règles avec des propriétés dérivées de celles du YAML
export let rules = rawRules.map(enrichRule)


/****************************************
 Méthodes de recherche d'une règle */

export let findRuleByName = (allRules, search) =>
	allRules
		.find( ({name}) =>
			name.toLowerCase() === search.toLowerCase()
		)

export let searchRules = searchInput =>
	rules
		.filter( rule =>
			rule && hasKnownRuleType(rule) &&
			JSON.stringify(rule).toLowerCase().indexOf(searchInput) > -1)
		.map(enrichRule)

export let findRuleByDottedName = (allRules, dottedName) => dottedName &&
	allRules.find(rule => rule.dottedName.toLowerCase() == dottedName.toLowerCase())

/*********************************
Autres */

let collectNodeMissingVariables = (root, source=root, results=[]) => {
	if (
    source.nodeValue != null  ||
    source.shortCircuit && source.shortCircuit(root)
  ) {
		// console.log('nodev or shortcircuit root, source', root, source)
		return []
	}

	if (source['missingVariables']) {
		// console.log('root, source', root, source)
		results.push(source['missingVariables'])
	}

	for (var prop in source) {
		if (R.is(Object)(source[prop])) {
			collectNodeMissingVariables(root, source[prop], results)
		}
	}
	return results
}

// On peut travailler sur une somme, les objectifs sont alors les variables de cette somme.
// Ou sur une variable unique ayant une formule, elle est elle-même le seul objectif
export let getObjectives = analysedSituation => {
	let formuleType = R.path(["formule", "explanation", "name"])(
		analysedSituation
	)
	return formuleType == "somme"
		? R.pluck(
				"explanation",
				R.path(["formule", "explanation", "explanation"])(analysedSituation)
			)
		: formuleType ? [analysedSituation] : null
}


export let collectMissingVariables = (groupMethod='groupByMissingVariable') => analysedSituation =>

	R.pipe(
		getObjectives,
		R.chain( v =>
			R.pipe(
				collectNodeMissingVariables,
				R.flatten,
				R.map(mv => [v.dottedName, mv])
			)(v)
		),
		//groupBy missing variable but remove mv from value, it's now in the key
		R.groupBy(groupMethod == 'groupByMissingVariable' ? R.last : R.head),
		R.map(R.map(groupMethod == 'groupByMissingVariable' ? R.head : R.last))
		// below is a hand implementation of above... function composition can be nice sometimes :')
		// R.reduce( (memo, [mv, dependencyOf]) => ({...memo, [mv]: [...(memo[mv] || []), dependencyOf] }), {})
	)(analysedSituation)

let isVariant = R.path(['formule', 'une possibilité'])

export let deprecated_findVariantsAndRecords =
	({variantGroups, recordGroups}, dottedName, childDottedName) => {
		let child = findRuleByDottedName(rules, dottedName),
			parentDottedName = parentName(dottedName),
			parent = findRuleByDottedName(rules, parentDottedName)
		if (isVariant(parent)) {
			let grandParentDottedName = parentName(parentDottedName),
				grandParent = findRuleByDottedName(rules, grandParentDottedName)
			if (isVariant(grandParent))
				return deprecated_findVariantsAndRecords({variantGroups, recordGroups}, parentDottedName, childDottedName || dottedName)
			else
				return {
					variantGroups: R.mergeWith(R.concat, variantGroups, {[parentDottedName]: [childDottedName || dottedName]}),
					recordGroups
				}
		} else
				return {
					variantGroups,
					recordGroups: R.mergeWith(R.concat, recordGroups, {[parentDottedName]: [dottedName]})
				}

	}
